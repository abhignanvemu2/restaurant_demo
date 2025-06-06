import { create } from 'zustand';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

interface CartState {
  _id: string | null;
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (menuItemId: string, quantity: number, specialInstructions?: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  _id: null,
  restaurantId: null,
  restaurantName: null,
  items: [],
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await cartAPI.get();
      const cart = response.data;
      if(cart.length == 0) {
         set({
        _id: null,
        restaurantId: null,
        restaurantName: null,
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        isLoading: false
      });
      }else{
        cart.map((item: any) => {
          set({
          _id: item._id,
          restaurantId: item.restaurantId?._id || null,
          restaurantName: item.restaurantName || null,
          items: item.items || [],
          subtotal: item.subtotal || 0,
          tax: item.tax || 0,
          deliveryFee: item.deliveryFee || 0,
          total: item.total || 0,
          isLoading: false
        });
      })
    }

      
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
      // toast.error('Failed to load cart');
    }
  },

  addItem: async (menuItemId: string, quantity: number, specialInstructions?: string) => {
    try {
      set({ isLoading: true });
      const response = await cartAPI.add(menuItemId, quantity, specialInstructions);
      const cart = response.data;
      
      set({
        restaurantId: cart.restaurantId?._id || null,
        restaurantName: cart.restaurantName || null,
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        tax: cart.tax || 0,
        deliveryFee: cart.deliveryFee || 0,
        total: cart.total || 0,
        isLoading: false
      });
      
      toast.success('Item added to cart');
    } catch (error: any) {
      console.error('Failed to add item to cart:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
    }
  },

  updateItemQuantity: async (itemId: string, quantity: number) => {
    try {
      set({ isLoading: true });
      const response = await cartAPI.updateItem(itemId, quantity);
      const cart = response.data;
      
      set({
        restaurantId: cart.restaurantId?._id || null,
        restaurantName: cart.restaurantName || null,
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        tax: cart.tax || 0,
        deliveryFee: cart.deliveryFee || 0,
        total: cart.total || 0,
        isLoading: false
      });
      
      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Failed to update cart item:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true });
      const response = await cartAPI.removeItem(itemId);
      const cart = response.data;
      
      set({
        restaurantId: cart.restaurantId?._id || null,
        restaurantName: cart.restaurantName || null,
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        tax: cart.tax || 0,
        deliveryFee: cart.deliveryFee || 0,
        total: cart.total || 0,
        isLoading: false
      });
      
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove item from cart:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });
      const id = get()._id ?? ''
      await cartAPI.clear(id);
      set({
        _id: null,
        restaurantId: null,
        restaurantName: null,
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        isLoading: false
      });
      
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    }
  }
}));