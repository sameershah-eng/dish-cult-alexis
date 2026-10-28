import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Facebook, Twitter, Linkedin, Check, ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useToastStore } from '../../store/useToastStore';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { addToast } = useToastStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast({
        title: 'Please enter a valid email address',
        type: 'error',
      });
      return;
    }

    setIsSubscribed(true);
    addToast({
      title: 'Subscribed to Dish Cult Gazette',
      description: 'You will receive weekly dining guides and table drops in your city.',
      type: 'success',
    });
    setEmail('');
  };

  return (
    <footer className="relative bg-ink border-t border-smoke/70 text-cream pt-16 pb-12 overflow-hidden">
      {/* Subtle ember glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-brand/10 via-ember/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Brand Band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-smoke/60">
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <Logo size={42} glow={true} />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-cream">Dish Cult</span>
                <p className="text-[10px] text-muted tracking-wider uppercase">An Access Company</p>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-sm">
              The premier restaurant discovery and instant table-booking platform across the UK, Ireland, Australia, New Zealand and beyond. Powered by ResDiary technology.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-coal border border-smoke flex items-center justify-center text-muted hover:text-cream hover:border-brand transition-colors"
                aria-label="Dish Cult Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-coal border border-smoke flex items-center justify-center text-muted hover:text-cream hover:border-brand transition-colors"
                aria-label="Dish Cult Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-coal border border-smoke flex items-center justify-center text-muted hover:text-cream hover:border-brand transition-colors"
                aria-label="Dish Cult Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-coal border border-smoke flex items-center justify-center text-muted hover:text-cream hover:border-brand transition-colors"
                aria-label="Dish Cult LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="p-6 sm:p-8 rounded-2xl bg-coal border border-smoke/80 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[11px] font-semibold text-brand uppercase tracking-widest">
                  The Weekly Food File
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream mt-1">
                  Get the table everyone will be talking about.
                </h3>
                <p className="text-xs text-muted mt-1.5 mb-5 max-w-md">
                  Secret supper club announcements, newly awarded Michelin stars, chef interviews, and Friday night availability drops.
                </p>

                {isSubscribed ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-4 h-4" />
                    <span>You're on the insider dining list. Watch your inbox this Thursday!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-lg">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address…"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-smoke/80 border border-smoke text-xs text-cream placeholder-muted outline-none focus:border-brand transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-brand-gradient text-xs font-semibold text-white shadow-md hover:shadow-brand/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Join the Club</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-xs">
          <div>
            <h4 className="font-serif text-sm font-semibold text-cream mb-4">Discover</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <Link to="/explore" className="hover:text-cream transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=rating" className="hover:text-cream transition-colors">
                  Top Rated Venues
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-cream transition-colors">
                  Culinary Experiences
                </Link>
              </li>
              <li>
                <Link to="/experiences#gift-cards" className="hover:text-cream transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link to="/restaurant/vin18" className="hover:text-cream transition-colors">
                  Spotlight: vin18 Glasgow
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-cream mb-4">Top Cities</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <Link to="/explore?city=Glasgow" className="hover:text-cream transition-colors">
                  Glasgow Dining
                </Link>
              </li>
              <li>
                <Link to="/explore?city=London" className="hover:text-cream transition-colors">
                  London Tables
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Dublin" className="hover:text-cream transition-colors">
                  Dublin Restaurants
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Liverpool" className="hover:text-cream transition-colors">
                  Liverpool Bistros
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Manchester" className="hover:text-cream transition-colors">
                  Manchester Eateries
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-cream mb-4">For Operators</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <Link to="/for-restaurants" className="hover:text-cream transition-colors">
                  Get Listed on Dish Cult
                </Link>
              </li>
              <li>
                <a
                  href="https://resdiary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition-colors flex items-center gap-1"
                >
                  <span>ResDiary Booking Engine</span>
                </a>
              </li>
              <li>
                <Link to="/for-restaurants#table-management" className="hover:text-cream transition-colors">
                  Table Management System
                </Link>
              </li>
              <li>
                <Link to="/for-restaurants#pricing" className="hover:text-cream transition-colors">
                  Zero Commission Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-cream mb-4">Dish Cult</h4>
            <ul className="space-y-2.5 text-muted">
              <li>
                <Link to="/about" className="hover:text-cream transition-colors">
                  About Our Platform
                </Link>
              </li>
              <li>
                <Link to="/about#careers" className="hover:text-cream transition-colors">
                  Careers at Access Group
                </Link>
              </li>
              <li>
                <Link to="/about#privacy" className="hover:text-cream transition-colors">
                  Privacy Policy & Cookies
                </Link>
              </li>
              <li>
                <Link to="/about#terms" className="hover:text-cream transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Trust & Legal Row */}
        <div className="pt-8 border-t border-smoke/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-muted">
          <div className="flex items-center gap-3">
            {/* Official ResDiary badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coal border border-smoke text-cream font-medium">
              <span className="text-[10px] text-muted">Powered by</span>
              <span className="font-bold text-xs text-white">ResDiary</span>
            </div>
            <span>© {new Date().getFullYear()} Dish Cult. An Access Company. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted/60">British English edition</span>
            <span>·</span>
            <div className="flex items-center gap-1 text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>ResDiary Instant Table Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
