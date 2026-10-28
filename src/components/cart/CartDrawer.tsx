import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Check } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getServiceFee,
    getDiscountAmount,
    getTotal,
    promoCode,
    applyPromoCode,
    removePromoCode,
    undoRemove,
  } = useCartStore();

  const { addToast } = useToastStore();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  const subtotal = getSubtotal();
  const serviceFee = getServiceFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleRemove = (id: string, title: string) => {
    removeItem(id);
    addToast({
      title: 'Item removed from order',
      description: title,
      actionLabel: 'Undo',
      onAction: () => undoRemove(),
      type: 'info',
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoError(false);
      setPromoInput('');
      addToast({
        title: 'Promo applied!',
        description: '10% discount has been deducted from your order.',
        type: 'success',
      });
    } else {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    }
  };

  const handleProceedCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-coal border-l border-smoke shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-smoke">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <h3 className="font-serif text-lg font-bold text-cream">Your Order</h3>
                <span className="px-2 py-0.5 rounded-full bg-smoke text-[11px] font-semibold text-muted">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-muted hover:text-cream hover:bg-smoke transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            {items.length > 0 ? (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl bg-smoke/40 border border-smoke/70 hover:border-smoke transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-18 h-18 rounded-xl object-cover shrink-0 bg-smoke"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-cream truncate">
                            {item.title}
                          </h4>
                          <button
                            onClick={() => handleRemove(item.id, item.title)}
                            className="text-muted/60 hover:text-brand transition-colors p-0.5"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-semibold text-cream tabular-nums">
                          {formatGBP(item.price * item.quantity)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-coal rounded-lg border border-smoke p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-muted hover:text-cream transition-colors rounded"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-cream tabular-nums px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-muted hover:text-cream transition-colors rounded"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Cart State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-smoke/50 border border-smoke flex items-center justify-center text-muted mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-serif text-lg font-bold text-cream">Your cart is empty</h4>
                <p className="text-xs text-muted max-w-xs mt-1.5 leading-relaxed">
                  Discover partner signature dishes, tasting experiences, and gift cards from celebrated dining rooms.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/explore');
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-lg hover:shadow-brand/30 transition-all"
                >
                  Browse dishes & experiences
                </button>
              </div>
            )}

            {/* Footer / Summary (Visible when items > 0) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-smoke bg-coal/90 backdrop-blur-md space-y-4">
                {/* Promo Code Form */}
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" />
                      <span className="font-semibold">Code {promoCode} (10% OFF)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-xs text-muted hover:text-cream underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Try code: DISHCULT10"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-smoke/60 border border-smoke text-xs text-cream placeholder-muted outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-smoke hover:bg-smoke/90 text-xs font-semibold text-cream border border-smoke/80 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-brand">Invalid coupon code. Try "DISHCULT10".</p>
                )}

                {/* Bill Breakdown */}
                <div className="space-y-1.5 text-xs text-muted pt-2 border-t border-smoke/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-cream tabular-nums">{formatGBP(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discretionary service charge (10%)</span>
                    <span className="text-cream tabular-nums">{formatGBP(serviceFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo discount</span>
                      <span className="tabular-nums">-{formatGBP(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-cream pt-2 border-t border-smoke/60">
                    <span>Estimated Total</span>
                    <span className="text-brand tabular-nums">{formatGBP(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-xl shadow-brand/20 hover:shadow-brand/40 active:scale-[0.98] transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-muted">
                  Powered by ResDiary table & food management system.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
