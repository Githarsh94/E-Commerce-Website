import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop adjusts the window scroll position on route change
 * so SPA navigations do not leave content hidden under a fixed header.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '';
      const headerHeight = parseInt(raw.replace('px','').trim(), 10) || 0;
      // Slight extra offset so content doesn't touch the header
      const offset = Math.max(0, headerHeight + 8);
      // If Lenis is active, use its scrollTo. Otherwise fallback to window.scrollTo.
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.scrollTo === 'function') {
        try {
          // ask Lenis to jump immediately to the offset
          lenis.scrollTo(offset, { immediate: true });
        } catch (e) {
          // if options aren't supported, try calling with just the value
          try { lenis.scrollTo(offset); } catch (_) { window.scrollTo({ top: offset, left: 0, behavior: 'auto' }); }
        }
      } else {
        // Use instant scroll to avoid interfering with user's scroll position on back/forward
        window.scrollTo({ top: offset, left: 0, behavior: 'auto' });
      }
    } catch (err) {
      // fallback: scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return null;
}
