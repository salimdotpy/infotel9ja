import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) => {
        const existingItem = get().cartItems.find((item) => item.id === product.id);
        if (existingItem) {
          set((state) => ({
            cartItems: state.cartItems.map((item) =>
              item.id === product.id ? { ...item, qty: product.qty ? item.qty + product.qty : item.qty + 1 } : item
            ),
          }));
        } else {
          set((state) => ({ cartItems: [...state.cartItems, { ...product, qty: product.qty ? product.qty : 1 }] }));
        }
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId),
        }));
      },
      incQty: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId ? { ...item, qty: item.qty + 1 } : item
          ),
        }));
      },
      decQty: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId && item.qty > 1
              ? { ...item, qty: item.qty - 1 }
              : item
          ),
        }));
      },
      setQty: (productId, qty) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId ? { ...item, qty: qty } : item
          ),
        }));
      },
      getQty: (productId) => {
        const foundItem = get().cartItems.find((item) => item.id === productId);
        return foundItem ? foundItem.qty : null
      },
      clearCart: () => {
        set({ cartItems: [] });
      },
      getTotalPrice: () => get().cartItems.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: 'cartItems',
      storage: createJSONStorage(() => sessionStorage),
      merge: (persistedState, currentState) => ({ ...currentState, ...(persistedState) }),
    },
  ),
);

export default useCartStore;