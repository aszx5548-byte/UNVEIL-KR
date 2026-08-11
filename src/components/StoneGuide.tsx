import { GUIDE_GROUPS } from '../data';
import { ArrowRight } from './icons';

/**
 * 안내 페이지 29개로 들어가는 목차입니다.
 *
 * 이 목차가 없으면 안내 페이지들은 아무 데서도 연결되지 않는 고아 페이지가 됩니다.
 * 사람은 클릭으로 도달할 수 없고, 검색엔진은 sitemap 으로 발견은 하되
 * 내부 링크가 없다는 이유로 중요도를 낮게 봅니다.
 */
export default function StoneGuide() {
  return (
    <section className="section guide" id="guide" aria-labelledby="guide-heading">
      <div className="shell">
        <div className="section-head">
          <p className="eyebrow">STONE GUIDE</p>
          <h2 className="section-title" id="guide-heading">
            달 · 별자리 · 오행으로 찾아보기
          </h2>
          <p className="section-desc">
            계산 없이 바로 볼 수 있는 안내 페이지입니다. 전통적으로 전해지는 대표석과
            UNVEIL이 실제로 취급하는 원석을 구분해 적었습니다.
          </p>
        </div>

        <div className="guide-groups">
          {GUIDE_GROUPS.map((group) => (
            <div className="guide-group" key={group.id}>
              <h3 className="guide-group-title">{group.title}</h3>
              <p className="guide-group-desc">{group.description}</p>

              <ul className="guide-links">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>

              <a className="guide-more" href={group.href}>
                직접 계산해서 찾기
                <ArrowRight className="inline-arrow" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
