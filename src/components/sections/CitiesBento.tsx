import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { CITIES_BENTO, MORE_CITIES } from '../../data/cities';
import { SmartImage } from '../ui/SmartImage';

export const CitiesBento: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="cities" className="py-20 bg-coal/40 border-t border-smoke/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">
            Culinary Epicentres
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight mt-1.5">
            Book the best tables by city
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Curated dining guides, local favourites and Michelin-starred havens across the UK, Ireland, Europe and Australasia.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CITIES_BENTO.map((city, idx) => {
            // First 2 cities take 2 columns on large screens for editorial asymmetric rhythm
            const isFeatured = idx === 0 || idx === 1;

            return (
              <motion.div
                key={city.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`${isFeatured ? 'lg:col-span-2' : 'lg:col-span-1'} group`}
              >
                <div
                  onClick={() => navigate(`/explore?city=${city.slug}`)}
                  className="relative rounded-2xl overflow-hidden bg-coal border border-smoke/80 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] cursor-pointer shadow-lg hover:shadow-2xl hover:border-brand/50 transition-all duration-500"
                >
                  {/* City Image */}
                  <SmartImage
                    src={city.image}
                    slug={city.slug}
                    alt={`${city.name} restaurant guide`}
                    className="group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Scrim & Glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent group-hover:via-ink/30 transition-all" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-brand-gradient/10 pointer-events-none" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-saffron font-medium mb-1">
                          <MapPin className="w-3 h-3" />
                          <span>{city.country}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream group-hover:text-ember transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-xs text-muted/90 mt-1 line-clamp-1 max-w-xs">
                          {city.tagline}
                        </p>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="block text-xs font-semibold text-cream tabular-nums">
                          {city.restaurantCount} tables
                        </span>
                        <span className="text-[10px] text-brand font-medium group-hover:underline flex items-center gap-0.5 justify-end mt-0.5">
                          <span>Explore</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* More Cities Chips Row */}
        <div className="mt-12 pt-8 border-t border-smoke/60">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 text-center">
            More destinations & dining neighbourhoods
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {MORE_CITIES.map((name) => (
              <button
                key={name}
                onClick={() => navigate(`/explore?city=${encodeURIComponent(name)}`)}
                className="px-3.5 py-1.5 rounded-full bg-coal hover:bg-smoke border border-smoke/70 text-xs text-cream/90 hover:text-cream hover:border-brand transition-colors cursor-pointer"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
