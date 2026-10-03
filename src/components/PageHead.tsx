import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { headTags } from '../seo';

// Replaces the per-page <head> tags after client-side navigation. The first
// render is skipped because the prerendered HTML already has the right tags.
export default function PageHead() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (document.head.querySelector('[data-head]')) return;
    }

    document.head.querySelectorAll('[data-head]').forEach((el) => el.remove());
    for (const { tag, attrs, children } of headTags(pathname)) {
      const el = document.createElement(tag);
      el.setAttribute('data-head', '');
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      if (children) el.textContent = children;
      document.head.appendChild(el);
    }
  }, [pathname]);

  return null;
}
