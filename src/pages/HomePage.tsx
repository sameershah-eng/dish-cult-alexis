import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { CuisineMarquee } from '../components/sections/CuisineMarquee';
import { TrendingRail } from '../components/sections/TrendingRail';
import { CitiesBento } from '../components/sections/CitiesBento';
import { SignatureDishes } from '../components/sections/SignatureDishes';
import { ExperiencesSection } from '../components/sections/ExperiencesSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { StatsBand } from '../components/sections/StatsBand';
import { ReviewsCarousel } from '../components/sections/ReviewsCarousel';
import { AppDownloadSection } from '../components/sections/AppDownloadSection';
import { ForRestaurantsCTA } from '../components/sections/ForRestaurantsCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink">
      <HeroSection />
      <CuisineMarquee />
      <TrendingRail />
      <CitiesBento />
      <SignatureDishes />
      <ExperiencesSection />
      <HowItWorksSection />
      <StatsBand />
      <ReviewsCarousel />
      <AppDownloadSection />
      <ForRestaurantsCTA />
    </div>
  );
};
