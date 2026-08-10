import { DISCOVERY_CARDS } from '../data';
import { trackEvent } from '../track';
import { ArrowRight } from './icons';
import StoreLink from './StoreLink';

const START_LABELS: Record<string, string> = {
  saju: '사주오행으로 시작하기',
  zodiac: '별자리로 시작하기',
  birthstone: '탄생석으로 시작하기',
};

export default function FinalCTA() {
  return (
    <section className="section final">
      <div className="shell final-inner">
        <p className="eyebrow gold">FIND YOUR MEANING</p>
        <h2 className="section-title light center">지금의 나와 연결되는 의미를 찾아보세요.</h2>
        <p className="final-desc">가장 익숙한 기준 하나를 선택하세요.</p>

        <div className="final-buttons">
          {DISCOVERY_CARDS.map((card) => (
            <a
              key={card.id}
              className="final-button"
              href={card.href}
              onClick={() => trackEvent('click_final_cta')}
            >
              {START_LABELS[card.id] ?? card.title}
            </a>
          ))}
        </div>

        <p className="final-aside">
          <StoreLink event="click_smartstore">
            스마트스토어 바로가기
            <ArrowRight className="inline-arrow" />
          </StoreLink>
        </p>
      </div>
    </section>
  );
}
