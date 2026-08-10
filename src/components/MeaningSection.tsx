import { MEANINGS } from '../data';
import ImageWithFallback from './ImageWithFallback';

export default function MeaningSection() {
  return (
    <section className="section meaning">
      <div className="shell meaning-grid">
        <div className="meaning-copy">
          <p className="eyebrow gold">CHOOSE YOUR MEANING</p>
          <h2 className="section-title light">당신이 오래 기억하고 싶은 의미는 무엇인가요?</h2>

          <ul className="meaning-words">
            {MEANINGS.map((meaning) => (
              <li key={meaning.word} className="meaning-word" tabIndex={0}>
                <span className="meaning-label">{meaning.word}</span>
                <span className="meaning-note">{meaning.note}</span>
              </li>
            ))}
          </ul>

          <p className="meaning-close">
            UNVEIL은 당신이 선택한 의미를
            <br />
            일상에 지닐 수 있도록 돕습니다.
          </p>
        </div>

        <div className="meaning-media">
          <ImageWithFallback
            src="/images/wrist-lifestyle.webp"
            alt="검정 니트를 입은 사람이 손목에 UNVEIL 원석팔찌를 착용한 모습"
            width={484}
            height={510}
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}
