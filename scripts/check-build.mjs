// 빌드 결과물이 실제로 배포해도 되는 상태인지 확인합니다.
// 컨테이너 빌드 중에 돌면서, 하나라도 어긋나면 배포를 멈춥니다.
//
// 지금까지 조용히 잘못 나갔던 것들을 그대로 검사 항목으로 만들었습니다.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// 검사할 폴더. 기본은 dist 입니다.
// --dist=<경로> 로 다른 폴더를 지정할 수 있습니다(검사기 자체를 시험할 때 씁니다).
// 위치 인자를 그냥 받으면, 실행하는 쪽이 예상 못 한 인자를 붙였을 때
// 엉뚱한 폴더를 검사하다 실패합니다. 이름 있는 옵션만 받습니다.
const arg = process.argv.slice(2).find((a) => a.startsWith('--dist='));
const DIST = arg ? arg.slice('--dist='.length) : 'dist';
const fail = [];

function read(p) {
  return readFileSync(join(DIST, p), 'utf8');
}

// ── 1. 프리렌더링 ──────────────────────────────
// 이게 빠지면 크롤러에게 빈 페이지가 나갑니다. 실제로 한 번 그렇게 나갔습니다.
//
// #root 뒤에 <script> 가 온다고 가정하면 안 됩니다. Vite 는 모듈 스크립트를
// <head> 에 넣기 때문에 본문 끝은 그냥 </div></body> 입니다.
// 태그를 걷어낸 실제 글자 수로 셉니다.
function bodyText(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const home = read('index.html');
const start = home.indexOf('<div id="root">');
const end = home.indexOf('</body>');
const injected = start < 0 || end < 0 ? '' : bodyText(home.slice(start, end));
if (injected.length < 1000) {
  fail.push(`프리렌더링 누락 — 크롤러가 읽는 본문이 ${injected.length}자 (1000자 이상이어야 함)`);
}
if (!home.includes('application/ld+json')) {
  fail.push('홈페이지에 JSON-LD 구조화 데이터가 없습니다');
}

// ── 2. 있어야 하는 파일 ────────────────────────
const MUST = [
  'robots.txt', 'sitemap.xml', 'llms.txt', '404.html', 'manifest.json',
  'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'content.css',
  // 링크 미리보기 카드. 페이지마다 다른 이미지를 씁니다.
  'images/og-home.jpg', 'images/og-saju.jpg',
  'images/og-zodiac.jpg', 'images/og-birthstone.jpg',
  'saju/index.html', 'zodiac/index.html', 'birthstone/index.html',
];
for (const f of MUST) {
  if (!existsSync(join(DIST, f))) fail.push(`파일 없음 — ${f}`);
}

// ── 3. 안내 페이지 29개 ────────────────────────
const pages = [];
for (let m = 1; m <= 12; m++) pages.push(`birthstone/${m}/index.html`);
for (const z of ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini',
                 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius']) {
  pages.push(`zodiac/${z}/index.html`);
}
for (const e of ['wood', 'fire', 'earth', 'metal', 'water']) {
  pages.push(`saju/${e}/index.html`);
}
const missing = pages.filter((p) => !existsSync(join(DIST, p)));
if (missing.length) fail.push(`안내 페이지 ${missing.length}개 누락 — ${missing[0]} 등`);

// ── 4. 나가면 안 되는 내용 ─────────────────────
const FORBIDDEN = [
  ['API 키', /AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}/],
  ['가격 표기', /\d{1,3},\d{3}\s*원|₩\s?\d/],
  // 화면에 안 보여도 소스에 남은 가격은 잡습니다. 소스를 열면 그대로 읽히고,
  // 8/23 앱 교체 때 실제로 unveilPrice:19900 이 이렇게 다시 들어왔습니다.
  ['소스에 남은 가격', /\b\w*[Pp]rice\s*[:=]\s*\d{3,}/],
  ['규격 8mm', /\b8\s?mm\b/i],
  ['깨진 문자열', /NNVEIL|TRNST|재재|연연|추연/],
  ['localhost 잔재', /localhost:\d+/],
];
const TEXT = new Set(['.html', '.css', '.js', '.txt', '.xml', '.json', '.svg', '.webmanifest']);
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    const dot = name.lastIndexOf('.');
    if (dot < 0 || !TEXT.has(name.slice(dot).toLowerCase())) continue;
    const src = readFileSync(p, 'utf8');
    for (const [label, rx] of FORBIDDEN) {
      const hit = src.match(rx);
      if (hit) fail.push(`${label} — ${p.replace(/\\/g, '/')} ("${hit[0]}")`);
    }
  }
}
walk(DIST);

// ── 5. sitemap 과 실제 페이지가 맞는지 ─────────
const sm = read('sitemap.xml');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const path = loc.replace(/^https?:\/\/[^/]+/, '');
  const file = path === '/' ? 'index.html' : join(path.replace(/^\/|\/$/g, ''), 'index.html');
  if (!existsSync(join(DIST, file))) fail.push(`sitemap 에 있는데 파일이 없음 — ${loc}`);
}

// ── 6. 고아 페이지 ─────────────────────────────
// sitemap 에만 있고 어디서도 링크되지 않는 페이지는, 사람이 클릭으로 도달할 수
// 없고 검색엔진도 중요도를 낮게 봅니다. 홈에서 링크를 따라가 닿는지 확인합니다.
const ASSET = /\.(css|js|mjs|png|jpe?g|webp|svg|ico|xml|txt|json|webmanifest|pdf)$/i;

function pagePath(file) {
  const rel = file.replace(/\\/g, '/').replace(/^dist\//, '');
  return rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
}

const graph = new Map();
function collectPages(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { collectPages(p); continue; }
    if (name !== 'index.html' && name !== '404.html') continue;
    const from = pagePath(p);
    const links = new Set();
    for (const m of readFileSync(p, 'utf8').matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1];
      if (ASSET.test(href)) continue;
      links.add(href.endsWith('/') || href === '/' ? href : href + '/');
    }
    graph.set(from, links);
  }
}
collectPages(DIST);

const seen = new Set(['/']);
const queue = ['/'];
while (queue.length) {
  for (const next of graph.get(queue.shift()) ?? []) {
    if (!seen.has(next)) { seen.add(next); queue.push(next); }
  }
}

const orphans = locs
  .map((l) => l.replace(/^https?:\/\/[^/]+/, ''))
  .filter((p) => !seen.has(p));
if (orphans.length) {
  fail.push(
    `고아 페이지 ${orphans.length}개 — 홈에서 링크로 도달할 수 없습니다: ${orphans.slice(0, 4).join(', ')}` +
      (orphans.length > 4 ? ' 등' : ''),
  );
}

// ── 결과 ───────────────────────────────────────
if (fail.length) {
  console.error('[check-build] 배포 중단 — 문제 ' + fail.length + '건');
  for (const f of fail) console.error('  X ' + f);
  process.exit(1);
}
console.log('[check-build] 통과');
console.log('  프리렌더링   : 크롤러가 읽는 본문 ' + injected.length + '자');
console.log('  안내 페이지  : ' + pages.length + '개');
console.log('  sitemap      : ' + locs.length + '개 주소, 전부 파일 존재');
console.log('  내부 링크    : 홈에서 ' + seen.size + '개 경로 도달, 고아 0개');
