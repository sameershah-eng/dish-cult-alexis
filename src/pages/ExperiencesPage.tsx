import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, Clock, Sparkles, Plus, Check, Heart, ArrowRight } from 'lucide-react';
import { EXPERIENCES_DATA } from '../data/experiences';
import { GIFT_CARDS_DATA } from '../data/giftCards';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { SmartImage } from '../components/ui/SmartImage';

export const ExperiencesPage: React.FC = () => {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  // Gift card customization
  const [selectedCardId, setSelectedCardId] = useState(GIFT_CARDS_DATA[0].id);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleAddExperience = (exp: any) => {
    addItem({
      id: `exp-${exp.id}`,
      originalId: exp.id,
      type: 'experience',
      title: exp.title,
      subtitle: `${exp.restaurantName} · ${exp.city}`,
      price: exp.pricePerPerson,
      image: exp.image,
    });
    addToast({
      title: 'Experience added to cart',
      description: `${exp.title} (${formatGBP(exp.pricePerPerson)})`,
      type: 'success',
    });
  };

  const handleAddGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!activeAmount || activeAmount < 10) {
      addToast({
        title: 'Please choose an amount of at least £10',
        type: 'error',
      });
      return;
    }

    const card = GIFT_CARDS_DATA.find((g) => g.id === selectedCardId) || GIFT_CARDS_DATA[0];

    addItem({
      id: `gift-${card.id}-${activeAmount}-${Date.now()}`,
      originalId: card.id,
      type: 'giftcard',
      title: `${card.title} - ${formatGBP(activeAmount)}`,
      subtitle: recipientName ? `Gift for ${recipientName}` : 'Digital Dining Pass',
      price: activeAmount,
      image: card.image,
      metadata: {
        giftRecipient: recipientName,
        giftMessage: giftMessage,
      },
    });

    addToast({
      title: 'Gift Card added to cart',
      description: `${formatGBP(activeAmount)} pass added.`,
      type: 'success',
    });

    setRecipientName('');
    setGiftMessage('');
  };

  return (
    <div className="min-h-screen bg-ink pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-brand tracking-widest uppercase">
            Curated Hospitality
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-cream tracking-tight mt-1">
            Experiences & Gift Passes
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
            From chef's tables and rare cellar tastings to universal dining gift cards redeemable at thousands of partner venues.
          </p>
        </div>

        {/* Section 1: Culinary Experiences Grid */}
        <div className="space-y-6 mb-24">
          <div className="flex items-center justify-between pb-4 border-b border-smoke">
            <h2 className="font-serif text-2xl font-bold text-cream">
              Bookable Experiences
            </h2>
            <span className="text-xs text-muted">
              {EXPERIENCES_DATA.length} exclusive packages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {EXPERIENCES_DATA.map((exp) => (
              <div
                key={exp.id}
                className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-coal">
                  <SmartImage
                    src={exp.image}
                    slug={exp.slug}
                    alt={exp.title}
                    aspectRatio="16/9"
                    width={700}
                    className="group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-ink/85 backdrop-blur-md border border-smoke/70 text-[10px] font-semibold text-saffron uppercase tracking-wider">
                    {exp.type}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted mb-2">
                      <span className="text-cream font-medium">{exp.restaurantName}</span>
                      <span>·</span>
                      <span>{exp.city}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-ember" />
                        <span>{exp.duration}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-cream group-hover:text-ember transition-colors leading-snug">
                      {exp.title}
                    </h3>

                    <p className="text-xs text-muted leading-relaxed mt-2.5">
                      {exp.description}
                    </p>

                    <ul className="mt-4 space-y-1.5 border-t border-smoke/50 pt-3">
                      {exp.inclusions.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                          <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-smoke/60">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted block">From</span>
                      <span className="text-base font-bold text-cream tabular-nums">
                        {formatGBP(exp.pricePerPerson)}
                        <span className="text-xs font-normal text-muted"> / guest</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddExperience(exp)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand hover:bg-ember text-white text-xs font-semibold shadow-md shadow-brand/20 transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Dish Cult Dining Gift Cards */}
        <div id="gift-cards" className="pt-10 border-t border-smoke/70">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold text-brand tracking-widest uppercase">
              The Perfect Foodie Gift
            </span>
            <h2 className="font-serif text-3xl font-bold text-cream mt-1">
              Dish Cult Dining Passes
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Instant digital gift cards redeemable across thousands of ResDiary partner tables, wine bars, and tasting rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
            {/* Gift Card Visual */}
            <div className="lg:col-span-5 space-y-4">
              <div className="aspect-[1.6/1] rounded-3xl p-6 bg-gradient-to-br from-coal via-smoke to-coal border border-smoke/90 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gradient opacity-20 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="font-serif text-xl font-bold text-cream">Dish Cult Pass</span>
                  <Gift className="w-5 h-5 text-brand" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-wider text-muted block">Gift Value</span>
                  <span className="font-serif text-4xl font-extrabold text-cream tabular-nums">
                    {formatGBP(customAmount ? parseFloat(customAmount) || 0 : selectedAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted relative z-10 pt-2 border-t border-smoke/50">
                  <span>{recipientName ? `For: ${recipientName}` : 'Universal Pass'}</span>
                  <span>Powered by ResDiary</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {GIFT_CARDS_DATA.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-2 rounded-xl text-left border text-xs transition-colors ${
                      selectedCardId === card.id
                        ? 'bg-smoke border-brand text-cream'
                        : 'bg-coal border-smoke/70 text-muted hover:border-smoke'
                    }`}
                  >
                    <span className="block font-semibold truncate">{card.title.replace('The Dish Cult ', '')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Card Config Form */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-coal border border-smoke/80 shadow-2xl space-y-6">
              <form onSubmit={handleAddGiftCard} className="space-y-5">
                {/* Amount Chips */}
                <div>
                  <label className="text-xs font-semibold text-muted block mb-2">
                    Select Gift Amount (GBP)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 150].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all ${
                          selectedAmount === amt && !customAmount
                            ? 'bg-brand text-white shadow-md'
                            : 'bg-smoke/60 text-cream hover:bg-smoke border border-smoke/70'
                        }`}
                      >
                        £{amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount Input */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted">Or custom:</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted font-bold">£</span>
                      <input
                        type="number"
                        min="10"
                        max="1000"
                        placeholder="Amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-smoke border border-smoke/80 text-xs font-semibold text-cream outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1.5">
                    Recipient Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream placeholder-muted outline-none focus:border-brand"
                  />
                </div>

                {/* Personal Message */}
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1.5">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A celebratory table on us! Happy anniversary…"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream placeholder-muted outline-none focus:border-brand resize-none"
                  />
                </div>

                {/* Add to Cart Submit */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-brand-gradient text-xs sm:text-sm font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>
                    Add {formatGBP(customAmount ? parseFloat(customAmount) || 0 : selectedAmount)} Pass to Cart
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
