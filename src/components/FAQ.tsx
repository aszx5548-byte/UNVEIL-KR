import { useState } from 'react';
import { FAQ_ITEMS } from '../data';
import { Chevron } from './icons';

export default function FAQ() {
  // 처음에는 모두 닫혀 있고, 한 번에 하나만 열립니다.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section faq" id="faq">
      <div className="shell faq-inner">
        <h2 className="section-title center">자주 묻는 질문</h2>

        <ul className="faq-list">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id} className="faq-item">
                <h3 className="faq-heading">
                  <button
                    type="button"
                    className="faq-button"
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    id={`${item.id}-button`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span className="faq-question">{item.question}</span>
                    <Chevron className={isOpen ? 'faq-chevron is-open' : 'faq-chevron'} />
                  </button>
                </h3>
                <div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-button`}
                  className="faq-panel"
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
