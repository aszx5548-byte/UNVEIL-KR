import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '../data';
import { CloseIcon, MenuIcon, SparkMark } from './icons';

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // 모바일 메뉴는 ESC 키와 바깥 클릭으로 닫힙니다.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current && panelRef.current.contains(target)) return;
      if (buttonRef.current && buttonRef.current.contains(target)) return;
      setOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell header-row">
        <a className="wordmark" href="#top">
          UNVEIL
          <SparkMark className="wordmark-spark" />
        </a>

        <nav className="nav-desktop" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="nav-toggle"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon className="nav-toggle-icon" /> : <MenuIcon className="nav-toggle-icon" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={open ? 'nav-mobile is-open' : 'nav-mobile'}
        hidden={!open}
      >
        <nav className="shell" aria-label="모바일 메뉴">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
