import { DISCOVERY_CARDS, type DiscoveryIcon } from '../data';
import { trackEvent } from '../track';
import { ArrowRight, ConstellationIcon, ElementsIcon, GemIcon } from './icons';
import StoreLink from './StoreLink';

function CardIcon({ name }: { name: DiscoveryIcon }) {
  if (name === 'elements') return <ElementsIcon className="disc-icon" />;
  if (name === 'constellation') return <ConstellationIcon className="disc-icon" />;
  return <GemIcon className="disc-icon" />;
}

export default function DiscoveryCards() {
  return (
    <section className="discovery" id="discovery" aria-label="원석 찾기">
      <div className="shell">
        <div className="disc-grid">
          {DISCOVERY_CARDS.map((card) => (
            <a
              key={card.id}
              className="disc-card"
              href={card.href}
              onClick={() => trackEvent(card.event)}
            >
              <CardIcon name={card.icon} />
              <h2 className="disc-title">{card.title}</h2>
              <p className="disc-desc">{card.description}</p>
              <span className="disc-cta">
                {card.cta}
                <ArrowRight className="inline-arrow" />
              </span>
            </a>
          ))}
        </div>

        <p className="disc-aside">
          팔찌부터 보고 싶다면{' '}
          <StoreLink event="click_smartstore">
            스마트스토어 바로가기
            <ArrowRight className="inline-arrow" />
          </StoreLink>
        </p>
      </div>
    </section>
  );
}
