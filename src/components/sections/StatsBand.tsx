import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface StatItem {
  target: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    target: 4800,
    suffix: '+',
    label: 'Partner Restaurants',
    description: 'Bistros, taverns & Michelin keys',
  },
  {
    target: 24,
    suffix: '',
    label: 'Global Food Capitals',
    description: 'UK, Ireland, Europe & Australasia',
  },
  {
    target: 1.8,
    suffix: 'M',
    decimals: 1,
    label: 'Tables Reserved Yearly',
    description: 'Zero booking markups or fees',
  },
  {
    target: 4.8,
    suffix: ' / 5',
    decimals: 1,
    label: 'Diner Satisfaction',
    description: 'From 320,000+ verified visits',
  },
];

const CountUp: React.FC<{ stat: StatItem }> = ({ stat }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = ease * stat.target;
      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setValue(stat.target);
      }
    };

    requestAnimationFrame(update);
  }, [isInView, stat.target]);

  const formatted = stat.decimals
    ? value.toFixed(stat.decimals)
    : Math.floor(value).toLocaleString('en-GB');

  return (
    <span ref={ref} className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-cream tabular-nums">
      {stat.prefix}
      {formatted}
      {stat.suffix}
    </span>
  );
};

export const StatsBand: React.FC = () => {
  return (
    <section className="py-16 bg-coal border-y border-smoke/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col text-left"
            >
              <CountUp stat={stat} />
              <h4 className="text-xs sm:text-sm font-semibold text-cream mt-2 tracking-wide">
                {stat.label}
              </h4>
              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
