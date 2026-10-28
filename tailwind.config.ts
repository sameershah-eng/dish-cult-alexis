import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0D',
        coal: '#141417',
        smoke: '#1E1E23',
        cream: '#F6F1EA',
        muted: '#A8A29E',
        brand: '#E5173F',
        ember: '#FF5A36',
        saffron: '#F7B733',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #E5173F 0%, #FF5A36 55%, #F7B733 100%)',
        'ember-radial': 'radial-gradient(ellipse at 50% 0%, rgba(229, 23, 63, 0.18) 0%, rgba(255, 90, 54, 0.08) 45%, transparent 75%)',
      },
    },
  },
  plugins: [],
};

export default config;
