import type { ReactNode } from 'react';
import { SMARTSTORE_URL, type EventName } from '../data';
import { trackEvent } from '../track';

interface StoreLinkProps {
  event: EventName;
  className?: string;
  children: ReactNode;
}

/**
 * 네이버 스마트스토어로 가는 링크입니다.
 * 주소와 이벤트 추적을 한 곳에 모아두려고 컴포넌트로 뺐습니다.
 * 주소를 바꿀 일이 생기면 data.ts 의 SMARTSTORE_URL 만 고치면 됩니다.
 */
export default function StoreLink({ event, className, children }: StoreLinkProps) {
  return (
    <a className={className} href={SMARTSTORE_URL} onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}
