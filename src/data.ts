/**
 * UNVEIL 홈페이지의 모든 텍스트·링크·상품 데이터를 모아둔 파일입니다.
 * 문구나 주소를 바꿀 일이 생기면 컴포넌트가 아니라 여기만 고치면 됩니다.
 */

/* ------------------------------------------------------------------ *
 * 외부/내부 링크
 * ------------------------------------------------------------------ */

/**
 * 사주오행 · 별자리 · 탄생석 앱 주소.
 *
 * 세 앱은 이 프로젝트의 public/saju, public/zodiac, public/birthstone 에 들어 있고
 * 빌드하면 dist/ 안에 그대로 복사되므로 같은 도메인의 내부 경로로 연결합니다.
 *
 * 통합 전에 쓰던 개별 Netlify 주소는 아래와 같았습니다.
 * 세 앱을 다시 분리해서 운영하게 되면 이 값만 그 주소로 바꾸면 됩니다.
 *   사주   https://earnest-mochi-720126.netlify.app
 *   별자리 https://vermillion-nougat-efd8e7.netlify.app
 *   탄생석 https://friendly-starburst-8ea7de.netlify.app
 */
export const APP_LINKS = {
  saju: '/saju/',
  zodiac: '/zodiac/',
  birthstone: '/birthstone/',
} as const;

/** 네이버 스마트스토어. 주소가 바뀌면 이 값만 교체하세요. */
export const SMARTSTORE_URL = 'https://smartstore.naver.com/unveil_store';

/** 링크 모음 페이지 (인스타 프로필 등에서 사용 중). */
export const LINKTREE_URL = 'https://litt.ly/unveil';

/* ------------------------------------------------------------------ *
 * 이벤트 이름
 * ------------------------------------------------------------------ */

export type EventName =
  | 'click_saju'
  | 'click_zodiac'
  | 'click_birthstone'
  | 'click_product'
  | 'click_collection'
  | 'click_smartstore'
  | 'click_gift'
  | 'click_final_cta';

/* ------------------------------------------------------------------ *
 * 헤더 메뉴
 * ------------------------------------------------------------------ */

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: '원석 찾기', href: '#discovery' },
  { label: '팔찌 보기', href: '#products' },
  { label: 'UNVEIL 기준', href: '#trust' },
  { label: '자주 묻는 질문', href: '#faq' },
];

/* ------------------------------------------------------------------ *
 * 세 가지 찾기 카드
 * ------------------------------------------------------------------ */

export type DiscoveryIcon = 'elements' | 'constellation' | 'gem';

export interface DiscoveryCard {
  id: string;
  icon: DiscoveryIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  event: EventName;
}

export const DISCOVERY_CARDS: DiscoveryCard[] = [
  {
    id: 'saju',
    icon: 'elements',
    title: '사주오행으로 찾기',
    description: '생년월일로 오행과 연결되는 원석을 살펴봅니다.',
    cta: '오행으로 알아보기',
    href: APP_LINKS.saju,
    event: 'click_saju',
  },
  {
    id: 'zodiac',
    icon: 'constellation',
    title: '별자리로 찾기',
    description: '내 별자리의 대표석과 추천 원석을 살펴봅니다.',
    cta: '별자리로 알아보기',
    href: APP_LINKS.zodiac,
    event: 'click_zodiac',
  },
  {
    id: 'birthstone',
    icon: 'gem',
    title: '탄생석으로 찾기',
    description: '내 탄생월의 대표석과 대안 원석을 비교합니다.',
    cta: '탄생월로 알아보기',
    href: APP_LINKS.birthstone,
    event: 'click_birthstone',
  },
];

/* ------------------------------------------------------------------ *
 * 원석팔찌 소개 + 품질 기준 4가지
 * ------------------------------------------------------------------ */

export type TrustIcon = 'stone' | 'camera' | 'size' | 'gift';

export interface TrustFeature {
  icon: TrustIcon;
  title: string;
  description: string;
}

export const TRUST_FEATURES: TrustFeature[] = [
  { icon: 'stone', title: '천연 원석 사용', description: '출처와 특성을 투명하게 안내합니다.' },
  { icon: 'camera', title: '실물 검수 & 촬영', description: '자연광으로 직접 확인한 사진만 씁니다.' },
  { icon: 'size', title: '8mm 표준 사이즈', description: '누구나 편안하게 착용할 수 있는 크기.' },
  { icon: 'gift', title: '의미 카드 & 패키지', description: '선물도, 나를 위한 다짐도 정성스럽게.' },
];

/* ------------------------------------------------------------------ *
 * 의미 컬렉션 5종
 *
 * 원석 선정 근거 — 아래 세 조건을 모두 만족하는 것으로 골랐습니다.
 *
 *  1. 전통적·문화적 상징이 컬렉션 키워드와 맞을 것
 *  2. `UNVEIL_최종소싱아이템_34종_260802.md` 의 확정 판매 SKU 일 것
 *     (추천 시스템에 배치되지 않은 원석은 재고를 만들지 않는다는 원칙)
 *  3. 실제 제품 촬영본이 있어 5장을 같은 배경·조명·비율로 보여줄 수 있을 것
 *
 * 세 번째 조건 때문에 제외한 후보가 있습니다.
 *  - 새로운 시작 → 카넬리안 (용기의 대표석, 화(火) 대표형)
 *  - 성공과 풍요 → 시트린 ("상인의 돌", 탄생석 11월 · 별자리 전갈 대표)
 * 둘 다 상징은 더 정확하지만 제품 촬영본이 없습니다. 촬영이 되면 교체를 권합니다.
 * ------------------------------------------------------------------ */

export interface Collection {
  id: string;
  title: string;
  /** 컬렉션을 설명하는 키워드 3개. */
  keywords: string[];
  /** 대표 원석. 카드에는 노출하지 않고 alt 텍스트와 운영 참고용으로 둡니다. */
  stone: string;
  image: string;
  alt: string;
  /** TODO: 컬렉션별 스마트스토어 기획전 URL로 교체 */
  href: string;
}

export const COLLECTIONS: Collection[] = [
  {
    // 아쿠아마린 — 라틴어 '바닷물'. 항해자가 안전한 여정을 위해 지녔다는 전승이 있어
    // 새 여정·전환·용기의 상징으로 이어집니다. 탄생석 3월 대표석이자 별자리 물고기 대표.
    id: 'new-beginning',
    title: '새로운 시작',
    keywords: ['용기', '시작', '전환'],
    stone: '아쿠아마린',
    image: '/images/collection-new-beginning.webp',
    alt: '맑은 청록빛 아쿠아마린 8mm 원석팔찌',
    href: SMARTSTORE_URL,
  },
  {
    // 그린아벤츄린 — 오행 목(木) 대표형. 사내 문서 표현으로 "균일한 연두, 가장 전형적인 초록".
    // 초록 계열은 전통적으로 균형·치유와 연결됩니다. 탄생석 5월, 별자리 황소 대표.
    id: 'calm',
    title: '안정과 평온',
    keywords: ['균형', '편안함', '치유'],
    stone: '그린아벤츄린',
    image: '/images/collection-calm.webp',
    alt: '차분한 초록빛 그린아벤츄린 8mm 원석팔찌',
    href: SMARTSTORE_URL,
  },
  {
    // 로즈쿼츠 — 사랑과 관계를 상징하는 원석으로 가장 널리 알려져 있습니다.
    // 탄생석 1월 두 번째 원석이자 별자리 염소 선택형.
    id: 'love',
    title: '사랑과 관계',
    keywords: ['사랑', '이해', '관계'],
    stone: '로즈쿼츠',
    image: '/images/collection-love.webp',
    alt: '부드러운 분홍빛 로즈쿼츠 8mm 원석팔찌',
    href: SMARTSTORE_URL,
  },
  {
    // 타이거아이 — 오행 토(土) 대표형. "금갈색 묘안 효과".
    // 전통적으로 자신감·결단과 연결되고, 금빛 색감이 풍요의 상징과 이어집니다.
    id: 'success',
    title: '성공과 풍요',
    keywords: ['성장', '자신감', '풍요'],
    stone: '타이거아이',
    image: '/images/collection-success.webp',
    alt: '금갈색 광택이 흐르는 타이거아이 8mm 원석팔찌',
    href: SMARTSTORE_URL,
  },
  {
    // 흑요석 — 오행 수(水) 대표형. "유리질 검정".
    // 전통적으로 보호를 상징하는 대표적인 원석입니다.
    id: 'protection',
    title: '보호와 회복',
    keywords: ['보호', '회복', '에너지'],
    stone: '실버흑요석',
    image: '/images/collection-protection.webp',
    alt: '깊은 검정빛 실버흑요석 8mm 원석팔찌',
    href: SMARTSTORE_URL,
  },
];

/* ------------------------------------------------------------------ *
 * 이용 흐름 3단계
 * ------------------------------------------------------------------ */

export type StepIcon = 'choose' | 'meaning' | 'verify';

export interface Step {
  icon: StepIcon;
  title: string;
}

export const STEPS: Step[] = [
  { icon: 'choose', title: '기준을 고릅니다' },
  { icon: 'meaning', title: '연결된 의미를 봅니다' },
  { icon: 'verify', title: '실물을 확인합니다' },
];

/* ------------------------------------------------------------------ *
 * 의미 네 가지
 * ------------------------------------------------------------------ */

export interface Meaning {
  word: string;
  note: string;
}

export const MEANINGS: Meaning[] = [
  { word: '성장', note: '새로운 시작' },
  { word: '안정', note: '나의 중심' },
  { word: '용기', note: '한 걸음' },
  { word: '관계', note: '소중한 연결' },
];

/* ------------------------------------------------------------------ *
 * 신뢰 기준
 * ------------------------------------------------------------------ */

export const TRUST_POINTS: string[] = [
  '정답을 강요하지 않습니다.',
  '의미와 사실을 구분합니다.',
  '확인한 제품만 연결합니다.',
];

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '결과는 과학적으로 검증된 진단인가요?',
    answer:
      '아닙니다. 사주오행·별자리·탄생석에 전해지는 상징과 UNVEIL의 큐레이션을 바탕으로 한 참고 콘텐츠입니다.',
  },
  {
    id: 'faq-2',
    question: '추천된 원석이 판매 중이 아니면 어떻게 되나요?',
    answer:
      '같은 원석을 판매할 수 없는 경우에는 색감·상징·분위기가 가까운 대안 원석을 함께 보여드립니다.',
  },
  {
    id: 'faq-3',
    question: '추천 결과와 판매상품은 어떻게 구분하나요?',
    answer:
      '대표 탄생석, 전통적 연결, UNVEIL 추천, 현재 판매상품을 각각 구분해 표시합니다.',
  },
  {
    id: 'faq-4',
    question: '천연석은 사진과 색이 모두 같은가요?',
    answer:
      '천연석은 원석마다 색, 무늬, 투명도와 내포물에 차이가 있습니다. 상품 페이지에서 실제 촬영 사진과 개체 차이 안내를 확인할 수 있습니다.',
  },
];

/* ------------------------------------------------------------------ *
 * 푸터
 * ------------------------------------------------------------------ */

/**
 * href 가 null 인 항목은 아직 실제 페이지가 없다는 뜻입니다.
 * 버튼으로 표시되고 누르면 "페이지 준비 중입니다." 안내가 뜹니다.
 * 페이지가 준비되면 null 을 실제 주소 문자열로 바꾸기만 하면 링크로 바뀝니다.
 */
export interface FooterLink {
  label: string;
  href: string | null;
}

export const FOOTER_LINKS: FooterLink[] = [
  // 약관·정책 문서는 public/legal/ 안의 정적 HTML 입니다.
  // 사업자 정보가 확정되면 각 문서의 노란색 표시 부분을 채워야 합니다.
  { label: '이용약관', href: '/legal/terms/' },
  { label: '개인정보처리방침', href: '/legal/privacy/' },
  { label: '배송·교환·반품 안내', href: '/legal/shipping/' },
  { label: '고객문의', href: '/legal/support/' },
  { label: '인스타그램', href: LINKTREE_URL },
  { label: '네이버 스마트스토어', href: SMARTSTORE_URL },
];

export const FOOTER_DISCLAIMER =
  'UNVEIL은 원석의 효능이나 건강·재물·연애·합격·운세 결과를 보장하지 않습니다. ' +
  '사주오행·별자리·탄생석 정보는 전통적·문화적 상징과 UNVEIL의 큐레이션을 바탕으로 제공합니다. ' +
  '소재와 처리 정보는 확인 가능한 범위에서 표시합니다.';
