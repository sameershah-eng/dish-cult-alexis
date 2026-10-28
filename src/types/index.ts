export type PriceBand = '£' | '££' | '£££' | '££££';

export interface PhotoAttribution {
  url?: string;
  name?: string; // Places photo resource name (e.g. places/.../photos/...)
  width?: number;
  height?: number;
  authorName?: string;
  authorUri?: string;
}

export interface ReviewBreakdown {
  food: number;
  service: number;
  atmosphere: number;
  value: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  date: string;
  text: string;
  restaurantName: string;
  city: string;
  breakdown?: ReviewBreakdown;
}

export interface RestaurantFeatures {
  allowsDogs?: boolean;
  disabledAccess?: boolean;
  freeWifi?: boolean;
  outdoorSeating?: boolean;
  goodForGroups?: boolean;
  servesBreakfast?: boolean;
  servesBrunch?: boolean;
  servesVegetarianFood?: boolean;
  romanticAtmosphere?: boolean;
  scenicView?: boolean;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  cuisine: string;
  neighbourhood: string;
  city: string;
  rating: number;
  reviewCount: number;
  priceBand: PriceBand;
  priceLevelNumeric: number;
  address: string;
  location: { lat: number; lng: number };
  phone?: string;
  website?: string;
  mapsUrl?: string;
  nextAvailableTime: string;
  hours: string[];
  features: RestaurantFeatures;
  description: string;
  photos: PhotoAttribution[];
  source?: 'google' | 'mock';
  reviews?: Review[];
  featuredDishIds?: string[];
}

export interface Dish {
  id: string;
  slug: string;
  name: string;
  restaurantName: string;
  restaurantSlug: string;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  description: string;
  price: number;
  dietary: ('V' | 'VG' | 'GF')[];
  image: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  type: "Chef's Table" | "Afternoon Tea" | "Wine Pairing" | "Bottomless Brunch" | "Tasting Menu";
  restaurantName: string;
  restaurantSlug: string;
  city: string;
  pricePerPerson: number;
  duration: string;
  description: string;
  inclusions: string[];
  image: string;
}

export interface GiftCard {
  id: string;
  title: string;
  amounts: number[];
  description: string;
  image: string;
}

export interface CityInfo {
  id: string;
  slug: string;
  name: string;
  country: string;
  restaurantCount: number;
  image: string;
  tagline: string;
  lat: number;
  lng: number;
}

export type CartItemType = 'dish' | 'experience' | 'giftcard';

export interface CartItem {
  id: string; // unique item cart key (e.g. dish-1 or giftcard-50)
  originalId: string;
  type: CartItemType;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
  metadata?: {
    dietary?: string[];
    giftRecipient?: string;
    giftMessage?: string;
    experienceDate?: string;
    experienceGuests?: number;
  };
}

export interface BookingState {
  restaurantId: string;
  restaurantName: string;
  guests: number;
  date: string;
  time: string;
  seatingArea?: string;
}
