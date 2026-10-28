import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Utensils, Sparkles, ArrowRight, Clock, CornerDownLeft } from 'lucide-react';
import { RESTAURANTS_DATA } from '../../data/restaurants';
import { CITIES_BENTO } from '../../data/cities';
import { DISHES_DATA } from '../../data/dishes';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLACEHOLDERS = [
  'Search restaurants, e.g. vin18 Glasgow…',
  'Search signature dishes, e.g. Wagyu, Truffle Tagliolini…',
  'Search culinary cities, e.g. Dublin, London, Edinburgh…',
  'Search cuisines, e.g. Modern European, Seafood, Sushi…',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [placeholderText, setPlaceholderText] = useState(PLACEHOLDERS[0]);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dishcult_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('dishcult_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Animated placeholder cycling
  useEffect(() => {
    if (!isOpen) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % PLACEHOLDERS.length;
      setPlaceholderText(PLACEHOLDERS[idx]);
    }, 3200);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const cleanQuery = query.toLowerCase().trim();

  // Results grouping
  const matchedRestaurants = cleanQuery
    ? RESTAURANTS_DATA.filter(
        (r) =>
          r.name.toLowerCase().includes(cleanQuery) ||
          r.cuisine.toLowerCase().includes(cleanQuery) ||
          r.neighbourhood.toLowerCase().includes(cleanQuery) ||
          r.city.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const matchedCities = cleanQuery
    ? CITIES_BENTO.filter((c) => c.name.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : [];

  const matchedDishes = cleanQuery
    ? DISHES_DATA.filter(
        (d) =>
          d.name.toLowerCase().includes(cleanQuery) ||
          d.restaurantName.toLowerCase().includes(cleanQuery)
      ).slice(0, 3)
    : [];

  // Flattened list for keyboard navigation
  const allResults = [
    ...matchedRestaurants.map((r) => ({ type: 'restaurant' as const, id: r.id, title: r.name, url: `/restaurant/${r.slug}`, subtitle: `${r.cuisine} · ${r.city}` })),
    ...matchedCities.map((c) => ({ type: 'city' as const, id: c.id, title: c.name, url: `/cities/${c.slug}`, subtitle: `${c.restaurantCount} verified tables` })),
    ...matchedDishes.map((d) => ({ type: 'dish' as const, id: d.id, title: d.name, url: `/restaurant/${d.restaurantSlug || 'vin18-glasgow'}`, subtitle: `${d.restaurantName} · £${d.price.toFixed(2)}` })),
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length ? (prev + 1) % allResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length ? (prev - 1 + allResults.length) % allResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults.length && allResults[selectedIndex]) {
          const item = allResults[selectedIndex];
          saveRecentSearch(item.title);
          onClose();
          navigate(item.url);
        } else if (cleanQuery) {
          saveRecentSearch(query);
          onClose();
          navigate(`/explore?search=${encodeURIComponent(query)}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex, cleanQuery, query, navigate, onClose]);

  const handleSelectItem = (title: string, url: string) => {
    saveRecentSearch(title);
    onClose();
    navigate(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink/80 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-coal/95 border border-smoke/90 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[82vh]"
          >
            {/* Search Input Box */}
            <div className="relative flex items-center px-5 py-4 border-b border-smoke/70">
              <Search className="w-5 h-5 text-brand shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={placeholderText}
                className="w-full bg-transparent text-cream placeholder-muted/60 text-base sm:text-lg outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full text-muted hover:text-cream hover:bg-smoke mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted bg-smoke/80 px-2 py-1 rounded-lg border border-smoke">
                <span>ESC</span>
              </div>
            </div>

            {/* Results Section */}
            <div className="overflow-y-auto p-4 space-y-5">
              {cleanQuery ? (
                <>
                  {/* Restaurants Group */}
                  {matchedRestaurants.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 mb-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                        <Utensils className="w-3.5 h-3.5 text-brand" />
                        <span>Restaurants</span>
                      </div>
                      <div className="space-y-1">
                        {matchedRestaurants.map((r) => {
                          const itemIndex = allResults.findIndex((item) => item.id === r.id);
                          const isHighlighted = selectedIndex === itemIndex;
                          return (
                            <button
                              key={r.id}
                              onClick={() => handleSelectItem(r.name, `/restaurant/${r.slug}`)}
                              className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                                isHighlighted ? 'bg-smoke/80 text-cream' : 'hover:bg-smoke/40 text-cream/90'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-smoke overflow-hidden shrink-0">
                                  <img
                                    src={r.photos[0]?.url}
                                    alt={r.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-cream">{r.name}</span>
                                    <span className="text-[10px] text-saffron font-bold">★ {r.rating}</span>
                                  </div>
                                  <p className="text-xs text-muted mt-0.5">
                                    {r.cuisine} · {r.neighbourhood}, {r.city} · {r.priceBand}
                                  </p>
                                </div>
                              </div>
                              <CornerDownLeft className={`w-4 h-4 ${isHighlighted ? 'text-brand' : 'opacity-0'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cities Group */}
                  {matchedCities.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 mb-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-ember" />
                        <span>Dining Destinations</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {matchedCities.map((c) => {
                          const itemIndex = allResults.findIndex((item) => item.id === c.id);
                          const isHighlighted = selectedIndex === itemIndex;
                          return (
                            <button
                              key={c.id}
                              onClick={() => handleSelectItem(c.name, `/cities/${c.slug}`)}
                              className={`p-3 rounded-xl border border-smoke/70 text-left transition-colors flex items-center justify-between ${
                                isHighlighted ? 'bg-smoke/80 border-brand' : 'bg-coal hover:bg-smoke/40'
                              }`}
                            >
                              <div>
                                <span className="text-xs font-bold text-cream block">{c.name}</span>
                                <span className="text-[10px] text-muted">{c.restaurantCount} venues</span>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dishes Group */}
                  {matchedDishes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 mb-2 text-[11px] font-bold text-muted uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-saffron" />
                        <span>Signature Dishes</span>
                      </div>
                      <div className="space-y-1">
                        {matchedDishes.map((d) => {
                          const itemIndex = allResults.findIndex((item) => item.id === d.id);
                          const isHighlighted = selectedIndex === itemIndex;
                          return (
                            <button
                              key={d.id}
                              onClick={() => handleSelectItem(d.name, `/restaurant/${d.restaurantSlug || 'vin18-glasgow'}`)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                                isHighlighted ? 'bg-smoke/80' : 'hover:bg-smoke/40'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-smoke overflow-hidden shrink-0">
                                  <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-cream">{d.name}</span>
                                  <p className="text-[10px] text-muted">{d.restaurantName}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-saffron">£{d.price.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {allResults.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-sm font-semibold text-cream">No results found for "{query}"</p>
                      <p className="text-xs text-muted mt-1">Try searching for Glasgow, Dublin, vin18, or Italian.</p>
                      <button
                        onClick={() => {
                          saveRecentSearch(query);
                          onClose();
                          navigate(`/explore?search=${encodeURIComponent(query)}`);
                        }}
                        className="mt-4 px-4 py-2 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-md"
                      >
                        Search all venues in Explore
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-3 mb-2">
                        <span className="text-[11px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('dishcult_recent_searches');
                          }}
                          className="text-[10px] text-muted hover:text-cream"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-3">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-xl bg-smoke/40 hover:bg-smoke border border-smoke/60 text-xs text-cream flex items-center gap-1.5"
                          >
                            <span>{term}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block px-3 mb-2">
                      Popular Culinary Searches
                    </span>
                    <div className="flex flex-wrap gap-2 px-3">
                      {['vin18 Glasgow', 'Dublin Seafood', 'Edinburgh Fine Dining', 'Sydney Waterfront', 'Michelin Stars', 'Brunch'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-3 py-1.5 rounded-xl bg-smoke/40 hover:bg-smoke border border-smoke/60 text-xs text-cream/90"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Shortcuts Guide */}
            <div className="px-5 py-3 border-t border-smoke/60 bg-ink/60 flex items-center justify-between text-[11px] text-muted">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
              </div>
              <span className="text-saffron font-medium">Dish Cult Global Discovery</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
