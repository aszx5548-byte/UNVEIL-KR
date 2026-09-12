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
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const ROOT = resolve('dist');
const PORT = Number(process.env.PORT) || 3000;

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

// ── 주소 자동 교정 ────────────────────────────────────────────────
// 빌드된 파일에는 주소가 문자열로 박혀 있습니다(canonical·og:url·sitemap·
// 구조화 데이터 등 280곳). 배포 주소가 바뀌면 그 전부가 죽은 주소를 가리키고,
// 특히 canonical 은 "원본은 저쪽"이라는 선언이라 검색에서 아예 빠집니다.
//
// 그래서 내보낼 때 실제 접속 주소로 맞춰줍니다. 파일을 다시 만들지 않아도
// 어느 도메인에 올리든 주소가 저절로 맞습니다.
const KNOWN_ORIGINS = ['https://unveil.ai.studio', 'https://unveil-kr.ai.studio'];

// 이 확장자만 손댑니다. 이미지·폰트는 그대로 흘려보냅니다.
const REWRITE_EXT = new Set(['.html', '.xml', '.txt', '.json', '.webmanifest']);

// Host 헤더는 요청하는 쪽이 마음대로 적을 수 있습니다. 아무 값이나 믿으면
// 공격자가 canonical 을 자기 주소로 바꿔치기할 수 있습니다(캐노니컬 포이즈닝).
//
// 전에는 ai.studio·pages.dev·run.app·vercel.app 을 도메인 형태로 허용했는데,
// 이 넷은 누구나 하위 도메인을 무료로 만들 수 있는 곳입니다. 즉
// X-Forwarded-Host: evil.pages.dev 한 줄로 우리 canonical 이 남의 주소가 됐습니다.
// 막으려던 공격에 그대로 열려 있었습니다.
//
// 그래서 형태가 아니라 주소 자체를 적어둡니다. 도메인을 옮길 때는 이 목록에
// 추가하거나, 더 간단하게 SITE_ORIGIN 환경변수를 지정하면 됩니다.
const TRUSTED_HOSTS = new Set([
  'unveil-kr.ai.studio',
  'unveil.ai.studio',
  'localhost',
  '127.0.0.1',
]);

// http / https 외의 스킴은 주소가 아니라 주입입니다.
const SAFE_SCHEME = /^https?$/i;

function liveOrigin(req) {
  // 명시적으로 지정했으면 그것이 우선입니다. 가장 안전한 방법입니다.
  if (process.env.SITE_ORIGIN) return process.env.SITE_ORIGIN.replace(/\/+$/, '');

  const raw = String(req.headers['x-forwarded-host'] ?? req.headers.host ?? '');
  const host = raw.split(',')[0].trim();
  if (!/^[a-z0-9.-]+(:\d+)?$/i.test(host)) return null;
  if (!TRUSTED_HOSTS.has(host.replace(/:\d+$/, '').toLowerCase())) return null;

  // 이 값도 요청하는 쪽이 적습니다. 검사 없이 주소에 끼워 넣으면 HTML 안으로
  // 그대로 들어갑니다. `"><script>...` 를 보내면 canonical 이 닫히면서
  // 페이지에 스크립트 태그가 생깁니다. 실제로 재현됐습니다.
  const proto = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim();
  const local = host.startsWith('localhost') || host.startsWith('127.');
  const scheme = SAFE_SCHEME.test(proto) ? proto.toLowerCase() : local ? 'http' : 'https';
  return `${scheme}://${host}`;
}

function rewriteOrigins(text, origin) {
  let out = text;
  for (const old of KNOWN_ORIGINS) {
    if (old !== origin) out = out.split(old).join(origin);
  }
  return out;
}

function cacheFor(rawPathname) {
  // 접두사를 보기 전에 주소를 먼저 펴야 합니다.
  // 전에는 원본 문자열의 앞글자만 봤더니 /assets/..%2findex.html 이
  // "/assets/ 로 시작하니 1년 영구 캐시" 로 판정됐습니다. 실제로 나가는 파일은
  // index.html 이라, 한 번 연 브라우저는 1년 동안 옛 홈페이지에 갇혔습니다.
  let pathname = rawPathname;
  try {
    pathname = normalize(decodeURIComponent(rawPathname)).replace(/\\/g, '/');
  } catch {
    // 디코딩이 안 되는 주소는 어차피 safeJoin 에서 걸러집니다.
    // 여기서는 가장 짧은 캐시를 줍니다.
    return 'public, max-age=300';
  }

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

async function send(res, status, file, pathname, origin, headers = {}) {
  const ext = extname(file).toLowerCase();
  const base = {
    'Content-Type': TYPES[ext] ?? 'application/octet-stream',
    'Cache-Control': cacheFor(pathname),
    ...SECURITY,
    ...headers,
  };

  // 주소를 손봐야 하는 형식이면 한 번 읽어 고쳐서 내보냅니다.
  // 여기 해당하는 파일은 가장 큰 것이 30KB 남짓이라 통째로 읽어도 부담이 없습니다.
  if (origin && REWRITE_EXT.has(ext)) {
    const text = rewriteOrigins(await readFile(file, 'utf8'), origin);
    const body = Buffer.from(text, 'utf8');
    res.writeHead(status, { ...base, 'Content-Length': body.byteLength });
    res.end(body);
    return;
  }

  res.writeHead(status, base);
  createReadStream(file).pipe(res);
}

async function handle(req, res) {
  const pathname = (req.url ?? '/').split('?')[0].split('#')[0];

  if (pathname === '/healthz') {
    // 여기만 보안 헤더가 빠져 있었습니다. 내용은 "ok" 한 줄이라 위험하진 않지만,
    // 한 군데만 규칙이 다르면 나중에 그게 기준인 줄 알게 됩니다.
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
    res.end('ok\n');
    return;
  }

  // _headers 와 _redirects 는 Cloudflare·Netlify 가 읽는 설정 파일입니다.
  // Cloud Run 에서는 아무 일도 하지 않으면서 그대로 공개됩니다.
  // dist 에는 남겨두고(다른 호스팅으로 옮길 때 필요) 내보내지만 않습니다.
  if (pathname === '/_headers' || pathname === '/_redirects') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...SECURITY });
    res.end('Not Found\n');
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

  const origin = liveOrigin(req);

  if (!file) {
    // 없는 주소는 진짜 404 여야 검색엔진이 유령 페이지를 색인하지 않습니다.
    // SPA 처럼 전부 index.html 로 보내지 않습니다.
    const notFound = await findFile('/404.html');
    if (notFound) {
      await send(res, 404, notFound, pathname, origin, { 'Cache-Control': 'no-store' });
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

  await send(res, 200, file, pathname, origin);
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