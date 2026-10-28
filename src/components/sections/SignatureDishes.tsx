import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Check, Utensils, Sparkles } from 'lucide-react';
import { DISHES_DATA } from '../../data/dishes';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { SmartImage } from '../ui/SmartImage';

type CategoryFilter = 'all' | 'starters' | 'mains' | 'desserts' | 'drinks';

export const SignatureDishes: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const { items, addItem, updateQuantity } = useCartStore();
  const { addToast } = useToastStore();
  const [animatingDishId, setAnimatingDishId] = useState<string | null>(null);

  const filteredDishes =
    filter === 'all'
      ? DISHES_DATA
      : DISHES_DATA.filter((dish) => dish.category === filter);

  const formatGBP = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const handleAddDish = (dish: any) => {
    setAnimatingDishId(dish.id);
    setTimeout(() => setAnimatingDishId(null), 800);

    addItem({
      id: `dish-${dish.id}`,
      originalId: dish.id,
      type: 'dish',
      title: dish.name,
      subtitle: `From ${dish.restaurantName}`,
      price: dish.price,
      image: dish.image,
      metadata: { dietary: dish.dietary },
    });

    addToast({
      title: 'Added to your order',
      description: `${dish.name} (${formatGBP(dish.price)})`,
      type: 'success',
    });
  };

  return (
    <section className="py-20 bg-ink relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Category Filter Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand tracking-widest uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Partner Delivery & Collection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight">
              Order the signature dishes
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-lg">
              Legendary courses created by our celebrated partner chefs, delivered hot to your door or prepared for table collection.
            </p>
          </div>

          {/* Interactive filter tabs (clean segmented buttons per design constitution) */}
          <div className="flex items-center gap-1 p-1 bg-coal rounded-xl border border-smoke overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'starters', label: 'Starters' },
              { id: 'mains', label: 'Mains' },
              { id: 'desserts', label: 'Desserts' },
              { id: 'drinks', label: 'Cocktails & Wine' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as CategoryFilter)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-muted hover:text-cream hover:bg-smoke/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => {
              const cartItem = items.find((i) => i.id === `dish-${dish.id}`);
              const quantity = cartItem?.quantity || 0;

              return (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-smoke hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-coal">
                    <SmartImage
                      src={dish.image}
                      slug={dish.slug}
                      alt={dish.name}
                      aspectRatio="16/9"
                      width={600}
                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Dietary Tags (unboxed or subtle text overlay) */}
                    {dish.dietary.length > 0 && (
                      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                        {dish.dietary.map((d) => (
                          <span
                            key={d}
                            className="px-2 py-0.5 rounded-md bg-ink/80 backdrop-blur-md text-[10px] font-bold text-saffron border border-smoke/60"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-cream group-hover:text-ember transition-colors leading-snug">
                          {dish.name}
                        </h3>
                        <span className="text-sm font-bold text-cream tabular-nums shrink-0 font-mono">
                          {formatGBP(dish.price)}
                        </span>
                      </div>

                      {/* Restaurant Kicker Link */}
                      <Link
                        to={`/restaurant/${dish.restaurantSlug}`}
                        className="inline-block text-xs font-medium text-brand hover:underline mt-1"
                      >
                        from {dish.restaurantName}
                      </Link>

                      <p className="text-xs text-muted leading-relaxed mt-2.5 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-smoke/60">
                      <div className="text-[11px] text-muted flex items-center gap-2">
                        <span>Partner kitchen fresh</span>
                      </div>

                      {/* Add Button or Quantity Stepper */}
                      {quantity > 0 ? (
                        <div className="flex items-center gap-2 bg-smoke/80 rounded-full border border-smoke p-1">
                          <button
                            onClick={() => updateQuantity(`dish-${dish.id}`, -1)}
                            className="w-6 h-6 rounded-full bg-coal hover:bg-smoke text-cream flex items-center justify-center transition-colors"
                            aria-label={`Reduce ${dish.name} quantity`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold text-cream tabular-nums px-1.5">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(`dish-${dish.id}`, 1)}
                            className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center hover:bg-ember transition-colors"
                            aria-label={`Increase ${dish.name} quantity`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddDish(dish)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-smoke hover:bg-brand text-cream hover:text-white border border-smoke hover:border-brand text-xs font-semibold transition-all active:scale-95 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to order</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
