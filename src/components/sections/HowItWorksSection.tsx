import React from 'react';
import { motion } from 'motion/react';
import { Compass, CheckCircle2, UtensilsCrossed } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Compass,
    title: 'Discover authentic culinary craft',
    description:
      'Search live table openings across 20+ cities by cuisine, neighbourhood, or dietary preference. Our real-time engine connects directly into restaurant kitchen systems.',
  },
  {
    number: '02',
    icon: CheckCircle2,
    title: 'Reserve instantly without holding fees',
    description:
      'Lock in prime Friday night slots in seconds. Receive instant SMS and calendar confirmations powered by ResDiary table architecture with zero booking markups.',
  },
  {
    number: '03',
    icon: UtensilsCrossed,
    title: 'Dine, order courses & earn access',
    description:
      'Show up, indulge in chef specials, pre-order signature takeaway courses, and build your personalised dining wishlist for future bookings.',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 bg-ink relative border-t border-smoke/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">
            Frictionless Table Booking
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight mt-1.5">
            How Dish Cult works
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            No endless waiting on the phone. Direct restaurant connections that guarantee your seat.
          </p>
        </div>

        {/* 3 Step Cards with Oversized Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative p-8 rounded-2xl bg-coal border border-smoke/80 flex flex-col justify-between group hover:border-brand/50 transition-colors"
              >
                <div>
                  {/* Oversized Number in Fraunces */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cream/20 to-cream/5 select-none">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-smoke/60 border border-smoke flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream group-hover:text-ember transition-colors leading-snug mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-smoke/40 text-[11px] font-semibold text-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                  <span>ResDiary synchronised</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
