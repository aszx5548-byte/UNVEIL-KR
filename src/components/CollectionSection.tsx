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

        {/* 스토어로 곧장 보내기 전에, 다섯 컬렉션을 견줘 볼 수 있는 페이지를 먼저 둡니다.
            원석 이름을 모르고 '원석팔찌'로 찾아온 사람이 닿는 자리이기도 합니다. */}
        <p className="section-aside">
          <a href="/bracelets/">
            다섯 컬렉션 비교해보기
            <ArrowRight className="inline-arrow" />
          </a>
        </p>
        <p className="section-aside">
          <StoreLink event="click_smartstore">
            스마트스토어에서 모든 상품 보기
            <ArrowRight className="inline-arrow" />
          </StoreLink>
        </p>
      </div>
    </section>
  );
}
