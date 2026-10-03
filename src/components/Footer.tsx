import { Link } from 'react-router';
import { NAV_LINKS } from '../site';

export default function Footer() {
  return (
    <>
      {/* Decorative local farm-town band — the field rises out of the footer */}
      <img
        src="/assets/field-band.svg"
        alt=""
        width="1440"
        height="360"
        className="-mb-px mt-12 block w-full select-none sm:mt-16"
        decoding="async"
        loading="lazy"
        fetchPriority="low"
        aria-hidden="true"
      />

      <footer className="bg-brand-900 py-14 text-white">
        <div className="container-site flex flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="" width="32" height="32" className="h-8 w-8" decoding="async" loading="lazy" fetchPriority="low" />
            <p className="text-sm text-ink-200">
              &copy; <time dateTime="2026">2026</time> Prairie Web Studio. All rights reserved.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-6 text-sm">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer-link-light">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}
