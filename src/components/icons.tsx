/**
 * 이 프로젝트에서 쓰는 모든 아이콘입니다.
 * 외부 아이콘 라이브러리를 쓰지 않고 얇은 선 스타일로 직접 그렸습니다.
 * 전부 장식용이므로 aria-hidden 을 붙입니다.
 */

interface IconProps {
  className?: string;
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
  focusable: 'false' as const,
};

/** 로고 옆 작은 4방향 별. */
export function SparkMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 0c.6 4.9 1.9 8 3.6 9.6C17.3 11.3 20 12 24 12c-4.9.6-8 1.9-9.6 3.6C12.7 17.3 12 20 12 24c-.6-4.9-1.9-8-3.6-9.6C6.7 12.7 4 12 0 12c4.9-.6 8-1.9 9.6-3.6C11.3 6.7 12 4 12 0z" />
    </svg>
  );
}

/** 사주오행 — 다섯 기운이 도는 형태. */
export function ElementsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <circle cx="24" cy="12" r="6.4" />
      <circle cx="35.4" cy="20.3" r="6.4" />
      <circle cx="31.1" cy="33.7" r="6.4" />
      <circle cx="16.9" cy="33.7" r="6.4" />
      <circle cx="12.6" cy="20.3" r="6.4" />
    </svg>
  );
}

/** 별자리 — 선으로 이어진 별. */
export function ConstellationIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M9 30.5 18.5 15l9.5 9 5.5-8.5L40 27" />
      <circle cx="9" cy="30.5" r="2.1" />
      <circle cx="18.5" cy="15" r="2.6" />
      <circle cx="28" cy="24" r="2.1" />
      <circle cx="33.5" cy="15.5" r="1.8" />
      <circle cx="40" cy="27" r="2.4" />
      <circle cx="15" cy="38" r="1.3" />
      <circle cx="36" cy="36.5" r="1.3" />
    </svg>
  );
}

/** 탄생석 — 절제된 보석 실루엣. */
export function GemIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M15.5 12h17l7 9.5L24 38 8.5 21.5 15.5 12Z" />
      <path d="M8.5 21.5h31" />
      <path d="M15.5 12 24 21.5 32.5 12" />
      <path d="M24 21.5V38" />
    </svg>
  );
}

/** 1단계 — 기준을 고릅니다. */
export function ChooseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M10 15h28M10 24h28M10 33h28" />
      <circle cx="18" cy="15" r="3.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 2단계 — 연결된 의미를 봅니다. */
export function MeaningIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <circle cx="24" cy="24" r="13" />
      <circle cx="24" cy="24" r="4.6" />
      <path d="M24 11v-4M24 41v-4M11 24H7M41 24h-4" />
    </svg>
  );
}

/** 3단계 — 실물을 확인합니다. */
export function VerifyIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <circle cx="21.5" cy="21.5" r="11.5" />
      <path d="m30 30 8 8" />
      <path d="m16.5 21.5 3.6 3.6 6.9-7.2" />
    </svg>
  );
}

/* ---- 품질 기준 4가지 ---- */

/** 천연 원석 사용. */
export function StoneIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M18 8h12l8 12-14 20L10 20 18 8Z" />
      <path d="M18 8 24 20 30 8" />
      <path d="M10 20h28" />
    </svg>
  );
}

/** 실물 검수 & 촬영. */
export function CameraIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M8 16h7l3-4h12l3 4h7a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2Z" />
      <circle cx="24" cy="27" r="7" />
    </svg>
  );
}

/** 오래 쓰도록 관리 — 되돌아오는 화살표로 수선·관리를 나타냅니다. */
export function CareIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M38 24a14 14 0 1 1-4.1-9.9" />
      <path d="M34 6v9h-9" />
      <circle cx="24" cy="24" r="4.2" />
    </svg>
  );
}

/** 의미 카드 & 패키지. */
export function GiftIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" {...base}>
      <path d="M8 20h32v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V20Z" />
      <path d="M6 14h36v6H6z" />
      <path d="M24 14v26" />
      <path d="M24 14c-3-6-11-6-11-1 0 3 5 3.6 11 1Zm0 0c3-6 11-6 11-1 0 3-5 3.6-11 1Z" />
    </svg>
  );
}

/** 오른쪽 화살표. */
export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base} strokeWidth={1.3}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/** 단계 사이의 가는 화살표. */
export function StepArrow({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 12" {...base} preserveAspectRatio="none">
      <path d="M0 6h60" />
      <path d="m55 2 5 4-5 4" />
    </svg>
  );
}

/** FAQ 여닫기 표시. */
export function Chevron({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base} strokeWidth={1.4}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/** 모바일 메뉴 열기. */
export function MenuIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base} strokeWidth={1.4}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

/** 모바일 메뉴 닫기. */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...base} strokeWidth={1.4}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
