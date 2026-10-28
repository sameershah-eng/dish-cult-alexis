import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Share2,
  Heart,
  Check,
  Calendar,
  Users,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
  Utensils,
  ShieldCheck,
} from 'lucide-react';
import { usePlace } from '../lib/places';
import { RESTAURANTS_DATA } from '../data/restaurants';
import { DISHES_DATA } from '../data/dishes';
import { REVIEWS_DATA } from '../data/reviews';
import { SmartImage } from '../components/ui/SmartImage';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useCartStore } from '../store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useToastStore } from '../store/useToastStore';
import { Dish } from '../types';

export const RestaurantDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const activeSlug = slug || 'vin18';

  const { restaurant, loading } = usePlace(activeSlug);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addItem, updateQuantity, items } = useCartStore();
  const { addToast } = useToastStore();

  // Booking Card State
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [bookingConfirmedModal, setBookingConfirmedModal] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Active Menu Category Filter
  const [menuTab, setMenuTab] = useState<'all' | 'starters' | 'mains' | 'desserts' | 'drinks'>('all');

  // Fallback to vin18 if not found
  const venue =
    restaurant ||
    RESTAURANTS_DATA.find((r) => r.slug === activeSlug) ||
    RESTAURANTS_DATA[0];

  const fav = isFavorite(venue.id);

  // Dishes affiliated with this venue
  const venueDishes = DISHES_DATA.filter(
    (d) => d.restaurantSlug === venue.slug || d.restaurantName === venue.name
  );
  // If venue has fewer than 4 dishes, include a couple of curated specials
  const displayDishes =
    venueDishes.length >= 3 ? venueDishes : [...venueDishes, ...DISHES_DATA.slice(0, 4)];

  const filteredDishes =
    menuTab === 'all'
      ? displayDishes
      : displayDishes.filter((d) => d.category === menuTab);

  // Nearby / Similar restaurants
  const similarRestaurants = RESTAURANTS_DATA.filter((r) => r.id !== venue.id).slice(0, 4);

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${venue.name} on Dish Cult`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Link copied to clipboard',
        type: 'info',
      });
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `DC-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setBookingConfirmedModal(true);
  };

  const handleAddDish = (dish: Dish) => {
    addItem({
      id: `dish-${dish.id}`,
      originalId: dish.id,
      type: 'dish',
      title: dish.name,
      subtitle: `From ${venue.name}`,
      price: dish.price,
      image: dish.image,
    });
    addToast({
      title: 'Added to your order',
      description: `${dish.name} (${formatGBP(dish.price)})`,
      type: 'success',
    });
  };

  const timeSlots = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <div className="min-h-screen bg-ink pt-24 pb-28">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-smoke text-cream hover:bg-coal transition-colors z-10"
              aria-label="Close photo gallery"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + venue.photos.length) % venue.photos.length);
              }}
              className="absolute left-6 p-3 rounded-full bg-smoke/80 text-cream hover:bg-smoke transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={venue.photos[lightboxIndex]?.url || venue.photos[0]?.url}
                alt={`${venue.name} preview`}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <p className="text-center text-xs text-muted mt-2">
                Photo {lightboxIndex + 1} of {venue.photos.length}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % venue.photos.length);
              }}
              className="absolute right-6 p-3 rounded-full bg-smoke/80 text-cream hover:bg-smoke transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link to="/" className="hover:text-cream transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/explore?city=${venue.city}`} className="hover:text-cream transition-colors">{venue.city}</Link>
          <span>/</span>
          <span className="text-cream font-medium truncate">{venue.name}</span>
        </div>

        {/* Gallery Hero: Asymmetric Mosaic */}
        <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-2 mb-10 h-[380px] sm:h-[480px]">
          {/* Main Large Image */}
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-8 h-full relative cursor-pointer group overflow-hidden bg-coal"
          >
            <SmartImage
              photo={venue.photos[0]}
              mockFallback={venue.photos[0]?.url}
              slug={venue.slug}
              alt={venue.name}
              aspectRatio="auto"
              priority={true}
              width={1200}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 z-10 text-left">
              <span className="px-3 py-1 rounded-full bg-brand-gradient text-[11px] font-bold text-white uppercase tracking-wider mb-2 inline-block">
                ResDiary Verified Venue
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-cream tracking-tight">
                {venue.name}
              </h1>
              <p className="text-xs sm:text-sm text-cream/90 mt-1 max-w-xl line-clamp-1">
                {venue.tagline || venue.description}
              </p>
            </div>
          </div>

          {/* Right Two Stacked Thumbnails */}
          <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-2 h-full">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                onClick={() => {
                  setLightboxIndex(idx % venue.photos.length);
                  setLightboxOpen(true);
                }}
                className="relative overflow-hidden cursor-pointer group bg-coal"
              >
                <SmartImage
                  photo={venue.photos[idx % venue.photos.length]}
                  mockFallback={venue.photos[idx % venue.photos.length]?.url}
                  slug={`${venue.slug}-${idx}`}
                  alt={`${venue.name} ambiance`}
                  aspectRatio="auto"
                  width={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors" />

                {idx === 2 && (
                  <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px] flex items-center justify-center text-cream font-semibold text-xs group-hover:bg-ink/50 transition-colors">
                    <span>View all {venue.photos.length || 4} photos →</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Header Bar (Share, Wishlist, Features) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-smoke">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5 text-cream font-semibold">
              <Star className="w-4 h-4 fill-saffron text-saffron" />
              <span>{venue.rating}</span>
              <span className="text-muted font-normal">({venue.reviewCount} diner reviews)</span>
            </span>
            <span>·</span>
            <span className="font-mono text-cream font-bold">{venue.priceBand}</span>
            <span>·</span>
            <span>{venue.cuisine}</span>
            <span>·</span>
            <span className="text-cream/90">{venue.neighbourhood}, {venue.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-coal hover:bg-smoke border border-smoke text-xs font-semibold text-cream transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-muted" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toggleFavorite(venue.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-coal hover:bg-smoke border border-smoke text-xs font-semibold text-cream transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${fav ? 'fill-brand text-brand' : 'text-muted'}`} />
              <span>{fav ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Content Left, Sticky Booking Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Story & About */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-cream">About the venue</h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {venue.description}
              </p>

              {/* Key Amenities / Features Grid */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.features.allowsDogs && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dog Friendly</span>
                  </div>
                )}
                {venue.features.disabledAccess && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Disabled Access</span>
                  </div>
                )}
                {venue.features.outdoorSeating && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Outdoor Terrace</span>
                  </div>
                )}
                {venue.features.freeWifi && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Free High-Speed WiFi</span>
                  </div>
                )}
                {venue.features.servesBrunch && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Brunch Specialties</span>
                  </div>
                )}
                {venue.features.servesVegetarianFood && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coal border border-smoke/70 text-xs text-cream/90">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Vegetarian Options</span>
                  </div>
                )}
              </div>
            </div>

            {/* Menu Section with Addable Dishes */}
            <div className="space-y-6 pt-6 border-t border-smoke">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand tracking-widest uppercase">
                    Kitchen Creations
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-cream mt-1">
                    Signature Menu
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 bg-coal rounded-xl border border-smoke overflow-x-auto no-scrollbar">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'starters', label: 'Starters' },
                    { id: 'mains', label: 'Mains' },
                    { id: 'desserts', label: 'Desserts' },
                    { id: 'drinks', label: 'Cocktails' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMenuTab(tab.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        menuTab === tab.id
                          ? 'bg-brand text-white shadow-sm'
                          : 'text-muted hover:text-cream'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dish List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDishes.map((dish) => {
                  const inCart = items.find((i) => i.id === `dish-${dish.id}`);
                  const qty = inCart?.quantity || 0;

                  return (
                    <div
                      key={dish.id}
                      className="p-4 rounded-2xl bg-coal border border-smoke/80 hover:border-smoke transition-all flex flex-col justify-between"
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-smoke"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-cream leading-snug">{dish.name}</h4>
                          <p className="text-xs font-bold text-brand tabular-nums font-mono mt-1">
                            {formatGBP(dish.price)}
                          </p>
                          <p className="text-[11px] text-muted line-clamp-2 mt-1 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-smoke/60">
                        <div className="flex gap-1">
                          {dish.dietary.map((d) => (
                            <span key={d} className="px-1.5 py-0.5 rounded bg-smoke text-[9px] font-bold text-saffron">
                              {d}
                            </span>
                          ))}
                        </div>

                        {qty > 0 ? (
                          <div className="flex items-center gap-2 bg-smoke/80 rounded-full border border-smoke p-0.5">
                            <button
                              onClick={() => updateQuantity(`dish-${dish.id}`, -1)}
                              className="w-5 h-5 rounded-full bg-coal text-cream flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-cream px-1">{qty}</span>
                            <button
                              onClick={() => updateQuantity(`dish-${dish.id}`, 1)}
                              className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddDish(dish)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-smoke hover:bg-brand text-cream hover:text-white text-xs font-semibold transition-all active:scale-95"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Opening Hours & Venue Details */}
            <div className="space-y-4 pt-6 border-t border-smoke">
              <h2 className="font-serif text-2xl font-bold text-cream">Hours & Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-coal border border-smoke/80 space-y-2">
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Opening Times</h4>
                  {venue.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-smoke/40 last:border-0">
                      <span className="text-muted">{h.split(':')[0]}</span>
                      <span className="text-cream font-medium">{h.substring(h.indexOf(':') + 1).trim()}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-coal border border-smoke/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Address & Contact</h4>
                    <p className="text-xs text-cream flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <span>{venue.address}</span>
                    </p>
                    {venue.phone && (
                      <p className="text-xs text-cream flex items-center gap-2">
                        <Phone className="w-4 h-4 text-ember shrink-0" />
                        <a href={`tel:${venue.phone}`} className="hover:underline">{venue.phone}</a>
                      </p>
                    )}
                    {venue.website && (
                      <p className="text-xs text-cream flex items-center gap-2">
                        <Globe className="w-4 h-4 text-saffron shrink-0" />
                        <a href={venue.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                          {venue.website.replace('https://', '')}
                        </a>
                      </p>
                    )}
                  </div>

                  {venue.mapsUrl && (
                    <a
                      href={venue.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-smoke hover:bg-smoke/80 text-xs font-semibold text-cream border border-smoke/80 transition-colors"
                    >
                      <span>Get directions on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Interactive Venue Map */}
              <div className="mt-4">
                <InteractiveMap
                  selectedRestaurant={venue}
                  height="340px"
                  zoom={15}
                />
              </div>
            </div>

            {/* Reviews Breakdown Section */}
            <div className="space-y-6 pt-6 border-t border-smoke">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-brand tracking-widest uppercase">
                    Verified Diners
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-cream mt-1">
                    Reviews & Scores
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-serif text-4xl font-extrabold text-cream tabular-nums">{venue.rating}</span>
                  <div>
                    <div className="flex text-saffron">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-muted">Out of 5.0 rating</span>
                  </div>
                </div>
              </div>

              {/* Rating breakdown bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-coal border border-smoke">
                {[
                  { label: 'Food quality', score: '4.9' },
                  { label: 'Service', score: '4.8' },
                  { label: 'Ambiance', score: '4.9' },
                  { label: 'Value', score: '4.7' },
                ].map((b) => (
                  <div key={b.label}>
                    <span className="text-[11px] text-muted block mb-1">{b.label}</span>
                    <span className="font-serif text-lg font-bold text-cream">{b.score}</span>
                    <div className="w-full h-1.5 rounded-full bg-smoke mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-brand-gradient rounded-full"
                        style={{ width: `${(parseFloat(b.score) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {(venue.reviews?.length ? venue.reviews : REVIEWS_DATA.slice(0, 3)).map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-coal border border-smoke/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-smoke flex items-center justify-center font-bold text-xs text-cream">
                          {rev.authorName[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-cream">{rev.authorName}</h4>
                          <span className="text-[10px] text-muted">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-saffron">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted/90 leading-relaxed">
                      "{rev.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Module (PDP) */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="rounded-3xl bg-coal border border-smoke/90 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-smoke">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted font-semibold block">
                    Instant Table Booking
                  </span>
                  <h3 className="font-serif text-xl font-bold text-cream">Reserve a Table</h3>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ResDiary Live</span>
                </div>
              </div>

              <form onSubmit={handleConfirmReservation} className="mt-5 space-y-4">
                {/* Guests Stepper */}
                <div>
                  <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-smoke border border-smoke/80">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="p-2 rounded-lg bg-coal text-cream hover:bg-coal/80 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-cream tabular-nums">
                      {guests} {guests === 1 ? 'Guest' : 'Guests'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(12, g + 1))}
                      className="p-2 rounded-lg bg-coal text-cream hover:bg-coal/80 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                    Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs font-semibold text-cream outline-none cursor-pointer"
                  >
                    <option value="Today">Tonight ({new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })})</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday">This Friday</option>
                    <option value="Saturday">This Saturday</option>
                    <option value="Sunday">This Sunday</option>
                  </select>
                </div>

                {/* Time Slot Chips */}
                <div>
                  <label className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                          selectedTime === slot
                            ? 'bg-brand text-white shadow-md'
                            : 'bg-smoke/70 text-cream/80 hover:bg-smoke hover:text-cream border border-smoke/60'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Notice */}
                <div className="p-3 rounded-xl bg-smoke/40 text-[11px] text-muted leading-relaxed">
                  Confirmation will be dispatched instantly via SMS & email with your ResDiary booking reference. Zero reservation fees.
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-98 transition-all"
                >
                  Confirm Table for {guests} at {selectedTime}
                </button>
              </form>
            </div>
          </aside>
        </div>

        {/* Similar Restaurants Nearby Rail */}
        <div className="mt-20 pt-12 border-t border-smoke/70">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-brand tracking-widest uppercase">
                Explore Next
              </span>
              <h3 className="font-serif text-2xl font-bold text-cream mt-1">
                Similar dining rooms nearby
              </h3>
            </div>
            <Link
              to={`/explore?city=${venue.city}`}
              className="text-xs font-semibold text-cream hover:text-ember flex items-center gap-1"
            >
              <span>More in {venue.city}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarRestaurants.map((sim) => (
              <Link
                key={sim.id}
                to={`/restaurant/${sim.slug}`}
                className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden group shadow-lg hover:border-smoke hover:-translate-y-1 transition-all"
              >
                <div className="aspect-[4/3] bg-coal relative overflow-hidden">
                  <img
                    src={sim.photos[0]?.url}
                    alt={sim.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-ink/80 text-[10px] text-cream font-medium">
                    Next: {sim.nextAvailableTime}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-bold text-sm text-cream group-hover:text-ember transition-colors">
                    {sim.name}
                  </h4>
                  <p className="text-[11px] text-muted mt-0.5">{sim.cuisine} · {sim.neighbourhood}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-smoke/50 text-xs">
                    <span className="text-saffron font-medium">★ {sim.rating}</span>
                    <span className="text-cream/80 font-mono font-semibold">{sim.priceBand}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {bookingConfirmedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-coal border border-smoke rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest">
                  Reservation Confirmed
                </span>
                <h3 className="font-serif text-2xl font-bold text-cream mt-1">
                  Table for {guests} at {venue.name}
                </h3>
                <p className="text-xs text-muted mt-1.5 leading-relaxed">
                  {selectedDate} at {selectedTime} · {venue.address}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-smoke/40 border border-smoke/60 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Booking Reference</span>
                  <span className="font-mono font-bold text-cream">{bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Table Allocation</span>
                  <span className="font-semibold text-cream">Main Dining Salon</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Confirmation Status</span>
                  <span className="text-emerald-400 font-semibold">ResDiary Guaranteed</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setBookingConfirmedModal(false)}
                  className="w-full py-3 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-lg"
                >
                  Done & Back to Venue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Booking Bar Cap (within 15% mobile viewport cap) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-coal/95 backdrop-blur-xl border-t border-smoke p-3 px-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-muted block">{venue.name}</span>
          <span className="text-xs font-bold text-cream">From 17:30 tonight</span>
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-lg"
        >
          Reserve table
        </button>
      </div>
    </div>
  );
};
