import { renderToString } from 'react-dom/server';
import App from './App';
import { COLLECTIONS, FAQ_ITEMS, SITE_URL } from './data';

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

/**
 * 검색엔진과 AI 답변 엔진이 읽는 구조화 데이터입니다.
 * data.ts 의 실제 문구에서 만들어지므로 화면과 내용이 어긋나지 않습니다.
 *
 * FAQPage 를 넣는 이유 — ChatGPT·Perplexity 같은 답변 엔진은
 * 질문과 답변이 짝지어진 형태를 그대로 인용하기 좋아합니다.
 */
export function structuredData(): string {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  // 가격·재고는 넣지 않습니다. 실제 판매는 스마트스토어에서 이루어지고,
  // 화면에 없는 가격을 구조화 데이터에만 넣으면 잘못된 정보로 취급될 수 있습니다.
  const collections = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#collections`,
    name: '의미 컬렉션',
    description: 'UNVEIL 이 의미별로 묶은 8mm 천연 원석팔찌 컬렉션입니다.',
    itemListElement: COLLECTIONS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.title,
      description: `${c.keywords.join(' · ')} — ${c.stone}`,
      image: `${SITE_URL}${c.image}`,
    })),
  };

  return [faq, collections]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n    ');
}
