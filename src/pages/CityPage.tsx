import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { CITIES_BENTO } from '../data/cities';
import { RESTAURANTS_DATA } from '../data/restaurants';
import { SmartImage } from '../components/ui/SmartImage';

export const CityPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const city =
    CITIES_BENTO.find((c) => c.slug === slug || c.id === slug) ||
    CITIES_BENTO[0];

  const cityRestaurants = RESTAURANTS_DATA.filter(
    (r) => r.city.toLowerCase() === city.name.toLowerCase()
  );
  const displayList =
    cityRestaurants.length > 0 ? cityRestaurants : RESTAURANTS_DATA.slice(0, 6);

  return (
    <div className="min-h-screen bg-ink pt-24 pb-20">
      {/* City Hero Banner */}
      <div className="relative h-[420px] w-full overflow-hidden mb-12">
        <SmartImage
          src={city.image}
          slug={city.slug}
          alt={`${city.name} skyline`}
          aspectRatio="auto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />

        <div className="absolute bottom-10 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coal/80 border border-smoke/70 text-xs font-semibold text-saffron mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.country} Dining Guide</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-cream tracking-tight">
            {city.name}
          </h1>
          <p className="text-sm sm:text-base text-cream/90 max-w-xl mt-2 leading-relaxed">
            {city.tagline}. Discover {city.restaurantCount} hand-picked dining rooms with live table reservations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold text-cream">
            Featured venues in {city.name}
          </h2>
          <Link
            to={`/explore?city=${city.name}`}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            <span>View all in Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.slug}`}
              className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:border-smoke hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-coal">
                <img
                  src={restaurant.photos[0]?.url}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/80 text-[11px] text-cream font-medium">
                  <Clock className="w-3 h-3 text-ember" />
                  <span>Next: {restaurant.nextAvailableTime}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-cream group-hover:text-ember transition-colors">
                      {restaurant.name}
                    </h3>
                    <span className="text-xs font-bold text-cream/70 font-mono">{restaurant.priceBand}</span>
                  </div>
                  <p className="text-xs text-muted mt-1">{restaurant.cuisine} · {restaurant.neighbourhood}</p>
                  <p className="text-xs text-muted/80 mt-2 line-clamp-2 leading-relaxed">{restaurant.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-smoke/60 text-xs">
                  <div className="flex items-center gap-1 text-saffron font-medium">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-cream font-semibold">{restaurant.rating}</span>
                    <span className="text-muted">({restaurant.reviewCount})</span>
                  </div>
                  <span className="font-semibold text-brand group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Reserve</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
