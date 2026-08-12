// 빌드 결과물(dist/)을 서비스하는 정적 서버입니다.
//
// 왜 필요한가
//   Cloud Run 은 컨테이너를 만든 뒤 `npm start` 로 실행합니다.
//   실행할 명령이 없으면 서비스를 만들지 못하고
//   "Failed to create Cloud Run service" 로 끝납니다.
//
// 왜 외부 패키지를 안 쓰나
//   설치 실패는 배포 실패로 이어집니다. Node 기본 모듈만 씁니다.
//
// nginx 설정(deploy/nginx/)과 같은 정책을 적용합니다. 그쪽은 컨테이너를
// 직접 만들 때 쓰고, 이 파일은 플랫폼이 알아서 빌드해 줄 때 쓰입니다.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve('dist');
const PORT = Number(process.env.PORT) || 8080;

// 한글이 깨지지 않도록 텍스트 형식에는 charset 을 명시합니다.
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

// public/_headers 와 같은 내용입니다. Cloud Run 은 그 파일을 읽지 않으므로
// 여기서 직접 붙입니다. frame-ancestors 는 meta 로는 적용되지 않아
// 헤더로 보내야만 실제로 동작합니다.
const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; " +
    "connect-src 'self'; manifest-src 'self'; worker-src 'self'; " +
    "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
};

function cacheFor(pathname) {
  // 파일명에 해시가 붙는 자산은 영구 캐시가 안전합니다.
  if (pathname.startsWith('/assets/')) return 'public, max-age=31536000, immutable';
  if (pathname.startsWith('/images/')) return 'public, max-age=86400, stale-while-revalidate=604800';
  // 이 둘을 캐시하면 갱신이 걸리지 않습니다.
  if (pathname === '/sw.js' || pathname === '/manifest.json') {
    return 'public, max-age=0, must-revalidate';
  }
  // 크롤러가 자주 확인하는 파일
  if (['/robots.txt', '/sitemap.xml', '/llms.txt'].includes(pathname)) {
    return 'public, max-age=3600';
  }
  return 'public, max-age=300';
}

/** dist 밖으로 나가는 경로를 막습니다. */
function safeJoin(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    // 퍼센트 인코딩이 깨진 주소입니다. decodeURIComponent 는 여기서 URIError 를
    // 던지는데, 그대로 두면 요청 하나가 서버 전체를 내립니다.
    return null;
  }
  // NUL 이 섞인 경로는 파일 시스템 호출에서 예외가 됩니다.
  if (decoded.includes('\0')) return null;
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const full = resolve(join(ROOT, clean));
  return full === ROOT || full.startsWith(ROOT + sep) ? full : null;
}

/** 그 주소가 index.html 을 가진 디렉터리인지. 301 판단에 씁니다. */
async function isDirectory(pathname) {
  const base = safeJoin(pathname);
  if (!base) return false;
  try {
    if (!(await stat(base)).isDirectory()) return false;
    await stat(join(base, 'index.html'));
    return true;
  } catch {
    return false;
  }
}

async function findFile(pathname) {
  const base = safeJoin(pathname);
  if (!base) return null;
  try {
    const info = await stat(base);
    // 디렉터리 주소는 그 안의 index.html 을 내보냅니다.
    if (info.isDirectory()) {
      const idx = join(base, 'index.html');
      await stat(idx);
      return idx;
    }
    return base;
  } catch {
    return null;
  }
}

function send(res, status, file, pathname, headers = {}) {
  res.writeHead(status, {
    'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': cacheFor(pathname),
    ...SECURITY,
    ...headers,
  });
  createReadStream(file).pipe(res);
}

async function handle(req, res) {
  const pathname = (req.url ?? '/').split('?')[0].split('#')[0];

  if (pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ok\n');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD', ...SECURITY });
    res.end();
    return;
  }

  // 슬래시 없이 들어온 디렉터리 주소(/birthstone/5)는 슬래시를 붙여 한 주소로
  // 모읍니다. 그냥 내보내면 같은 내용이 두 주소로 잡혀 검색엔진이 중복으로 봅니다.
  if (!pathname.endsWith('/') && (await isDirectory(pathname))) {
    res.writeHead(301, { Location: pathname + '/', ...SECURITY });
    res.end();
    return;
  }

  const file = await findFile(pathname);

  if (!file) {
    // 없는 주소는 진짜 404 여야 검색엔진이 유령 페이지를 색인하지 않습니다.
    // SPA 처럼 전부 index.html 로 보내지 않습니다.
    const notFound = await findFile('/404.html');
    if (notFound) {
      send(res, 404, notFound, pathname, { 'Cache-Control': 'no-store' });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
      res.end('404 Not Found\n');
    }
    return;
  }

  if (req.method === 'HEAD') {
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
      ...SECURITY,
    });
    res.end();
    return;
  }

  send(res, 200, file, pathname);
}

// 요청 하나가 잘못돼도 서버 전체가 내려가면 안 됩니다.
// 비동기 핸들러에서 던져진 예외는 잡지 않으면 프로세스를 종료시킵니다.
const server = createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error('[server] 요청 처리 실패:', req.method, req.url, err?.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
    }
    res.end('500 Internal Server Error\n');
  });
});

// 예상 못 한 오류로도 컨테이너가 죽지 않게 합니다.
// Cloud Run 은 프로세스가 죽으면 인스턴스를 내립니다.
process.on('uncaughtException', (err) => {
  console.error('[server] uncaughtException:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('[server] unhandledRejection:', err);
});

// Cloud Run 은 0.0.0.0 의 PORT 로 들어옵니다. 127.0.0.1 에만 열면 안 됩니다.
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] dist/ 를 http://0.0.0.0:${PORT} 에서 서비스합니다`);
});
