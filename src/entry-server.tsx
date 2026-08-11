import { renderToString } from 'react-dom/server';
import App from './App';

/**
 * 빌드할 때 Node 에서 한 번 실행되어 홈페이지를 HTML 문자열로 만듭니다.
 * 이걸 dist/index.html 안에 심어두면, 자바스크립트를 실행하지 않는
 * 검색엔진(특히 네이버 Yeti)도 본문을 그대로 읽을 수 있습니다.
 *
 * 브라우저에서는 이 HTML 위에 React 가 hydrate 되므로 동작은 그대로입니다.
 */
export function render(): string {
  return renderToString(<App />);
}
