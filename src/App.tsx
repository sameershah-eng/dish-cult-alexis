import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ToastContainer } from './components/ui/ToastContainer';
import { CustomCursor } from './components/ui/CustomCursor';
import { LoaderProvider } from './components/loader/LoaderContext';
import Loader from './components/loader/Loader';

// Lazy-loaded pages for optimal performance & code splitting
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const ExplorePage = lazy(() =>
  import('./pages/ExplorePage').then((m) => ({ default: m.ExplorePage }))
);
const RestaurantDetailPage = lazy(() =>
  import('./pages/RestaurantDetailPage').then((m) => ({ default: m.RestaurantDetailPage }))
);
const CityPage = lazy(() =>
  import('./pages/CityPage').then((m) => ({ default: m.CityPage }))
);
const ExperiencesPage = lazy(() =>
  import('./pages/ExperiencesPage').then((m) => ({ default: m.ExperiencesPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const ForRestaurantsPage = lazy(() =>
  import('./pages/ForRestaurantsPage').then((m) => ({ default: m.ForRestaurantsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

// Route Loading Skeleton
function RouteFallback() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full border-2 border-brand/30 border-t-brand animate-spin mb-4" />
      <span className="font-serif italic text-sm text-cream/70 tracking-wide">
        Preparing your table…
      </span>
    </div>
  );
}

export default function App() {
  const [mapsQuotaReached, setMapsQuotaReached] = useState(false);

  useEffect(() => {
    const handleQuota = () => setMapsQuotaReached(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  return (
    <BrowserRouter>
      <LoaderProvider>
        {/* Modern Concentric SVG Ring & Mark Loader */}
        <Loader
          preload={[
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
          ]}
        />

        <ScrollToTop />
        <CustomCursor />

        {/* Google Maps Platform Quota Defense Banner (Case A) */}
        {mapsQuotaReached && (
        <div className="bg-amber-500/90 text-black px-4 py-2 text-xs md:text-sm text-center sticky top-0 z-[60] shadow-sm font-medium">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-black hover:text-amber-950"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account. (Falling back to cached data)
          </span>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex flex-col min-h-screen bg-ink text-cream selection:bg-brand/30 selection:text-cream">
        <Navbar />

        <main id="main-content" className="flex-1 focus:outline-none">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
              <Route path="/city/:slug" element={<CityPage />} />
              <Route path="/cities/:slug" element={<CityPage />} />
              <Route path="/experiences" element={<ExperiencesPage />} />
              <Route path="/gift-cards" element={<ExperiencesPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/for-restaurants" element={<ForRestaurantsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <CartDrawer />
        <ToastContainer />

        {/* Development Mode Data Notice Chip */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="fixed bottom-3 left-3 z-30 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-coal/80 border border-smoke/70 text-[10px] text-muted font-mono backdrop-blur-md">
              ResDiary API & Demo Data
            </span>
          </div>
        )}
      </div>
      </LoaderProvider>
    </BrowserRouter>
  );
}
