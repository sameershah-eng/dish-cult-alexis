import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  discountPercentage: number;
  lastRemovedItem: { item: CartItem; index: number } | null;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  undoRemove: () => void;
  
  // Computed helpers
  getSubtotal: () => number;
  getServiceFee: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: '',
      discountPercentage: 0,
      lastRemovedItem: null,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === item.id);
        const qtyToAdd = item.quantity ?? 1;

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += qtyToAdd;
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { ...item, quantity: qtyToAdd }],
            isOpen: true,
          });
        }
      },

      removeItem: (id) => {
        const { items } = get();
        const index = items.findIndex((i) => i.id === id);
        if (index > -1) {
          const removed = items[index];
          set({
            items: items.filter((i) => i.id !== id),
            lastRemovedItem: { item: removed, index },
          });
        }
      },

      undoRemove: () => {
        const { lastRemovedItem, items } = get();
        if (lastRemovedItem) {
          const updated = [...items];
          updated.splice(lastRemovedItem.index, 0, lastRemovedItem.item);
          set({ items: updated, lastRemovedItem: null });
        }
      },

      updateQuantity: (id, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ items: updated });
      },

      clearCart: () => set({ items: [], promoCode: '', discountPercentage: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === 'DISHCULT10') {
          set({ promoCode: 'DISHCULT10', discountPercentage: 10 });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: '', discountPercentage: 0 }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getServiceFee: () => {
        // 10% discretionary restaurant service charge
        return get().getSubtotal() * 0.10;
      },

      getDiscountAmount: () => {
        const { discountPercentage } = get();
        return (get().getSubtotal() * discountPercentage) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const service = get().getServiceFee();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal + service - discount);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'dishcult-cart-storage',
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        discountPercentage: state.discountPercentage,
      }),
    }
  )
);
