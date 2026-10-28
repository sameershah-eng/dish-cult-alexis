import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Star, Utensils, Coffee, Wine, Sparkles } from 'lucide-react';
import { CITIES_BENTO } from '../../data/cities';
import { RESTAURANTS_DATA } from '../../data/restaurants';

interface CitiesMegaMenuProps {
  onClose: () => void;
}

export const CitiesMegaMenu: React.FC<CitiesMegaMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const vin18 = RESTAURANTS_DATA.find((r) => r.slug === 'vin18-glasgow') || RESTAURANTS_DATA[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[840px] max-w-[92vw] p-6 rounded-3xl bg-coal/90 backdrop-blur-2xl border border-smoke/80 shadow-2xl shadow-black/60 z-50 overflow-hidden"
    >
      {/* Background ambient ember glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 grid grid-cols-12 gap-6">
        {/* Left 7 Columns: City Grid */}
        <div className="col-span-7 flex flex-col justify-between border-r border-smoke/70 pr-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
                Explore Culinary Capitals
              </span>
              <Link
                to="/explore"
                onClick={onClose}
                className="text-xs font-semibold text-brand hover:text-ember flex items-center gap-1 transition-colors"
              >
                <span>View all cities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {CITIES_BENTO.slice(0, 9).map((city) => (
                <Link
                  key={city.id}
                  to={`/cities/${city.slug}`}
                  onClick={onClose}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-smoke/60 hover:border-brand/60 transition-all flex flex-col justify-end p-2.5"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="relative z-10">
                    <span className="block font-serif text-xs font-bold text-cream group-hover:text-ember transition-colors leading-tight">
                      {city.name}
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5">
                      {city.restaurantCount} tables
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-smoke/60 flex items-center justify-between text-[11px] text-muted">
            <span>Operating in UK, Ireland, Australia, NZ & Asia</span>
            <span className="text-saffron font-medium">Powered by ResDiary</span>
          </div>
        </div>

        {/* Right 5 Columns: Featured Venue (vin18 Glasgow) */}
        <div className="col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-muted uppercase tracking-widest">
                Featured of the Week
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand/20 border border-brand/40 text-[10px] font-semibold text-brand">
                Editor's Pick
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-smoke/40 border border-smoke group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={vin18.photos[0]?.url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'}
                  alt={vin18.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-ink/80 backdrop-blur-md text-[10px] font-semibold text-cream">
                  {vin18.neighbourhood}, {vin18.city}
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink/80 backdrop-blur-md text-[10px] font-bold text-saffron">
                  <Star className="w-3 h-3 fill-saffron text-saffron" />
                  <span>{vin18.rating}</span>
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-bold text-cream group-hover:text-ember transition-colors">
                    {vin18.name}
                  </h4>
                  <span className="text-xs text-muted font-medium">{vin18.priceBand}</span>
                </div>
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {vin18.tagline || 'Intimate neighbourhood European bistro showcasing seasonal Scottish fare.'}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/restaurant/${vin18.slug}`);
                    }}
                    className="w-full py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand/30 transition-all active:scale-95 text-center"
                  >
                    Book now at {vin18.name}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
            <MapPin className="w-3 h-3 text-brand shrink-0" />
            <span className="truncate">{vin18.address}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ExperiencesDropdownProps {
  onClose: () => void;
}

export const ExperiencesDropdown: React.FC<ExperiencesDropdownProps> = ({ onClose }) => {
  const experiences = [
    {
      title: "Chef's Table",
      desc: 'Exclusive multi-course kitchen counter dining',
      price: 'from £75',
      icon: Utensils,
      color: 'text-brand',
      href: '/experiences',
    },
    {
      title: 'Afternoon Tea',
      desc: 'Artisanal patisserie & single-estate infusions',
      price: 'from £35',
      icon: Coffee,
      color: 'text-saffron',
      href: '/experiences',
    },
    {
      title: 'Wine Pairing Dinner',
      desc: 'Sommelier-guided rare vintages & pairings',
      price: 'from £95',
      icon: Wine,
      color: 'text-ember',
      href: '/experiences',
    },
    {
      title: 'Bottomless Brunch',
      desc: 'Weekend free-flowing spritzes & brunch classics',
      price: 'from £42',
      icon: Sparkles,
      color: 'text-brand',
      href: '/experiences',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-84 p-3 rounded-2xl bg-coal/90 backdrop-blur-2xl border border-smoke/80 shadow-2xl shadow-black/60 z-50"
    >
      <div className="space-y-1">
        {experiences.map((exp) => {
          const Icon = exp.icon;
          return (
            <Link
              key={exp.title}
              to={exp.href}
              onClick={onClose}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-smoke/60 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-smoke shrink-0 group-hover:bg-brand/20 transition-colors">
                <Icon className={`w-4 h-4 ${exp.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cream group-hover:text-ember transition-colors">
                    {exp.title}
                  </span>
                  <span className="text-[10px] font-bold text-saffron">{exp.price}</span>
                </div>
                <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{exp.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-smoke/60 px-2 flex items-center justify-between">
        <Link
          to="/experiences"
          onClick={onClose}
          className="text-[11px] font-semibold text-brand hover:text-ember flex items-center gap-1 transition-colors"
        >
          <span>All special dining</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
        <Link
          to="/experiences#gift-cards"
          onClick={onClose}
          className="text-[11px] text-muted hover:text-cream transition-colors"
        >
          Gift vouchers →
        </Link>
      </div>
    </motion.div>
  );
};
