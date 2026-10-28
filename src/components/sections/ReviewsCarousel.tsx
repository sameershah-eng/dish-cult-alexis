import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { REVIEWS_DATA } from '../../data/reviews';

export const ReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
  };

  const review = REVIEWS_DATA[currentIndex];

  return (
    <section className="py-20 bg-ink relative border-t border-smoke/70 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs font-semibold text-brand tracking-widest uppercase">
          Real Diner Experiences
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight mt-1 mb-10">
          Voices from the dining room
        </h2>

        {/* Carousel Container */}
        <div className="relative p-8 sm:p-12 rounded-3xl bg-coal/80 border border-smoke/80 shadow-2xl backdrop-blur-md">
          <Quote className="w-10 h-10 text-brand/20 mx-auto mb-4" />

          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(review.rating)
                        ? 'fill-saffron text-saffron'
                        : 'text-smoke'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="font-serif text-lg sm:text-xl text-cream/95 italic leading-relaxed max-w-2xl mx-auto">
                "{review.text}"
              </p>

              {/* Diner Lockup */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-smoke/60">
                {review.authorPhoto && (
                  <img
                    src={review.authorPhoto}
                    alt={review.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-smoke"
                  />
                )}
                <div className="text-left">
                  <h4 className="text-xs sm:text-sm font-semibold text-cream">
                    {review.authorName}
                  </h4>
                  <p className="text-[11px] text-muted">
                    Reviewed <span className="text-ember font-medium">{review.restaurantName}</span> · {review.city}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="flex items-center justify-between mt-8 pt-4">
            <div className="flex gap-1.5">
              {REVIEWS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx ? 'w-6 bg-brand' : 'w-2 bg-smoke hover:bg-muted'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-smoke hover:bg-smoke/80 text-cream transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-smoke hover:bg-smoke/80 text-cream transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
