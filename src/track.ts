import type { EventName } from './data';

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 가 붙어 있으면 이벤트를 보내고,
 * 없으면 개발 환경에서만 콘솔에 남깁니다. 운영 환경에서는 아무것도 하지 않습니다.
 */
export function trackEvent(eventName: EventName): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName);
    return;
  }

  if (import.meta.env.DEV) {
    console.info('[trackEvent]', eventName);
  }
}
