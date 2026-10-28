import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

interface LoaderProps {
  onComplete: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      sessionStorage.setItem('dishcult_visited', 'true');
      onComplete();
      return;
    }

    const duration = 1800; // ms
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setIsFinished(true);
          setTimeout(() => {
            sessionStorage.setItem('dishcult_visited', 'true');
            onComplete();
          }, 400);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Stroke-dash calculations for ring of radius 58
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="site-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink text-cream overflow-hidden"
        >
          {/* Subtle radial glow */}
          <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-brand/20 via-ember/15 to-transparent blur-3xl pointer-events-none" />

          {/* Central Logo & Drawing SVG Gradient Ring */}
          <div className="relative flex items-center justify-center">
            {/* SVG animated stroke ring */}
            <svg
              className="absolute -inset-6 w-[156px] h-[156px] -rotate-90 pointer-events-none"
              viewBox="0 0 130 130"
            >
              <defs>
                <linearGradient id="loader-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E5173F" />
                  <stop offset="55%" stopColor="#FF5A36" />
                  <stop offset="100%" stopColor="#F7B733" />
                </linearGradient>
              </defs>
              {/* Background faint track */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="#1E1E23"
                strokeWidth="2.5"
              />
              {/* Animated drawing stroke */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="url(#loader-ring-gradient)"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-75 ease-out"
              />
            </svg>

            {/* Badge scaling in with spring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative z-10"
            >
              <Logo size={84} glow={true} />
            </motion.div>
          </div>

          {/* Percentage & Tagline */}
          <div className="mt-8 flex flex-col items-center text-center">
            <span className="font-sans text-xs tracking-widest text-muted tabular-nums mb-1">
              {Math.round(progress)}%
            </span>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-serif italic text-sm text-cream/90 tracking-wide"
            >
              Booking the best tables…
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
