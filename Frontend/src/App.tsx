import React, { useEffect, useState } from 'react'
import { useLenis } from './hooks/useLenis';
import AppRoutes from './Routing/Routes';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import Loader from './Components/Loader/Loader';
import Nav from './Components/Nav/Nav';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import Footer from './Components/Footer/Footer';
import AdminNavbar from './Components/AdminNavbar/AdminNavbar';
import { useAuth } from './context/AuthContext';
import { useLocation } from 'react-router-dom';

const App = () => {
  useLenis();

  // Placeholder handlers for Nav props
  const handleComponentChange = () => {};
  const onSearch = () => {};

  const { isAuthenticated, role } = useAuth();

  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState<number>(0);

  // Only consider the root path a 'loader route' while the initial loading animation is active.
  // After loading completes we want Nav and Footer to render even when at '/'.
  const isLoaderRoute = location.pathname === '/' && loading;

  // Load downloaded fonts from public/fonts at runtime using FontFace API
  useEffect(() => {
    try {
      const telma = new FontFace('Telma-Regular', "url('/fonts/Telma_Complete/Fonts/OTF/Telma-Light.otf') format('opentype')");
      const cabinet = new FontFace('Cabinet-Medium', "url('/fonts/CabinetGrotesk_Complete/Fonts/OTF/CabinetGrotesk-Medium.otf') format('opentype')");

      telma.load().then((loaded) => {
        document.fonts.add(loaded);
      }).catch(() => {});

      cabinet.load().then((loaded) => {
        document.fonts.add(loaded);
      }).catch(() => {});
    } catch (err) {
      // FontFace API not supported or load failed — fallback to CSS font-face if desired
    }
  }, []);

  // Animate an initial loader on every full page load / refresh and hide when complete.
  useEffect(() => {
    let id: any = null;
    setPercent(0);
    id = setInterval(() => {
      setPercent((p) => {
        const step = Math.floor(Math.random() * 12) + 6; // random-ish progress
        const np = Math.min(100, p + step);
        return np;
      });
    }, 120);

    return () => clearInterval(id);
  }, []);

  // When percent reaches 100 hide loader
  useEffect(() => {
    if (percent >= 100) {
      const t = setTimeout(() => setLoading(false), 220);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [percent]);

  // Measure the header (nav/admin) height and expose it as a CSS variable
  useEffect(() => {
    const setHeaderHeight = () => {
      try {
        const el = document.querySelector('.navbar, .admin-navbar') as HTMLElement | null;
        const h = el ? Math.ceil(el.getBoundingClientRect().height) : 0;
        document.documentElement.style.setProperty('--header-height', `${h}px`);
      } catch (err) {
        // ignore
      }
    };

    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    return () => window.removeEventListener('resize', setHeaderHeight);
  }, [isAuthenticated, role]);

  // Safe render: ToastContainer can sometimes be undefined if the package failed to load

  if (loading) return <Loader percent={percent} />;

  return (
    <>
      <ErrorBoundary>
  {!isLoaderRoute && (
          isAuthenticated && role === 'admin' ? (
            <>
              <AdminNavbar />
              {/* spacer to offset the fixed admin navbar height */}
              <div style={{ height: '5rem' }} aria-hidden />
            </>
          ) : (
            <Nav handleComponentChange={handleComponentChange} onSearch={onSearch} />
          )
        )}
        {/* <SearchResults searchTerm="" /> */}
        <main className="app-content">
          <AppRoutes />
        </main>
  {/* react-toastify removed — no toast container rendered */}
        {!isLoaderRoute && <Footer />}
        <ScrollToTop />
      </ErrorBoundary>
    </>
  );
}

export default App
