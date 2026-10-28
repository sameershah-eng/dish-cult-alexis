import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // restaurant IDs
  toggleFavorite: (id: string) => boolean;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: ['vin18-glasgow', 'mamo-howth-dublin'],
      toggleFavorite: (id: string) => {
        const { favorites } = get();
        const exists = favorites.includes(id);
        if (exists) {
          set({ favorites: favorites.filter((item) => item !== id) });
          return false;
        } else {
          set({ favorites: [...favorites, id] });
          return true;
        }
      },
      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },
    }),
    {
      name: 'dishcult-favorites-storage',
    }
  )
);
