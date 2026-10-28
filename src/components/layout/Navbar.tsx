import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Utensils, Compass } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { NavLinks } from './NavLinks';
import { CartButton } from './CartButton';
import { MobileMenu } from './MobileMenu';
import { MobileBottomBar } from './MobileBottomBar';
import { SearchModal } from '../ui/SearchModal';
import { useScrollState } from '../../hooks/useScrollState';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useLoader } from '../loader/LoaderContext';

export const Navbar: React.FC = () => {
  const { done } = useLoader();
  const { isScrolled, progress, navTheme, showBottomBar } = useScrollState();
  const { favorites } = useFavoritesStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);

  // Detect platform for ⌘K vs Ctrl K
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll to top on logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLight = navTheme === 'light';

  // Magnetic button state for "Book a table"
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = Math.max(-6, Math.min(6, (e.clientX - centerX) * 0.2));
    const deltaY = Math.max(-6, Math.min(6, (e.clientY - centerY) * 0.2));
    setMagnetPos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMagnetPos({ x: 0, y: 0 });
  };

  return (
    <>
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[90] px-4 py-2 rounded-xl bg-brand text-white font-semibold shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Subtle Top Dark Gradient Shadow for Hero Legibility (State 1 only) */}
      <div
        className={`fixed top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#0B0B0D]/65 via-[#0B0B0D]/25 to-transparent pointer-events-none z-[45] transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Main Sticky Navbar (Always visible while scrolling, morphs smoothly) */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300"
        style={{
          paddingTop: isScrolled
            ? 'max(12px, env(safe-area-inset-top))'
            : 'env(safe-area-inset-top)',
        }}
      >
        <motion.div
          layout
          initial={{ y: -24, opacity: 0 }}
          animate={done ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
          transition={{
            layout: { type: 'spring', stiffness: 260, damping: 30 },
            y: { duration: 0.5, ease: 'easeOut' },
            opacity: { duration: 0.4 },
          }}
          className={`relative pointer-events-auto flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? isLight
                ? 'w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[1180px] h-[58px] sm:h-[64px] rounded-[20px] sm:rounded-full px-4 sm:px-6 shadow-xl shadow-black/10 glass-panel-light text-ink'
                : 'w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[1180px] h-[58px] sm:h-[64px] rounded-[20px] sm:rounded-full px-4 sm:px-6 shadow-[0_10px_40px_-10px_rgba(229,23,63,0.25),0_2px_10px_rgba(0,0,0,0.5)] glass-panel-dark text-cream'
              : 'w-full max-w-7xl h-[72px] sm:h-[88px] rounded-none px-4 sm:px-8 bg-transparent text-cream nav-text-shadow'
          }`}
        >
          {/* Animated Rotating Conic Gradient 1px Border (State 2 only) */}
          {isScrolled && (
            <div className="absolute inset-0 rounded-[20px] sm:rounded-full p-[1px] pointer-events-none overflow-hidden -z-10">
              <div
                className="absolute -inset-[100%] animate-spin-conic opacity-40"
                style={{
                  background:
                    'conic-gradient(from 0deg, #E5173F, #FF5A36, #F7B733, #FF5A36, #E5173F)',
                }}
              />
              <div
                className={`w-full h-full rounded-[19px] sm:rounded-full ${
                  isLight ? 'bg-[#F6F1EA]/85' : 'bg-[#141417]/85'
                }`}
              />
            </div>
          )}

          {/* LEFT: Circular Dish Cult Badge with pulsing glow & hover rotation */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full py-1"
            aria-label="Dish Cult - Home"
          >
            <motion.div
              animate={{ scale: isScrolled ? 0.85 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative flex items-center justify-center"
            >
              <Logo size={isScrolled ? 34 : 40} glow={true} className="transition-transform duration-300 group-hover:rotate-8" />
            </motion.div>
            <span
              className={`font-serif text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap transition-colors ${
                isLight ? 'text-ink' : 'text-cream'
              }`}
            >
              Dish Cult
            </span>
          </Link>

          {/* CENTRE: Navigation Links (Desktop ≥1024px) */}
          <div className="hidden lg:flex items-center justify-center">
            <NavLinks navTheme={navTheme} />
          </div>

          {/* CENTRE CONDENSED (Tablet 768px - 1023px) */}
          <div className="hidden md:flex lg:hidden items-center gap-4 text-xs font-semibold">
            <Link
              to="/explore"
              className={`py-1 transition-colors ${
                isLight ? 'text-ink/80 hover:text-ink' : 'text-cream/80 hover:text-cream'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/explore#cities"
              className={`py-1 transition-colors ${
                isLight ? 'text-ink/80 hover:text-ink' : 'text-cream/80 hover:text-cream'
              }`}
            >
              Cities
            </Link>
            <Link
              to="/experiences"
              className={`py-1 transition-colors ${
                isLight ? 'text-ink/80 hover:text-ink' : 'text-cream/80 hover:text-cream'
              }`}
            >
              Experiences
            </Link>
          </div>

          {/* RIGHT: Actions (Search ⌘K, Favorites, Cart, Sign in, Book CTA) */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Desktop Command Search Pill */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isLight
                  ? 'bg-coal/5 hover:bg-coal/10 border-coal/15 text-ink'
                  : 'bg-smoke/50 hover:bg-smoke border-smoke/70 text-cream/90 hover:border-smoke/90'
              }`}
              aria-label="Open command search"
            >
              <Search className="w-3.5 h-3.5 text-brand" />
              <span>Search</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-smoke/80 text-muted border border-smoke/50">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`sm:hidden p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isLight ? 'text-ink hover:bg-coal/10' : 'text-cream hover:bg-smoke/60'
              }`}
              aria-label="Search restaurants"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favourites Heart Button with Counter */}
            <Link
              to="/explore?filter=favorites"
              className={`relative hidden sm:flex items-center justify-center p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isLight
                  ? 'text-ink/80 hover:text-ink hover:bg-coal/10'
                  : 'text-cream/80 hover:text-cream hover:bg-smoke/60'
              }`}
              aria-label={`Saved favourites (${favorites.length})`}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-brand text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Animated Badge, Shake, Ripple & Hover Dropdown */}
            <CartButton navTheme={navTheme} />

            {/* Sign in text link with underline drawing in on hover (Desktop) */}
            <Link
              to="/about"
              className={`group relative hidden lg:inline-block text-xs font-semibold transition-colors py-1 ${
                isLight ? 'text-ink/80 hover:text-ink' : 'text-cream/80 hover:text-cream'
              }`}
            >
              <span>Sign in</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-brand group-hover:w-full transition-all duration-300 ease-out" />
            </Link>

            {/* "Book a table" Pill Button with Magnetic Hover & 6s Shine */}
            <motion.button
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ x: magnetPos.x, y: magnetPos.y }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => navigate('/explore')}
              className="relative overflow-hidden group hidden md:flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold text-white bg-brand-gradient shadow-md shadow-brand/25 hover:shadow-brand/50 hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Book a table</span>
              <span className="lg:hidden">Book</span>

              {/* Light 6-second shine sweep */}
              <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-button-shine" />
            </motion.button>

            {/* Mobile Hamburger Button with 2 lines morphing into X */}
            <button
              ref={hamburgerButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { rotate: 45, y: 4, backgroundColor: '#E5173F' }
                    : { rotate: 0, y: 0, backgroundColor: isLight ? '#0B0B0D' : '#F6F1EA' }
                }
                transition={{ duration: 0.25 }}
                className="w-5 h-0.5 rounded-full origin-center"
              />
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { rotate: -45, y: -4, backgroundColor: '#E5173F' }
                    : { rotate: 0, y: 0, backgroundColor: isLight ? '#0B0B0D' : '#F6F1EA' }
                }
                transition={{ duration: 0.25 }}
                className="w-5 h-0.5 rounded-full origin-center"
              />
            </button>
          </div>

          {/* 2px Scroll Progress Bar at very bottom edge (inside pill when floating) */}
          <div
            className={`absolute bottom-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none ${
              isScrolled ? 'rounded-b-[20px] sm:rounded-b-full' : ''
            }`}
          >
            <div
              className="h-full bg-brand-gradient transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      </header>

      {/* Full-Screen Mobile Menu with Circular Clip-Path */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={hamburgerButtonRef}
      />

      {/* Floating Mobile Bottom Action Bar on Scroll past Hero */}
      <MobileBottomBar
        isVisible={showBottomBar}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Full-Screen Command Search Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
