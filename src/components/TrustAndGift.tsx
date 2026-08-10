import { TRUST_POINTS } from '../data';
import { ArrowRight } from './icons';
import ImageWithFallback from './ImageWithFallback';
import StoreLink from './StoreLink';

export default function TrustAndGift() {
  return (
    <section className="section trust" id="trust">
      <div className="shell trust-grid">
        <div className="trust-copy">
          <h2 className="section-title">
            선택하기 전에,
            <br />
            확인할 수 있어야 합니다.
          </h2>

          <ul className="trust-list">
            {TRUST_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <p className="trust-note">
            아름답고, 설명할 수 있고,
            <br />
            책임지고 판매할 수 있는 원석만 소개합니다.
          </p>
        </div>

        <div className="gift-card">
          <ImageWithFallback
            src="/images/gift-package.webp"
            alt="UNVEIL 기프트 박스와 의미 카드, 원석팔찌로 구성된 선물 패키지"
            width={584}
            height={625}
            className="gift-media"
          />
          <div className="gift-body">
            <h3 className="gift-title">선물에 이유가 필요할 때</h3>
            <p className="gift-desc">
              탄생석과 의미카드로
              <br />
              선택한 이유를 함께 전하세요.
            </p>
            <StoreLink className="gift-link" event="click_gift">
              선물용 팔찌 보기
              <ArrowRight className="inline-arrow" />
            </StoreLink>
          </div>
        </div>
      </div>
    </section>
  );
}
