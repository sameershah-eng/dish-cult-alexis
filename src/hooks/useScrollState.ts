import { useState, useEffect } from 'react';

export interface ScrollState {
  isScrolled: boolean;
  scrollY: number;
  progress: number;
  navTheme: 'dark' | 'light';
  showBottomBar: boolean;
}

export function useScrollState(): ScrollState {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark');
  const [showBottomBar, setShowBottomBar] = useState(false);

  // Throttled scroll listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;

      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY >= 24);
      setShowBottomBar(currentScrollY > 380);

      if (totalScroll > 0) {
        setProgress(Math.min(100, Math.max(0, (currentScrollY / totalScroll) * 100)));
      } else {
        setProgress(0);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for detecting light sections (data-nav-theme="light")
  useEffect(() => {
    const lightSections = document.querySelectorAll('[data-nav-theme="light"]');
    if (!lightSections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isOverLight = entries.some(
          (entry) => entry.isIntersecting && entry.boundingClientRect.top <= 90 && entry.boundingClientRect.bottom >= 20
        );
        setNavTheme(isOverLight ? 'light' : 'dark');
      },
      {
        rootMargin: '0px 0px -85% 0px',
        threshold: [0, 0.1, 0.5],
      }
    );

    lightSections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return { isScrolled, scrollY, progress, navTheme, showBottomBar };
}
