import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Clock, Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { usePlaces } from '../../lib/places';
import { SmartImage } from '../ui/SmartImage';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useToastStore } from '../../store/useToastStore';

const CITIES = ['Glasgow', 'London', 'Dublin', 'Liverpool', 'Manchester', 'Edinburgh'];

export const TrendingRail: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Glasgow');
  const { places, loading } = usePlaces({ query: 'best restaurants', city: selectedCity, limit: 8 });
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleFavorite = (e: React.MouseEvent, restaurant: any) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowFav = toggleFavorite(restaurant.id);
    addToast({
      title: isNowFav ? 'Saved to dining wishlist' : 'Removed from wishlist',
      description: restaurant.name,
      type: 'info',
    });
  };

  return (
    <section className="py-20 bg-ink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with City Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand tracking-widest uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diners' Choice</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight">
              Trending this week
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-lg">
              The most in-demand dining rooms, bistro counters and supper clubs with live table openings.
            </p>
          </div>

          {/* City Switcher Buttons (Functional Segments) */}
          <div className="flex items-center gap-1.5 p-1 bg-coal rounded-xl border border-smoke overflow-x-auto no-scrollbar">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedCity === city
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-muted hover:text-cream hover:bg-smoke/50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Snap-scroll rail */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
            <AnimatePresence mode="popLayout">
              {places.map((restaurant, idx) => {
                const fav = isFavorite(restaurant.id);

                return (
                  <motion.div
                    key={restaurant.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start group"
                  >
                    <div className="relative rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-smoke hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
                      {/* Image Frame with zoom on hover */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-coal">
                        <SmartImage
                          photo={restaurant.photos?.[0]}
                          mockFallback={restaurant.photos?.[0]?.url}
                          slug={restaurant.slug}
                          alt={restaurant.name}
                          aspectRatio="4/3"
                          width={600}
                          className="group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Heart Button */}
                        <button
                          onClick={(e) => handleFavorite(e, restaurant)}
                          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-ink/70 backdrop-blur-md border border-smoke/50 flex items-center justify-center text-cream hover:scale-110 active:scale-95 transition-all"
                          aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              fav ? 'fill-brand text-brand' : 'text-cream'
                            }`}
                          />
                        </button>

                        {/* Availability Chip */}
                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/85 backdrop-blur-md border border-smoke/70 text-[11px] text-cream font-medium">
                          <Clock className="w-3 h-3 text-ember" />
                          <span>Next: {restaurant.nextAvailableTime || '19:30'}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-lg font-bold text-cream group-hover:text-ember transition-colors leading-snug">
                              {restaurant.name}
                            </h3>
                            <span className="text-xs font-semibold text-cream/70 tracking-tight shrink-0 font-mono">
                              {restaurant.priceBand}
                            </span>
                          </div>

                          {/* Clean unboxed metadata with separators */}
                          <div className="flex items-center gap-2 text-xs text-muted mt-1.5">
                            <span>{restaurant.cuisine}</span>
                            <span aria-hidden="true">·</span>
                            <span>{restaurant.neighbourhood}</span>
                          </div>

                          <p className="text-xs text-muted/80 mt-2.5 line-clamp-2 leading-relaxed">
                            {restaurant.description}
                          </p>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-smoke/60">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
                            <span className="font-semibold text-cream tabular-nums">{restaurant.rating}</span>
                            <span className="text-muted/80">({restaurant.reviewCount})</span>
                          </div>

                          <Link
                            to={`/restaurant/${restaurant.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-ember transition-colors group/link"
                          >
                            <span>Reserve</span>
                            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* View all in city link */}
        <div className="mt-6 text-center">
          <Link
            to={`/explore?city=${selectedCity}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-cream transition-colors"
          >
            <span>Explore all dining venues in {selectedCity}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand" />
          </Link>
        </div>
      </div>
    </section>
  );
};
