import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

interface CartButtonProps {
  navTheme?: 'dark' | 'light';
}

export const CartButton: React.FC<CartButtonProps> = ({ navTheme = 'dark' }) => {
  const { items, getItemCount, getSubtotal, toggleCart, openCart } = useCartStore();
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  const [isPopping, setIsPopping] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const prevCountRef = useRef(itemCount);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger pop, shake, and ripple whenever count increases
  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setIsPopping(true);
      const timer = setTimeout(() => setIsPopping(false), 700);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (itemCount > 0) {
      timeoutRef.current = setTimeout(() => setShowPreview(true), 140);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowPreview(false), 200);
  };

  const isLight = navTheme === 'light';

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleCart}
        className={`relative p-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          isLight
            ? 'text-ink/80 hover:text-ink hover:bg-coal/10'
            : 'text-cream/80 hover:text-cream hover:bg-smoke/60'
        }`}
        aria-label={`Open dining cart with ${itemCount} items`}
      >
        {/* Ripple glow ring on item addition */}
        <AnimatePresence>
          {isPopping && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: 1.9, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-brand pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Shaking Shopping Bag Icon */}
        <motion.div
          animate={
            isPopping
              ? { x: [0, -3, 3, -2, 2, 0], rotate: [0, -4, 4, -2, 2, 0] }
              : { x: 0, rotate: 0 }
          }
          transition={{ duration: 0.45 }}
        >
          <ShoppingBag className="w-5 h-5" />
        </motion.div>

        {/* Animated Count Badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              key="cart-badge"
              initial={{ scale: 0 }}
              animate={
                isPopping
                  ? { scale: [1, 1.45, 1], transition: { duration: 0.4, type: 'spring' } }
                  : { scale: 1 }
              }
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full bg-brand-gradient text-[10px] font-bold text-white flex items-center justify-center shadow-md shadow-brand/40 border border-ink/40"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Mini Cart Preview Dropdown on Hover */}
      <AnimatePresence>
        {showPreview && itemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-2xl bg-coal/95 backdrop-blur-2xl border border-smoke shadow-2xl shadow-black/60 z-50"
          >
            <div className="flex items-center justify-between pb-2 border-b border-smoke mb-2">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Cart Preview ({itemCount})
              </span>
              <span className="text-xs font-bold text-cream">
                £{subtotal.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {items.slice(-3).map((item) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-smoke overflow-hidden shrink-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-cream truncate">{item.title}</p>
                    <p className="text-[10px] text-muted">
                      Qty: {item.quantity} · £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowPreview(false);
                openCart();
              }}
              className="mt-3 w-full py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold hover:shadow-lg hover:shadow-brand/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>View full cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
