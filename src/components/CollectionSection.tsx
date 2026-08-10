import { COLLECTIONS } from '../data';
import { trackEvent } from '../track';
import { ArrowRight } from './icons';
import ImageWithFallback from './ImageWithFallback';
import StoreLink from './StoreLink';

export default function CollectionSection() {
  return (
    <section className="section collections" id="collections">
      <div className="shell">
        <h2 className="section-title center">지금, 당신에게 어울리는 의미 컬렉션</h2>

        <ul className="collection-grid">
          {COLLECTIONS.map((collection) => (
            <li key={collection.id}>
              <a
                className="collection-card"
                href={collection.href}
                onClick={() => trackEvent('click_collection')}
              >
                <ImageWithFallback
                  src={collection.image}
                  alt={collection.alt}
                  width={520}
                  height={390}
                  className="collection-media"
                />
                <p className="collection-title">{collection.title}</p>
                <p className="collection-keywords">{collection.keywords.join(' · ')}</p>
              </a>
            </li>
          ))}
        </ul>

        <p className="section-aside">
          <StoreLink event="click_smartstore">
            모든 컬렉션 보기
            <ArrowRight className="inline-arrow" />
          </StoreLink>
        </p>
      </div>
    </section>
  );
}
