import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../components/ui/Logo';
import { ShieldCheck, MapPin, Heart, Users, Globe2, Sparkles, Check } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export const AboutPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setUserLoggedIn(true);
    addToast({
      title: activeTab === 'signin' ? 'Welcome back to Dish Cult' : 'Account created',
      description: `Signed in as ${email}`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-ink pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coal border border-smoke text-xs font-semibold text-brand mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Story of Dish Cult</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-cream tracking-tight">
            Connecting diners with the culinary moments that matter.
          </h1>
          <p className="text-xs sm:text-base text-muted mt-4 leading-relaxed">
            Born from ResDiary's hospitality heritage in Glasgow, Dish Cult is the premier discovery and booking platform built to celebrate independent restaurants and make table reservations effortless.
          </p>
        </div>

        {/* Narrative & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream">
              Hospitality first, always.
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              For over two decades, ResDiary has engineered the table management backbones of Michelin-starred dining rooms, neighbourhood bistros, and iconic waterfront taverns across 24 countries.
            </p>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Dish Cult was founded with an unshakeable ethos: diner discovery should never penalise the kitchen. Unlike platforms that charge crushing cover fees, Dish Cult is zero-commission for operators, protecting the vitality of independent gastronomy.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-coal border border-smoke/70">
                <span className="font-serif text-2xl font-bold text-brand">4,800+</span>
                <p className="text-xs text-muted mt-1">Independent venues</p>
              </div>
              <div className="p-4 rounded-xl bg-coal border border-smoke/70">
                <span className="font-serif text-2xl font-bold text-saffron">£0</span>
                <p className="text-xs text-muted mt-1">Cover booking fee</p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-coal border border-smoke/80 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6">
              <Globe2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-cream mb-4">Our Regional Hubs</h3>
            <ul className="space-y-3.5 text-xs text-muted">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <span><strong className="text-cream">Glasgow:</strong> ResDiary Global Headquarters, 38 Queen Street</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-ember shrink-0" />
                <span><strong className="text-cream">London:</strong> Access Hospitality Hub, Farringdon</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-saffron shrink-0" />
                <span><strong className="text-cream">Dublin:</strong> Irish Hospitality Bureau, Grand Canal Dock</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong className="text-cream">Melbourne:</strong> Asia-Pacific Operations, Collins Street</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Member Sign In / Register Section */}
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-coal border border-smoke/80 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Logo size={48} glow={true} />
          </div>

          {userLoggedIn ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">Signed In as Diner</h3>
              <p className="text-xs text-muted">{email}</p>
              <button
                onClick={() => setUserLoggedIn(false)}
                className="px-6 py-2 rounded-full bg-smoke text-xs font-semibold text-cream hover:bg-smoke/80 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1 bg-smoke rounded-xl mb-6">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'signin' ? 'bg-coal text-brand shadow-sm' : 'text-muted'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'register' ? 'bg-coal text-brand shadow-sm' : 'text-muted'
                  }`}
                >
                  Create account
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="diner@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted block mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-smoke border border-smoke/80 text-xs text-cream outline-none focus:border-brand"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-brand-gradient text-xs font-bold text-white shadow-lg active:scale-98 transition-all mt-2"
                >
                  {activeTab === 'signin' ? 'Sign in to Dish Cult' : 'Register Diner Account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
