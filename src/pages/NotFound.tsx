import { Link } from 'react-router';

export default function NotFound() {
  return (
    <>
      <div className="mb-8 text-brand-800" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140" fill="none" className="mx-auto">
          {/* ears */}
          <path d="M32 46 22 16l26 20" fill="currentColor" opacity="0.15" />
          <path d="M108 46 118 16l-26 20" fill="currentColor" opacity="0.15" />
          <path d="M32 46 22 16l26 20" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          <path d="M108 46 118 16l-26 20" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          {/* head */}
          <circle cx="70" cy="76" r="46" fill="white" stroke="currentColor" strokeWidth="3" />
          {/* inner ears */}
          <path d="M40 40 34 24l14 12" fill="currentColor" opacity="0.35" />
          <path d="M100 40 106 24l-14 12" fill="currentColor" opacity="0.35" />
          {/* eyes (closed, happy) */}
          <path d="M50 74q6-8 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M78 74q6-8 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* nose */}
          <path d="M66 88h8l-4 5z" fill="currentColor" />
          {/* mouth */}
          <path d="M70 93v4M70 97q-6 6-12 2M70 97q6 6 12 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* whiskers */}
          <path d="M24 82h18M24 92h17M98 82h18M99 92h17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          {/* blush */}
          <circle cx="46" cy="86" r="4" fill="currentColor" opacity="0.2" />
          <circle cx="94" cy="86" r="4" fill="currentColor" opacity="0.2" />
        </svg>
      </div>

      <h1 id="not-found-heading" className="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
        404 — Page Not Found
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-ink-600">
        This page wandered off somewhere. Even our cat couldn't track it down.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/" className="btn-primary w-full sm:w-auto">Return to Home</Link>
        <Link to="/contact" className="btn-secondary w-full sm:w-auto">Contact Us</Link>
      </div>
    </>
  );
}
