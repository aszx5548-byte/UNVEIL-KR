/**
 * 빌드 후처리 — 홈페이지를 미리 그려서 dist/index.html 안에 넣습니다.
 *
 * 이걸 하지 않으면 크롤러가 받는 홈페이지 본문이 <div id="root"></div> 하나뿐이라
 * 검색엔진에 사실상 빈 페이지로 보입니다. 네이버는 자바스크립트 실행이 제한적이라
 * 특히 영향이 큽니다.
 *
 * 실행 순서 (package.json 의 build)
 *   1) vite build                       → dist/ (브라우저용)
 *   2) vite build --ssr entry-server    → dist-ssr/ (Node 용, 이 스크립트가 씀)
 *   3) node scripts/prerender.mjs       → dist/index.html 에 본문 주입
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const htmlPath = path.join(dist, 'index.html');
const serverEntry = path.resolve('dist-ssr', 'entry-server.js');

if (!fs.existsSync(serverEntry)) {
  console.error('[prerender] 서버 번들이 없습니다:', serverEntry);
  process.exit(1);
}

const { render } = await import(pathToFileURL(serverEntry).href);
const appHtml = render();

if (!appHtml || appHtml.length < 500) {
  console.error('[prerender] 렌더 결과가 비었거나 너무 짧습니다. 길이=%d', appHtml?.length ?? 0);
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf-8');
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  console.error('[prerender] index.html 에서 %s 를 찾지 못했습니다.', marker);
  process.exit(1);
}

html = html.replace(marker, `<div id="root">${appHtml}</div>`);
fs.writeFileSync(htmlPath, html, 'utf-8');

// 실제로 본문 글자가 들어갔는지 확인합니다.
const textOnly = html
  .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

console.log('[prerender] 완료');
console.log('  주입한 HTML   : %d bytes', appHtml.length);
console.log('  index.html    : %d bytes', html.length);
console.log('  크롤러가 읽는 본문 : %d 자', textOnly.length);

if (textOnly.length < 1000) {
  console.error('[prerender] 본문이 너무 짧습니다. 주입이 제대로 되지 않았을 수 있습니다.');
  process.exit(1);
}
