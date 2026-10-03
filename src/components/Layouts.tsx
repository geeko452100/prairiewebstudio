import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import Logo from './Logo';
import SkipLink from './SkipLink';

// Full chrome: sticky nav header and the field-band footer.
export function SiteLayout() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

// Stripped-down chrome for the thank-you and 404 pages.
export function MinimalLayout() {
  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-ink-100/80 bg-white">
          <div className="container-site flex h-16 items-center justify-center px-4 sm:px-6 lg:px-8">
            <Logo />
          </div>
        </header>

        <main id="main" className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg text-center">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-ink-100 bg-white py-6">
          <p className="text-center text-sm text-ink-500">
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Prairie Web Studio. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
