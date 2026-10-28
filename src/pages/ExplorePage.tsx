import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Grid,
  List,
  Map as MapIcon,
  Star,
  Clock,
  Heart,
  ArrowRight,
  SlidersHorizontal,
  X,
  RotateCcw,
} from 'lucide-react';
import { RESTAURANTS_DATA } from '../data/restaurants';
import { CITIES_BENTO } from '../data/cities';
import { usePlaces } from '../lib/places';
import { SmartImage } from '../components/ui/SmartImage';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useToastStore } from '../store/useToastStore';
import { Restaurant } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state params
  const initialCity = searchParams.get('city') || 'All';
  const initialCuisine = searchParams.get('cuisine') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [selectedPrice, setSelectedPrice] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [availableTonight, setAvailableTonight] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'price-asc' | 'price-desc'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedMapVenue, setSelectedMapVenue] = useState<Restaurant | null>(null);

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  // Sync state if URL changes
  useEffect(() => {
    if (searchParams.get('city')) setSelectedCity(searchParams.get('city')!);
    if (searchParams.get('cuisine')) setSelectedCuisine(searchParams.get('cuisine')!);
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search')!);
  }, [searchParams]);

  // Fetch real Google Places results if available
  const { places: placesData, loading } = usePlaces({
    query: searchQuery || (selectedCuisine !== 'All' ? `${selectedCuisine} restaurants` : 'best restaurants'),
    city: selectedCity !== 'All' ? selectedCity : 'Glasgow',
    limit: 20,
  });

  // Unique cuisines from dataset
  const availableCuisines = useMemo(() => {
    const set = new Set<string>();
    RESTAURANTS_DATA.forEach((r) => set.add(r.cuisine.split('&')[0].trim()));
    return ['All', ...Array.from(set)];
  }, []);

  // Filter & Sort logic
  const filteredRestaurants = useMemo(() => {
    // Combine Places data and local catalog to guarantee rich coverage
    const baseList = placesData.length > 0 ? placesData : RESTAURANTS_DATA;

    return baseList
      .filter((r) => {
        // City filter
        if (selectedCity !== 'All' && r.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        // Cuisine filter
        if (
          selectedCuisine !== 'All' &&
          !r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
        ) {
          return false;
        }
        // Price filter
        if (selectedPrice !== 'All' && r.priceBand !== selectedPrice) {
          return false;
        }
        // Rating filter
        if (minRating > 0 && r.rating < minRating) {
          return false;
        }
        // Available tonight
        if (availableTonight && !r.nextAvailableTime) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisine = r.cuisine.toLowerCase().includes(q);
          const matchNeighbourhood = r.neighbourhood.toLowerCase().includes(q);
          const matchCity = r.city.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchNeighbourhood && !matchCity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'price-asc') return a.priceLevelNumeric - b.priceLevelNumeric;
        if (sortBy === 'price-desc') return b.priceLevelNumeric - a.priceLevelNumeric;
        return 0;
      });
  }, [
    placesData,
    selectedCity,
    selectedCuisine,
    selectedPrice,
    minRating,
    availableTonight,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCity('All');
    setSelectedCuisine('All');
    setSelectedPrice('All');
    setMinRating(0);
    setAvailableTonight(false);
    setSearchQuery('');
    setSearchParams({});
  };

  const handleFavorite = (e: React.MouseEvent, restaurant: Restaurant) => {
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
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">
            Discovery & Live Bookings
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-cream tracking-tight mt-1">
            {selectedCity !== 'All' ? `Restaurants in ${selectedCity}` : 'Explore exceptional dining'}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Real-time table availability verified across {filteredRestaurants.length} destination dining rooms.
          </p>
        </div>

        {/* Search & Control Toolbar */}
        <div className="p-3 rounded-2xl bg-coal border border-smoke flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search bar inside toolbar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant or dish…"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-smoke/60 border border-smoke/70 text-xs text-cream placeholder-muted outline-none focus:border-brand transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-cream"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-smoke hover:bg-smoke/80 text-xs font-semibold text-cream border border-smoke/80"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-smoke text-xs font-semibold text-cream outline-none cursor-pointer border border-smoke/80"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-smoke/80 rounded-xl border border-smoke/90">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-coal text-brand shadow-sm' : 'text-muted hover:text-cream'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-coal text-brand shadow-sm' : 'text-muted hover:text-cream'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'map' ? 'bg-coal text-brand shadow-sm' : 'text-muted hover:text-cream'
                }`}
                aria-label="Map view"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sticky Filters Left + Results Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Sticky Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6 p-6 rounded-2xl bg-coal border border-smoke/80">
            <div className="flex items-center justify-between pb-4 border-b border-smoke">
              <h3 className="font-serif text-base font-bold text-cream flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand" />
                <span>Filter Tables</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-muted hover:text-brand flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* City Filter */}
            <div>
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2.5">
                City / Region
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-smoke border border-smoke/80 text-xs font-semibold text-cream outline-none cursor-pointer"
              >
                <option value="All">All Destinations</option>
                {CITIES_BENTO.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.restaurantCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2.5">
                Cuisine
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {availableCuisines.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCuisine(c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCuisine === c
                        ? 'bg-brand text-white font-semibold'
                        : 'text-muted hover:text-cream hover:bg-smoke/60'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Level */}
            <div>
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2.5">
                Price Band
              </label>
              <div className="grid grid-cols-5 gap-1 p-1 bg-smoke rounded-xl">
                {['All', '£', '££', '£££', '££££'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPrice(p)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-colors font-mono ${
                      selectedPrice === p
                        ? 'bg-coal text-brand shadow-sm'
                        : 'text-muted hover:text-cream'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2.5">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-smoke rounded-xl">
                {[
                  { label: 'Any', value: 0 },
                  { label: '4.0★', value: 4.0 },
                  { label: '4.5★', value: 4.5 },
                  { label: '4.8★', value: 4.8 },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setMinRating(r.value)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      minRating === r.value
                        ? 'bg-coal text-saffron shadow-sm'
                        : 'text-muted hover:text-cream'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Tonight Toggle */}
            <div className="pt-2 border-t border-smoke">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-cream">Available Tonight</span>
                <input
                  type="checkbox"
                  checked={availableTonight}
                  onChange={(e) => setAvailableTonight(e.target.checked)}
                  className="w-4 h-4 accent-brand rounded cursor-pointer"
                />
              </label>
            </div>
          </aside>

          {/* Results Area */}
          <main className="lg:col-span-9">
            {/* Map View Mode */}
            {viewMode === 'map' ? (
              <div className="space-y-6">
                <InteractiveMap
                  restaurants={filteredRestaurants}
                  selectedRestaurant={selectedMapVenue}
                  onSelectRestaurant={(r) => setSelectedMapVenue(r)}
                  height="600px"
                />

                {/* Horizontal strip of results below map */}
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {filteredRestaurants.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => setSelectedMapVenue(r)}
                      className={`w-64 p-3 rounded-xl bg-coal border cursor-pointer shrink-0 transition-colors ${
                        selectedMapVenue?.id === r.id ? 'border-brand' : 'border-smoke hover:border-smoke/80'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-cream truncate">{r.name}</h4>
                      <p className="text-[11px] text-muted truncate mt-0.5">{r.cuisine} · {r.neighbourhood}</p>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-saffron font-medium">★ {r.rating}</span>
                        <Link
                          to={`/restaurant/${r.slug}`}
                          className="text-brand font-semibold hover:underline"
                        >
                          Book table →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              /* Grid or List View Mode */
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredRestaurants.map((restaurant) => {
                  const fav = isFavorite(restaurant.id);

                  if (viewMode === 'list') {
                    return (
                      <div
                        key={restaurant.id}
                        className="p-4 rounded-2xl bg-coal border border-smoke/80 hover:border-smoke transition-all flex flex-col sm:flex-row gap-4 group"
                      >
                        <div className="w-full sm:w-48 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-smoke relative">
                          <SmartImage
                            photo={restaurant.photos?.[0]}
                            mockFallback={restaurant.photos?.[0]?.url}
                            slug={restaurant.slug}
                            alt={restaurant.name}
                            aspectRatio="4/3"
                            width={500}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-serif text-lg font-bold text-cream group-hover:text-ember transition-colors">
                                  {restaurant.name}
                                </h3>
                                <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                                  <span>{restaurant.cuisine}</span>
                                  <span>·</span>
                                  <span>{restaurant.neighbourhood}, {restaurant.city}</span>
                                  <span>·</span>
                                  <span className="font-mono text-cream/70 font-semibold">{restaurant.priceBand}</span>
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleFavorite(e, restaurant)}
                                className="p-1.5 rounded-full text-muted hover:text-brand"
                              >
                                <Heart className={`w-4 h-4 ${fav ? 'fill-brand text-brand' : ''}`} />
                              </button>
                            </div>

                            <p className="text-xs text-muted/80 mt-2 line-clamp-2 leading-relaxed">
                              {restaurant.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-smoke/60">
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="w-3.5 h-3.5 fill-saffron text-saffron" />
                              <span className="font-semibold text-cream tabular-nums">{restaurant.rating}</span>
                              <span className="text-muted">({restaurant.reviewCount} reviews)</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-muted flex items-center gap-1">
                                <Clock className="w-3 h-3 text-ember" />
                                <span>Next: {restaurant.nextAvailableTime || '19:30'}</span>
                              </span>
                              <Link
                                to={`/restaurant/${restaurant.slug}`}
                                className="px-4 py-1.5 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-sm hover:shadow-brand/30 transition-all"
                              >
                                Reserve
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Grid Card
                  return (
                    <div
                      key={restaurant.id}
                      className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-smoke hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
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

                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink/85 backdrop-blur-md border border-smoke/70 text-[11px] text-cream font-medium">
                          <Clock className="w-3 h-3 text-ember" />
                          <span>Next: {restaurant.nextAvailableTime || '19:30'}</span>
                        </div>
                      </div>

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

                          <div className="flex items-center gap-2 text-xs text-muted mt-1.5">
                            <span>{restaurant.cuisine}</span>
                            <span aria-hidden="true">·</span>
                            <span>{restaurant.neighbourhood}</span>
                          </div>

                          <p className="text-xs text-muted/80 mt-2.5 line-clamp-2 leading-relaxed">
                            {restaurant.description}
                          </p>
                        </div>

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
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="py-24 text-center p-8 rounded-2xl bg-coal border border-smoke">
                <Search className="w-10 h-10 text-muted/40 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-cream">No tables match your criteria</h3>
                <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                  Try broadening your filters, choosing a different neighbourhood, or resetting your search.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-brand text-xs font-semibold text-white shadow-md hover:bg-ember transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-coal border-t border-smoke p-6 max-h-[85vh] overflow-y-auto space-y-6 lg:hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-smoke">
                <h3 className="font-serif text-lg font-bold text-cream">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded text-muted hover:text-cream"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-semibold text-muted block mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-smoke text-xs text-cream outline-none"
                >
                  <option value="All">All Cities</option>
                  {CITIES_BENTO.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Cuisine */}
              <div>
                <label className="text-xs font-semibold text-muted block mb-2">Cuisine</label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-smoke text-xs text-cream outline-none"
                >
                  {availableCuisines.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-xl bg-smoke text-xs font-semibold text-cream"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-brand text-xs font-semibold text-white shadow-md"
                >
                  Apply ({filteredRestaurants.length} tables)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
