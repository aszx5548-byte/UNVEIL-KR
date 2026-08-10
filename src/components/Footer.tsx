import { useState } from 'react';
import { FOOTER_DISCLAIMER, FOOTER_LINKS } from '../data';
import { SparkMark } from './icons';

export default function Footer() {
  // 아직 페이지가 없는 항목을 눌렀을 때 보여줄 안내입니다.
  const [notice, setNotice] = useState('');
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <p className="wordmark footer-wordmark">
            UNVEIL
            <SparkMark className="wordmark-spark" />
          </p>
          <p className="footer-line">나와 연결되는 하나의 의미, UNVEIL.</p>
        </div>

        <nav className="footer-menu" aria-label="푸터 메뉴">
          {FOOTER_LINKS.map((link) =>
            link.href ? (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                type="button"
                className="footer-pending"
                onClick={() => setNotice(`${link.label} 페이지 준비 중입니다.`)}
              >
                {link.label}
              </button>
            ),
          )}
        </nav>
      </div>

      <div className="shell">
        <p className="footer-notice" role="status">
          {notice}
        </p>
        <p className="footer-disclaimer">{FOOTER_DISCLAIMER}</p>
        <p className="footer-copy">© {year} UNVEIL. All rights reserved.</p>
      </div>
    </footer>
  );
}
