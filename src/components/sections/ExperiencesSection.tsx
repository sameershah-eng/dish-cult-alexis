import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, Plus, ArrowRight, Sparkles, Check } from 'lucide-react';
import { EXPERIENCES_DATA } from '../../data/experiences';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { SmartImage } from '../ui/SmartImage';

export const ExperiencesSection: React.FC = () => {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

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
      description: `${exp.title} (${formatGBP(exp.pricePerPerson)} per person)`,
      type: 'success',
    });
  };

  return (
    <section className="py-20 bg-coal/50 border-t border-smoke/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand tracking-widest uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Unforgettable Evenings</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cream tracking-tight">
              Culinary Experiences
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-lg">
              Chef’s tables, rare vintage wine pairings, and coastal masterclasses curated exclusively for Dish Cult diners.
            </p>
          </div>

          <Link
            to="/experiences"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cream hover:text-ember transition-colors"
          >
            <span>View all experiences & gift cards</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EXPERIENCES_DATA.slice(0, 3).map((exp, idx) => (
            <motion.div
              key={exp.id}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 25 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl bg-coal border border-smoke/80 overflow-hidden shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image with type label */}
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

              {/* Body */}
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

                  {/* Bullet inclusions */}
                  <ul className="mt-4 space-y-1.5 border-t border-smoke/50 pt-3">
                    {exp.inclusions.slice(0, 2).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-muted">
                        <Check className="w-3 h-3 text-brand shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-5 mt-5 border-t border-smoke/60">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted block">Price</span>
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
                    <span>Book Experience</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
