import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Compass, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';

interface MobileBottomBarProps {
  isVisible: boolean;
  isMenuOpen: boolean;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ isVisible, isMenuOpen }) => {
  const location = useLocation();
  const { toggleCart, getItemCount, isOpen: isCartOpen } = useCartStore();
  const { favorites } = useFavoritesStore();
  const cartCount = getItemCount();
  const favCount = favorites.length;

  // Hide if mobile menu or cart drawer is open
  const shouldShow = isVisible && !isMenuOpen && !isCartOpen;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-3 inset-x-0 mx-auto w-[90%] max-w-sm z-40 md:hidden pointer-events-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-around py-2.5 px-4 rounded-full bg-coal/85 backdrop-blur-xl border border-smoke/90 shadow-2xl shadow-black/80">
            {/* Home */}
            <Link
              to="/"
              className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
                location.pathname === '/' ? 'text-brand' : 'text-cream/70 hover:text-cream'
              }`}
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Home</span>
            </Link>

            {/* Explore */}
            <Link
              to="/explore"
              className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
                location.pathname.startsWith('/explore') ? 'text-brand' : 'text-cream/70 hover:text-cream'
              }`}
              aria-label="Explore"
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Explore</span>
            </Link>

            {/* Favourites */}
            <Link
              to="/explore?filter=favorites"
              className={`relative flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
                location.search.includes('favorites') ? 'text-brand' : 'text-cream/70 hover:text-cream'
              }`}
              aria-label={`Favourites (${favCount})`}
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {favCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-brand text-[9px] font-bold text-white flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">Saved</span>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex flex-col items-center gap-0.5 p-1.5 text-cream/70 hover:text-cream transition-colors"
              aria-label={`Cart (${cartCount} items)`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-brand-gradient text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">Cart</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
