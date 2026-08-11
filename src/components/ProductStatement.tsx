import { ArrowRight } from './icons';
import ImageWithFallback from './ImageWithFallback';
import StoreLink from './StoreLink';

export default function ProductStatement() {
  return (
    <section className="section statement" id="products">
      <div className="shell statement-grid">
        <div className="statement-media">
          <ImageWithFallback
            src="/images/product-statement.webp"
            alt="어두운 석재 위에 놓인 여러 빛깔의 UNVEIL 천연 원석팔찌"
            width={630}
            height={350}
          />
        </div>

        <div className="statement-copy">
          <p className="eyebrow">검증된 원석, 정직한 가치</p>
          {/* 브랜드의 대상은 '원석'입니다. 팔찌는 지금의 형태일 뿐이므로
              제목에서 제품군을 못 박지 않습니다. */}
          <h2 className="section-title">
            의미를 담은
            <br />
            천연 원석
          </h2>
          <p className="statement-desc">
            자연이 만든 고유한 빛과 결을
            <br />
            직접 보고, 느끼고, 선택하세요.
          </p>
          <StoreLink className="statement-link" event="click_smartstore">
            스마트스토어 바로가기
            <ArrowRight className="inline-arrow" />
          </StoreLink>
        </div>
      </div>
    </section>
  );
}
