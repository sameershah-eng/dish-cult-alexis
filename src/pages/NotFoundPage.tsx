import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <Logo size={90} glow={true} />
      </div>

      <span className="text-xs font-semibold text-brand uppercase tracking-widest">
        404 · Table Not Located
      </span>

      <h1 className="font-serif text-4xl sm:text-6xl font-black text-cream tracking-tight mt-2 max-w-lg leading-tight">
        Looks like this table has been cleared.
      </h1>

      <p className="text-xs sm:text-sm text-muted max-w-md mt-3 mb-8 leading-relaxed">
        The page or venue you are looking for might have changed its seating schedule, or the address entered is no longer valid.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="px-8 py-3 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-xl shadow-brand/30 hover:shadow-brand/50 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to the table</span>
        </Link>
        <Link
          to="/explore"
          className="px-6 py-3 rounded-full bg-smoke hover:bg-smoke/80 text-xs font-semibold text-cream border border-smoke transition-colors inline-flex items-center justify-center gap-2"
        >
          <Compass className="w-4 h-4 text-muted" />
          <span>Browse all restaurants</span>
        </Link>
      </div>
    </div>
  );
};
