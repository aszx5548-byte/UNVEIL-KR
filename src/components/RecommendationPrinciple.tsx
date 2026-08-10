const TAGS = ['같은 원석', '대안 원석', '의미 컬렉션'];

export default function RecommendationPrinciple() {
  return (
    <section className="section principle">
      <div className="shell principle-inner">
        <h2 className="section-title center">추천과 판매를 억지로 맞추지 않습니다.</h2>
        <p className="principle-desc">
          같은 원석이 판매 중이면 바로 연결합니다.
          <br />
          그렇지 않다면 대안 원석이나 의미가 가까운 팔찌를 제안합니다.
        </p>
        <ul className="tag-row">
          {TAGS.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
