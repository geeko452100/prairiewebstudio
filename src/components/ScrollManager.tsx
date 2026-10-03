import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

// Client-side navigation doesn't reset scroll or follow #hash links on its
// own, so do what a normal page load would: jump to the hash target if there
// is one, otherwise go to the top. The initial load is left to the browser.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
