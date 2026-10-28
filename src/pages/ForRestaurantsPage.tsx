import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Utensils, TrendingUp, ShieldCheck, DollarSign, Check, Users, ArrowRight } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export const ForRestaurantsPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [coversPerMonth, setCoversPerMonth] = useState(1200);
  const [avgSpend, setAvgSpend] = useState(45);

  const [restaurantName, setRestaurantName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Glasgow');
  const [submitted, setSubmitted] = useState(false);

  // Traditional 3rd-party aggregators take £1.50 - £2.00 per cover
  const traditionalFees = coversPerMonth * 1.75;
  const dishCultFlatFee = 89; // flat monthly ResDiary software fee
  const annualSavings = (traditionalFees - dishCultFlatFee) * 12;

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName || !email) {
      addToast({ title: 'Please provide venue name and contact email', type: 'error' });
      return;
    }
    setSubmitted(true);
    addToast({
      title: 'Partner Application Received',
      description: 'Our UK & Ireland hospitality team will connect within 24 hours.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-ink pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">
            Powered by ResDiary
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-cream tracking-tight mt-1">
            Fill every table. Keep every penny of profit.
          </h1>
          <p className="text-xs sm:text-base text-muted mt-3 leading-relaxed">
            Dish Cult connects your venue directly to high-intent diners. Unlike predatory booking portals that tax every seated guest, we operate on zero cover commissions.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-coal border border-smoke/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-cream">Zero Cover Commission</h3>
            <p className="text-xs text-muted leading-relaxed">
              Never pay £2.00 per diner. Every table booked on Dish Cult is 100% commission-free, saving average bistros over £18,000 annually.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-coal border border-smoke/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-ember/10 border border-ember/20 flex items-center justify-center text-ember">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-cream">Live Kitchen Table Sync</h3>
            <p className="text-xs text-muted leading-relaxed">
              Direct two-way synchronization into your ResDiary Electronic Reservation Book (ERB), POS systems, and kitchen management tables.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-coal border border-smoke/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-cream">Own Your Diner Data</h3>
            <p className="text-xs text-muted leading-relaxed">
              Build your own loyalty list. Guest contacts, culinary preferences, and anniversary dates belong strictly to your venue, never resold.
            </p>
          </div>
        </div>

        {/* Commission Savings Calculator */}
        <div className="p-8 sm:p-12 rounded-3xl bg-coal border border-smoke/80 mb-20 shadow-2xl">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <span className="text-xs font-semibold text-brand tracking-widest uppercase">
              Financial Transparency
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream mt-1">
              Calculate your annual commission savings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-cream mb-2">
                  <span>Monthly Online Covers</span>
                  <span className="font-mono text-brand font-bold">{coversPerMonth} diners</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="4000"
                  step="50"
                  value={coversPerMonth}
                  onChange={(e) => setCoversPerMonth(parseInt(e.target.value))}
                  className="w-full accent-brand cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-cream mb-2">
                  <span>Average Spend per Guest</span>
                  <span className="font-mono text-saffron font-bold">£{avgSpend}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={avgSpend}
                  onChange={(e) => setAvgSpend(parseInt(e.target.value))}
                  className="w-full accent-saffron cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-smoke/60 border border-smoke text-center space-y-3">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Estimated Annual Savings vs Other Portals
              </span>
              <p className="font-serif text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-brand-gradient tabular-nums">
                {formatGBP(annualSavings)}
              </p>
              <p className="text-[11px] text-muted max-w-xs mx-auto">
                Based on standard £1.75/cover aggregator fees vs flat ResDiary software plan.
              </p>
            </div>
          </div>
        </div>

        {/* Partner Onboarding Form */}
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-coal border border-smoke/80 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl font-bold text-cream">
              List your restaurant on Dish Cult
            </h3>
            <p className="text-xs text-muted mt-1">
              Join over 4,800 leading culinary venues across the globe.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
              <Check className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-cream">Application Received</h4>
              <p className="text-xs text-muted leading-relaxed">
                Thank you for applying to list {restaurantName}. A ResDiary regional account manager will be in touch shortly with your verification package.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Restaurant / Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g. The Cellar Bar & Bistro"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Primary Contact Name</label>
                <input
                  type="text"
                  placeholder="e.g. Gordon Mackay"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="gordon@thecellar.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted block mb-1">City / Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none cursor-pointer"
                >
                  <option value="Glasgow">Glasgow, Scotland</option>
                  <option value="London">London, England</option>
                  <option value="Dublin">Dublin, Ireland</option>
                  <option value="Liverpool">Liverpool, England</option>
                  <option value="Manchester">Manchester, England</option>
                  <option value="Edinburgh">Edinburgh, Scotland</option>
                  <option value="Sydney">Sydney, Australia</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-95 transition-all mt-2"
              >
                Submit Operator Application
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
