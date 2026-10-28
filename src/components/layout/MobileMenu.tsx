import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Instagram, Facebook, Twitter, MapPin } from 'lucide-react';
import { CITIES_BENTO } from '../../data/cities';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, triggerRef }) => {
  const navigate = useNavigate();

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      triggerRef?.current?.focus();
    }
  }, [isOpen, onClose, triggerRef]);

  const navLinks = [
    { label: 'Explore', href: '/explore', num: '01' },
    { label: 'Cities', href: '/explore#cities', num: '02' },
    { label: 'Experiences', href: '/experiences', num: '03' },
    { label: 'Gift Cards', href: '/experiences#gift-cards', num: '04' },
    { label: 'For Restaurants', href: '/for-restaurants', num: '05' },
    { label: 'About Dish Cult', href: '/about', num: '06' },
  ];

  const handleLinkClick = (href: string) => {
    onClose();
    setTimeout(() => {
      navigate(href);
    }, 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 36px) 36px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-50 bg-ink text-cream flex flex-col justify-between overflow-y-auto bg-noise"
          style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
        >
          {/* Ambient ember background glow */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-ember/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Header Row with Close Button */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4">
            <span className="font-serif text-lg font-bold text-cream">Dish Cult</span>
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-smoke/80 flex items-center justify-center text-cream hover:bg-smoke focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="relative z-10 px-6 py-4 space-y-4">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">
              Menu Navigation
            </p>
            <div className="space-y-3">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * idx + 0.1, duration: 0.35, ease: 'easeOut' }}
                >
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="group w-full flex items-baseline justify-between text-left py-1 hover:text-ember transition-colors"
                  >
                    <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-cream group-hover:text-ember group-active:text-gradient transition-colors">
                      {link.label}
                    </span>
                    <span className="font-mono text-xs text-muted/60 group-hover:text-brand font-medium">
                      {link.num}
                    </span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Popular Cities Horizontal Swipeable Row */}
          <div className="relative z-10 px-6 py-4 border-t border-smoke/70">
            <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand" />
              <span>Popular Cities</span>
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
              {CITIES_BENTO.slice(0, 7).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleLinkClick(`/cities/${c.slug}`)}
                  className="px-3.5 py-2 rounded-xl bg-coal border border-smoke/80 text-xs font-medium text-cream whitespace-nowrap active:scale-95 transition-all"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Account & Primary Booking CTA */}
          <div className="relative z-10 px-6 py-4 space-y-3 border-t border-smoke/70">
            <button
              onClick={() => handleLinkClick('/explore')}
              className="w-full py-3.5 rounded-full bg-brand-gradient text-white text-sm font-bold shadow-lg shadow-brand/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Book a table now</span>
            </button>

            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span>Have an account?</span>
              <button
                onClick={() => handleLinkClick('/about')}
                className="font-semibold text-cream hover:text-ember underline underline-offset-4"
              >
                Sign in or Register
              </button>
            </div>
          </div>

          {/* Bottom Store Badges & Socials */}
          <div
            className="relative z-10 px-6 pb-6 pt-2 border-t border-smoke/50 space-y-4"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coal border border-smoke/70 text-xs font-semibold text-cream"
              >
                <span>App Store</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coal border border-smoke/70 text-xs font-semibold text-cream"
              >
                <span>Google Play</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
              </a>
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <span>Powered by ResDiary</span>
              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
