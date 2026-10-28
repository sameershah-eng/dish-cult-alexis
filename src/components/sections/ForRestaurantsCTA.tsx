import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, TrendingUp, ShieldCheck } from 'lucide-react';

export const ForRestaurantsCTA: React.FC = () => {
  return (
    <section className="py-20 bg-ink relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-coal via-smoke/90 to-coal border border-smoke/90 shadow-2xl">
          {/* Brand Gradient Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gradient opacity-15 blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs font-semibold text-brand">
              <Utensils className="w-3.5 h-3.5" />
              <span>For Hospitality Operators</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream tracking-tight leading-tight">
              Fill more covers with zero commission fees.
            </h2>

            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl">
              Connect your venue to hundreds of thousands of food lovers. Powered by ResDiary table management, Dish Cult brings diners directly to your door without slicing away your margins.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 pb-4">
              <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero commission on bookings</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                <TrendingUp className="w-4 h-4 text-ember shrink-0" />
                <span>Real-time cover yield boost</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                <Utensils className="w-4 h-4 text-saffron shrink-0" />
                <span>ResDiary native sync</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/for-restaurants"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-95 transition-all"
              >
                <span>Get your restaurant listed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-smoke/80 hover:bg-smoke border border-smoke text-xs sm:text-sm font-semibold text-cream transition-colors"
              >
                <span>Speak to our team</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
