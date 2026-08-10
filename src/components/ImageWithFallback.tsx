import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  /** 레이아웃이 밀리지 않도록 항상 실제 비율을 넘겨줍니다. */
  width: number;
  height: number;
  loading?: 'eager' | 'lazy';
  className?: string;
  /** 어두운 배경 위에 놓일 때 대체 화면 색을 맞춥니다. */
  tone?: 'light' | 'dark';
}

/**
 * 이미지가 아직 없거나 불러오지 못했을 때 깨진 아이콘 대신
 * 브랜드 톤의 그라데이션 자리표시를 보여줍니다.
 */
export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className,
  tone = 'light',
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  const wrapperClass = ['media', className].filter(Boolean).join(' ');
  const ratio = `${width} / ${height}`;

  if (failed) {
    return (
      <div
        className={`${wrapperClass} media-placeholder media-placeholder-${tone}`}
        style={{ aspectRatio: ratio }}
        role="img"
        aria-label={alt}
      >
        <span className="media-placeholder-text">실제 상품 사진으로 교체 예정</span>
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
