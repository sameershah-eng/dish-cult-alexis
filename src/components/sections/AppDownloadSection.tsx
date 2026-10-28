import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Bell, CalendarCheck, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const AppDownloadSection: React.FC = () => {
  return (
    <section className="py-20 bg-ink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-coal border border-smoke/80 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle radial glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand/15 via-ember/10 to-transparent blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Copy & App Store CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-smoke/80 border border-smoke text-xs text-saffron font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dish Cult Mobile App</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-[1.1]">
                Dining favourites on-demand. In your pocket.
              </h2>

              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg">
                Download the Dish Cult app for instant table notifications, exclusive chef drops, and one-tap bookings at over 4,800 venues.
              </p>

              {/* 3 Key Feature Points */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-cream">Instant Table Drop Alerts</h4>
                    <p className="text-[11px] text-muted">Get alerted the moment cancelled tables free up at fully booked hotspots.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-cream">One-Tap Calendar Sync</h4>
                    <p className="text-[11px] text-muted">Direct integration into Apple Calendar and Google Calendar with venue directions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-cream">Digital Dining Passports</h4>
                    <p className="text-[11px] text-muted">Store your gift cards, tasting tickets and dietary preferences in your Apple Wallet.</p>
                  </div>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-smoke hover:bg-smoke/80 border border-smoke/90 text-cream transition-all hover:border-brand/50 group"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.51 2.65-1.24z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] text-muted uppercase tracking-wider">Download on the</span>
                    <span className="text-xs font-bold text-cream">App Store</span>
                  </div>
                </a>

                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-smoke hover:bg-smoke/80 border border-smoke/90 text-cream transition-all hover:border-brand/50 group"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a2.14 2.14 0 0 1-.61-.954V2.768c.15-.37.38-.7.61-.954zm11.233 11.234l2.585 2.586L4.83 22.82c-.28.16-.58.24-.87.24l10.882-10.012zm2.585-2.096l3.87 2.235c1.03.59 1.03 1.57 0 2.16l-3.87 2.235-2.87-2.87 2.87-3.76zm-2.585-.49L3.96.94c.29 0 .59.08.87.24l12.597 7.276-2.585 2.002z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[10px] text-muted uppercase tracking-wider">Get it on</span>
                    <span className="text-xs font-bold text-cream">Google Play</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: Hand-Crafted CSS Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="w-[280px] sm:w-[310px] rounded-[44px] bg-coal border-[6px] border-smoke/90 shadow-2xl p-4 relative overflow-hidden"
              >
                {/* Phone Speaker Notch */}
                <div className="w-24 h-4 bg-smoke rounded-full mx-auto mb-4" />

                {/* Inner Screen UI: Booking Confirmation */}
                <div className="rounded-[28px] bg-ink border border-smoke/60 p-4 space-y-4">
                  {/* Mini Header */}
                  <div className="flex items-center justify-between">
                    <Logo size={24} glow={false} />
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Confirmed
                    </span>
                  </div>

                  {/* Confirmation Card */}
                  <div className="p-3.5 rounded-xl bg-coal border border-smoke/80 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-smoke overflow-hidden shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80"
                          alt="vin18"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-cream truncate">vin18</h4>
                        <p className="text-[10px] text-muted truncate">Rutherglen, Glasgow</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-smoke/60">
                      <div>
                        <span className="text-muted block">Guests</span>
                        <span className="font-semibold text-cream">2 Diners</span>
                      </div>
                      <div>
                        <span className="text-muted block">Time</span>
                        <span className="font-semibold text-cream">Tonight, 19:30</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-smoke/40 text-[9px] text-muted flex items-center justify-between">
                      <span>Booking ref: #DC-84920</span>
                      <span className="text-brand font-semibold">ResDiary ID</span>
                    </div>
                  </div>

                  {/* Quick Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 rounded-lg bg-smoke text-[10px] font-semibold text-cream text-center">
                      Directions
                    </button>
                    <button className="py-2 rounded-lg bg-brand text-[10px] font-semibold text-white text-center">
                      Modify
                    </button>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-28 h-1 bg-smoke rounded-full mx-auto mt-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
