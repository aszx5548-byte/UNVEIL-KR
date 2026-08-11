import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');

if (container) {
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // 빌드할 때 홈페이지를 미리 그려 넣어두므로(scripts/prerender.mjs),
  // 이미 내용이 있으면 그 위에 hydrate 하고 없으면 새로 그립니다.
  // 프리렌더가 실패해도 사이트는 정상 동작합니다.
  if (container.hasChildNodes()) {
    ReactDOM.hydrateRoot(container, app);
  } else {
    ReactDOM.createRoot(container).render(app);
  }
}

// 서비스워커는 운영 빌드에서만 등록합니다.
// 개발 중에 등록하면 캐시 때문에 수정 사항이 바로 안 보입니다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* 등록 실패해도 사이트 이용에는 지장이 없습니다. */
    });
  });
}
