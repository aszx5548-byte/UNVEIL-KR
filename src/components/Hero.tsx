import ImageWithFallback from './ImageWithFallback';

const TRUST_NOTES = ['모든 찾기 기능 무료', '기준과 이유를 구분해 설명', '확인한 상품만 연결'];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="hero-hook">나는 어떤 원석과 연결되어 있을까?</p>
          {/* 줄바꿈을 브라우저에 맡기면 가운뎃점이 줄 앞으로 넘어가 '·별자리'처럼 끊깁니다.
              끊을 자리를 직접 정하고 각 줄을 nowrap 으로 묶어, 점이 줄 앞이나 끝에 혼자 남지 않게 합니다. */}
          <h1 className="hero-title">
            <span className="nb">사주 음양오행 · 궁합</span>
            <br />
            <span className="nb">별자리 · 탄생석으로</span>
            <br />
            나와 연결되는 원석을 찾다.
          </h1>
          <p className="hero-sub">
            가장 익숙한 기준 하나를 선택하세요. 결과에 맞는 천연 원석팔찌까지 이어집니다.
          </p>

          <ul className="hero-notes">
            {TRUST_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="hero-media">
          <ImageWithFallback
            src="/images/hero-bracelet.webp"
            alt="어두운 석재 위에 놓인 UNVEIL 천연 원석팔찌"
            width={624}
            height={575}
            loading="eager"
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}
