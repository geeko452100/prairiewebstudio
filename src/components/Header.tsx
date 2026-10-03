import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation } from 'react-router';
import Logo from './Logo';
import { NAV_LINKS, PHONE_DISPLAY, PHONE_HREF } from '../site';

const CALL_LABEL = `Call Prairie Web Studio at ${PHONE_DISPLAY}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) navRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
  }, [open]);

  function handleNavKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/80 bg-[#f4ead0]/95 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo priority />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link inline-flex">
              {label}
            </Link>
          ))}
          <a href={PHONE_HREF} className="btn-primary gap-2" aria-label={CALL_LABEL}>
            <img src="/assets/call.svg" alt="" width="16" height="16" />
            Call {PHONE_DISPLAY}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a href={PHONE_HREF} className="btn-primary gap-1.5 px-3 py-2 text-xs" aria-label={CALL_LABEL}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
            </svg>
            {PHONE_DISPLAY}
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-ink-200 text-ink-700"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <nav
        ref={navRef}
        id="mobile-nav"
        className={`${open ? '' : 'hidden '}border-t border-ink-100 bg-white px-4 py-4 md:hidden`}
        aria-label="Mobile"
        inert={!open}
        onKeyDown={handleNavKeyDown}
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="nav-link flex rounded-lg px-3 py-2 hover:bg-brand-50">
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a href={PHONE_HREF} className="btn-primary w-full gap-2" aria-label={CALL_LABEL}>
              Call {PHONE_DISPLAY}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
