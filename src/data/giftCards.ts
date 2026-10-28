import { GiftCard } from '../types';

export const GIFT_CARDS_DATA: GiftCard[] = [
  {
    id: 'dc-dining-pass',
    title: 'The Dish Cult Dining Passport',
    amounts: [25, 50, 100, 150, 200],
    description: 'Redeemable across thousands of partner restaurants and experiences across the UK, Ireland, Australia and beyond. Delivered instantly via digital pass or gift envelope.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dc-sommelier-pass',
    title: 'Dish Cult Cellar & Pairing Card',
    amounts: [50, 100, 150, 250],
    description: 'Curated specifically for wine lovers and cocktail connoisseurs. Redeemable on reserve pairings, tasting flights, and sommelier dinners.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dc-chef-pass',
    title: 'Michelin & Fine Dining Experience Pass',
    amounts: [100, 200, 300, 500],
    description: 'Unlock priority chef tables, private dining rooms, and multi-course gastronomic menus at award-winning venues.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
  },
];
