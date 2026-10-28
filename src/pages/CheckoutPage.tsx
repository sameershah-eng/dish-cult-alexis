import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

type CheckoutStep = 'details' | 'delivery' | 'payment' | 'success';

export const CheckoutPage: React.FC = () => {
  const { items, getSubtotal, getServiceFee, getDiscountAmount, getTotal, clearCart } =
    useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>('details');
  const [orderNumber, setOrderNumber] = useState('');

  // Form Fields
  const [name, setName] = useState('Eleanor Vance');
  const [email, setEmail] = useState('eleanor.vance@example.com');
  const [phone, setPhone] = useState('+44 7700 900123');

  const [fulfillmentType, setFulfillmentType] = useState<'collection' | 'delivery'>('delivery');
  const [address, setAddress] = useState('42 Royal Exchange Square');
  const [postcode, setPostcode] = useState('G1 3AH');
  const [city, setCity] = useState('Glasgow');
  const [instructions, setInstructions] = useState('Leave with concierge if not in.');

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else if (step === 'payment') {
      const generatedOrder = `DC-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setStep('success');

      // Trigger brand colour confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E5173F', '#FF5A36', '#F7B733', '#FFFFFF'],
        });
      } catch (e) {
        // Safe fallback
      }

      clearCart();
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-ink pt-32 pb-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-smoke flex items-center justify-center text-muted mb-4">
          <ShoppingBag className="w-8 h-8 opacity-60" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-cream">Your cart is empty</h2>
        <p className="text-xs text-muted max-w-sm mt-1 mb-6 leading-relaxed">
          Select signature dishes, tasting experiences or gift passes to proceed through checkout.
        </p>
        <Link
          to="/explore"
          className="px-6 py-2.5 rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-lg"
        >
          Explore menus
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {step !== 'success' && (
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold text-brand tracking-widest uppercase">
              Secure Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream mt-1">
              Complete your reservation & order
            </h1>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center justify-center gap-3 mt-6 max-w-sm mx-auto">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  step === 'details'
                    ? 'bg-brand text-white'
                    : 'bg-smoke text-cream border border-smoke/80'
                }`}
              >
                1. Diner Details
              </span>
              <span className="w-4 h-[1px] bg-smoke" />
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  step === 'delivery'
                    ? 'bg-brand text-white'
                    : 'bg-smoke text-cream border border-smoke/80'
                }`}
              >
                2. Fulfillment
              </span>
              <span className="w-4 h-[1px] bg-smoke" />
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  step === 'payment'
                    ? 'bg-brand text-white'
                    : 'bg-smoke text-cream border border-smoke/80'
                }`}
              >
                3. Payment
              </span>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-3xl bg-coal border border-smoke/80 text-center space-y-6 shadow-2xl max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                Payment & Order Confirmed
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-cream mt-1">
                Thank you, {name.split(' ')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2">
                Order confirmation has been sent to <span className="text-cream font-medium">{email}</span>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 rounded-2xl bg-smoke/40 border border-smoke/70 text-left space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-smoke/60">
                <span className="text-muted">Order Reference</span>
                <span className="font-mono font-bold text-cream">{orderNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-smoke/60">
                <span className="text-muted">Fulfillment Method</span>
                <span className="text-cream capitalize">{fulfillmentType}</span>
              </div>
              {fulfillmentType === 'delivery' && (
                <div className="flex justify-between pb-2 border-b border-smoke/60">
                  <span className="text-muted">Delivery Address</span>
                  <span className="text-cream text-right">{address}, {postcode}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-cream pt-1">
                <span>Total Paid</span>
                <span className="text-brand tabular-nums">{formatGBP(total)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 py-3.5 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-lg text-center"
              >
                Back to Dish Cult Home
              </Link>
              <Link
                to="/explore"
                className="flex-1 py-3.5 rounded-full bg-smoke hover:bg-smoke/80 text-xs font-semibold text-cream border border-smoke/80 text-center"
              >
                Book Another Table
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Multi-Step Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleNextStep} className="p-6 sm:p-8 rounded-3xl bg-coal border border-smoke/80 shadow-2xl space-y-6">
                {step === 'details' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-cream mb-4">
                      Diner Contact Details
                    </h3>
                    <div>
                      <label className="text-xs font-semibold text-muted block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted block mb-1">Email Address (for booking voucher)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted block mb-1">Mobile Phone (for SMS updates)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                )}

                {step === 'delivery' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-cream mb-4">
                      Fulfillment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('delivery')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors flex items-center gap-2 ${
                          fulfillmentType === 'delivery'
                            ? 'bg-smoke border-brand text-cream'
                            : 'bg-coal border-smoke text-muted'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-brand" />
                        <span>Doorstep Delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('collection')}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors flex items-center gap-2 ${
                          fulfillmentType === 'collection'
                            ? 'bg-smoke border-brand text-cream'
                            : 'bg-coal border-smoke text-muted'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4 text-saffron" />
                        <span>Venue Collection</span>
                      </button>
                    </div>

                    {fulfillmentType === 'delivery' ? (
                      <>
                        <div>
                          <label className="text-xs font-semibold text-muted block mb-1">Street Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-muted block mb-1">City</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-muted block mb-1">Postcode</label>
                            <input
                              type="text"
                              value={postcode}
                              onChange={(e) => setPostcode(e.target.value)}
                              required
                              className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted block mb-1">Delivery Notes (Optional)</label>
                          <input
                            type="text"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="p-4 rounded-xl bg-smoke/40 text-xs text-muted leading-relaxed">
                        Your order will be packaged fresh for kitchen collection. Present your digital ticket upon arrival at the venue host station.
                      </div>
                    )}
                  </div>
                )}

                {step === 'payment' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg font-bold text-cream">
                        Payment Information
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-muted">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>256-Bit SSL Encrypted</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-coal to-smoke border border-smoke/80 space-y-3">
                      <div className="flex justify-between items-center text-xs text-cream">
                        <span className="font-bold">Credit / Debit Card</span>
                        <div className="flex gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-smoke text-[9px] font-mono">VISA</span>
                          <span className="px-1.5 py-0.5 rounded bg-smoke text-[9px] font-mono">MC</span>
                          <span className="px-1.5 py-0.5 rounded bg-smoke text-[9px] font-mono">AMEX</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-ink border border-smoke/80 text-xs text-cream font-mono outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">Expires</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-ink border border-smoke/80 text-xs text-cream font-mono outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-muted uppercase tracking-wider block mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-ink border border-smoke/80 text-xs text-cream font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted">
                      <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                      <span>Zero fraud liability guarantee backed by ResDiary Merchant Gateway.</span>
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-between gap-3 border-t border-smoke">
                  {step !== 'details' ? (
                    <button
                      type="button"
                      onClick={() => setStep(step === 'payment' ? 'delivery' : 'details')}
                      className="px-4 py-2.5 rounded-xl bg-smoke hover:bg-smoke/80 text-xs font-semibold text-cream flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  <button
                    type="submit"
                    className="px-7 py-3 rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-95 transition-all flex items-center gap-2 ml-auto"
                  >
                    <span>{step === 'payment' ? `Pay ${formatGBP(total)}` : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-coal border border-smoke/80 shadow-2xl space-y-4">
              <h3 className="font-serif text-base font-bold text-cream pb-3 border-b border-smoke">
                Order Summary ({items.length} items)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img src={item.image} alt={item.title} className="w-9 h-9 rounded-lg object-cover shrink-0 bg-smoke" />
                      <div className="truncate">
                        <span className="font-semibold text-cream block truncate">{item.title}</span>
                        <span className="text-[10px] text-muted block truncate">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono text-cream tabular-nums shrink-0">
                      {formatGBP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-smoke/70 space-y-2 text-xs text-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-cream tabular-nums">{formatGBP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service charge (10%)</span>
                  <span className="text-cream tabular-nums">{formatGBP(serviceFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="tabular-nums">-{formatGBP(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-cream pt-2 border-t border-smoke/70">
                  <span>Total Due</span>
                  <span className="text-brand tabular-nums">{formatGBP(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
