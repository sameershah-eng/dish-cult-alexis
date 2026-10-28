import React from 'react';
import { useNavigate } from 'react-router-dom';

const CUISINES = [
  'Italian',
  'Sushi & Raw Bar',
  'Steakhouse',
  'Artisanal Brunch',
  'Spanish Tapas',
  'Pakistani & Indian',
  'Seafood & Oysters',
  'French Bistro',
  'Wood-Fired Grill',
  'Nordic Tasting',
  'Craft Cocktails',
  'Natural Wine',
];

export const CuisineMarquee: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative py-8 bg-coal/70 border-y border-smoke overflow-hidden group select-none">
      {/* Edge gradient masks */}
      <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none" />

      {/* Marquee Track with CSS animation and pause-on-hover */}
      <div className="flex w-max animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[...CUISINES, ...CUISINES].map((cuisine, index) => (
          <button
            key={`${cuisine}-${index}`}
            onClick={() => navigate(`/explore?cuisine=${encodeURIComponent(cuisine)}`)}
            className="flex items-center gap-6 px-4 text-left group/item cursor-pointer"
          >
            <span
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent transition-all duration-300 hover:text-cream"
              style={{
                WebkitTextStroke: '1px rgba(246, 241, 234, 0.28)',
              }}
            >
              {cuisine}
            </span>
            <span className="text-brand text-xl sm:text-2xl font-serif">·</span>
          </button>
        ))}
      </div>
    </div>
  );
};
