import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, Search, ChevronDown, Sparkles } from 'lucide-react';
import { SmartImage } from '../ui/SmartImage';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
    title: 'The Lantern Room at The Art School',
    city: 'Liverpool',
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
    title: 'vin18 Evening Cocktail Salon',
    city: 'Glasgow',
  },
  {
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
    title: 'Wood-fired Embers at Brat',
    city: 'London',
  },
  {
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=85',
    title: 'Coastal Dining at Mamó',
    city: 'Dublin',
  },
];

const SEARCH_PLACEHOLDERS = [
  'Glasgow…',
  'Sushi in Soho…',
  'Brunch in Dublin…',
  'vin18 Rutherglen…',
  'Tasting menu in Liverpool…',
  'Wine bars in Edinburgh…',
];

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Booking bar state
  const [guests, setGuests] = useState('2 People');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('19:30');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // Slide transition every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Typing animation for search input placeholder
  useEffect(() => {
    const target = SEARCH_PLACEHOLDERS[placeholderIndex];
    const speed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < target.length) {
          setDisplayedText(target.slice(0, displayedText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(target.slice(0, displayedText.length - 1));
        } else {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, placeholderIndex]);

  const handleBookingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    params.set('guests', guests.replace(/[^0-9]/g, '') || '2');
    params.set('time', time);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between overflow-hidden bg-ink pt-28 pb-12">
      {/* Background Ken Burns Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Scrim & Radial Ember Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
            <div className="absolute inset-0 bg-radial-at-c from-brand/15 via-transparent to-transparent opacity-60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Caption (Bottom-right, subtle) */}
      <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/70 backdrop-blur-md border border-smoke/60 text-[11px] text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
        <span className="text-cream font-medium">{HERO_SLIDES[currentSlide].title}</span>
        <span>·</span>
        <span>{HERO_SLIDES[currentSlide].city}</span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-center flex flex-col items-center">
        {/* Editorial Subtitle Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-smoke/60 border border-smoke backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-saffron" />
          <span className="text-xs font-semibold text-cream/90 tracking-wide">
            ResDiary Real-Time Table Reservations
          </span>
        </motion.div>

        {/* Headline: Staggered Words */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-cream max-w-4xl leading-[1.08] text-balance"
        >
          Find the table everyone will be{' '}
          <span className="text-gradient italic font-normal">talking about.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-sm sm:text-base md:text-lg text-muted/90 max-w-2xl mt-5 mb-10 leading-relaxed text-balance"
        >
          Thousands of restaurants across 20+ cities, real-time availability, booked in seconds.
        </motion.p>

        {/* Floating Glass Booking Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="w-full max-w-4xl"
        >
          <form
            onSubmit={handleBookingSearch}
            className="p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-coal/85 border border-smoke/90 backdrop-blur-2xl shadow-2xl shadow-black/60 flex flex-col sm:flex-row items-center gap-2"
          >
            {/* Guests Selector */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-full hover:bg-smoke/40 transition-colors cursor-pointer border sm:border-0 border-smoke/50">
              <Users className="w-4 h-4 text-brand shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-muted font-semibold">Guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-cream outline-none cursor-pointer w-full"
                >
                  <option value="1 Person" className="bg-coal text-cream">1 Diner</option>
                  <option value="2 People" className="bg-coal text-cream">2 Diners</option>
                  <option value="3 People" className="bg-coal text-cream">3 Diners</option>
                  <option value="4 People" className="bg-coal text-cream">4 Diners</option>
                  <option value="5 People" className="bg-coal text-cream">5 Diners</option>
                  <option value="6+ People" className="bg-coal text-cream">6+ Group</option>
                </select>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-smoke/80" />

            {/* Date Selector */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-full hover:bg-smoke/40 transition-colors cursor-pointer border sm:border-0 border-smoke/50">
              <Calendar className="w-4 h-4 text-ember shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-muted font-semibold">Date</span>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-cream outline-none cursor-pointer w-full"
                >
                  <option value="Today" className="bg-coal text-cream">Tonight</option>
                  <option value="Tomorrow" className="bg-coal text-cream">Tomorrow</option>
                  <option value="This Friday" className="bg-coal text-cream">This Friday</option>
                  <option value="This Saturday" className="bg-coal text-cream">This Saturday</option>
                  <option value="Next Week" className="bg-coal text-cream">Next Week</option>
                </select>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-smoke/80" />

            {/* Time Selector */}
            <div className="w-full sm:w-auto flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-full hover:bg-smoke/40 transition-colors cursor-pointer border sm:border-0 border-smoke/50">
              <Clock className="w-4 h-4 text-saffron shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-muted font-semibold">Time</span>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-cream outline-none cursor-pointer w-full"
                >
                  <option value="12:30" className="bg-coal text-cream">12:30 PM (Lunch)</option>
                  <option value="13:30" className="bg-coal text-cream">1:30 PM (Lunch)</option>
                  <option value="18:00" className="bg-coal text-cream">6:00 PM</option>
                  <option value="19:00" className="bg-coal text-cream">7:00 PM</option>
                  <option value="19:30" className="bg-coal text-cream">7:30 PM (Peak)</option>
                  <option value="20:00" className="bg-coal text-cream">8:00 PM</option>
                  <option value="20:30" className="bg-coal text-cream">8:30 PM</option>
                  <option value="21:00" className="bg-coal text-cream">9:00 PM</option>
                </select>
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-smoke/80" />

            {/* Search Input with Typing Animated Placeholder */}
            <div className="w-full sm:w-auto flex-[1.4] flex items-center gap-2.5 px-4 py-2 border sm:border-0 border-smoke/50 rounded-xl sm:rounded-full">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={displayedText || 'Glasgow…'}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-cream placeholder-muted/70 outline-none"
              />
            </div>

            {/* Gradient Search CTA Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-95 transition-all shrink-0"
            >
              Search tables
            </button>
          </form>
        </motion.div>

        {/* Trust Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-xs text-muted"
        >
          <span className="flex items-center gap-1.5 font-medium text-cream/90">
            <span className="text-saffron">★</span> 4.8 average rating
          </span>
          <span className="hidden sm:inline text-smoke">·</span>
          <span>120k+ diners seated monthly</span>
          <span className="hidden sm:inline text-smoke">·</span>
          <span className="font-semibold text-cream/80">Powered by ResDiary</span>
        </motion.div>
      </div>

      {/* Floating Live Mini-Cards Overlapping Edge (Desktop Only) */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full hidden lg:flex justify-between items-end pointer-events-none">
        {/* Floating card 1 */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-auto p-3.5 rounded-2xl bg-coal/90 border border-smoke/80 backdrop-blur-xl shadow-2xl flex items-center gap-3 max-w-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-smoke overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80"
              alt="vin18"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-cream truncate">Table for 2 booked at vin18</p>
            <p className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Rutherglen, Glasgow · Just now</span>
            </p>
          </div>
        </motion.div>

        {/* Scroll Cue in Center */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-[10px] text-muted tracking-widest uppercase"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-brand" />
        </motion.div>

        {/* Floating card 2 */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="pointer-events-auto p-3.5 rounded-2xl bg-coal/90 border border-smoke/80 backdrop-blur-xl shadow-2xl flex items-center gap-3 max-w-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-smoke overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=150&q=80"
              alt="Mamó"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-semibold text-cream truncate">Table for 4 confirmed at Mamó</p>
            <p className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Howth, Dublin · 2 mins ago</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
