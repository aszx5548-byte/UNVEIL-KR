import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
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
