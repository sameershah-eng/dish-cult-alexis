import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { CitiesMegaMenu, ExperiencesDropdown } from './MegaMenu';

interface NavLinksProps {
  navTheme?: 'dark' | 'light';
}

export const NavLinks: React.FC<NavLinksProps> = ({ navTheme = 'dark' }) => {
  const location = useLocation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<'cities' | 'experiences' | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const links = [
    { label: 'Explore', href: '/explore', hasMenu: false },
    { label: 'Cities', href: '/explore#cities', hasMenu: true, menuKey: 'cities' as const },
    { label: 'Experiences', href: '/experiences', hasMenu: true, menuKey: 'experiences' as const },
    { label: 'Gift Cards', href: '/experiences#gift-cards', hasMenu: false },
    { label: 'For Restaurants', href: '/for-restaurants', hasMenu: false },
  ];

  const handleMouseEnter = (idx: number, menuKey?: 'cities' | 'experiences') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredIdx(idx);
    if (menuKey) {
      timeoutRef.current = setTimeout(() => {
        setActiveMenu(menuKey);
      }, 120);
    } else {
      setActiveMenu(null);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredIdx(null);
      setActiveMenu(null);
    }, 180);
  };

  const isLight = navTheme === 'light';

  return (
    <nav
      aria-label="Main navigation"
      className="relative flex items-center gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {links.map((link, idx) => {
        const isHovered = hoveredIdx === idx;
        const isActive =
          location.pathname === link.href ||
          (link.href.includes('#') &&
            location.pathname === link.href.split('#')[0] &&
            location.hash === `#${link.href.split('#')[1]}`);

        return (
          <div
            key={link.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(idx, link.menuKey)}
          >
            <Link
              to={link.href}
              className={`relative z-10 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isLight
                  ? isActive
                    ? 'text-brand font-semibold'
                    : 'text-ink/80 hover:text-ink'
                  : isActive
                  ? 'text-cream font-semibold'
                  : 'text-cream/80 hover:text-cream'
              }`}
              aria-expanded={link.hasMenu ? activeMenu === link.menuKey : undefined}
              aria-haspopup={link.hasMenu ? 'true' : undefined}
            >
              <span className={isActive ? 'text-gradient font-semibold' : ''}>
                {link.label}
              </span>
              {link.hasMenu && (
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeMenu === link.menuKey ? 'rotate-180 text-brand' : 'opacity-60'
                  }`}
                />
              )}

              {/* Active Route Dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-gradient"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
            </Link>

            {/* Sliding Glass Hover Pill (Framer Motion layoutId) */}
            {isHovered && (
              <motion.div
                layoutId="nav-pill-hover"
                className={`absolute inset-0 rounded-full pointer-events-none ${
                  isLight
                    ? 'bg-coal/10 border border-coal/20 shadow-sm'
                    : 'bg-white/10 backdrop-blur-md border border-white/15 shadow-sm'
                }`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
          </div>
        );
      })}

      {/* Mega Menu Dropdowns */}
      <AnimatePresence>
        {activeMenu === 'cities' && (
          <div onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}>
            <CitiesMegaMenu onClose={() => setActiveMenu(null)} />
          </div>
        )}
        {activeMenu === 'experiences' && (
          <div onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}>
            <ExperiencesDropdown onClose={() => setActiveMenu(null)} />
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
