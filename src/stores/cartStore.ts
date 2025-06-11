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
  // Admin view additional fields
  cartId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userCountry?: string;
  restaurantName?: string;
  restaurantCountry?: string;
}

interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  isLoading: boolean;
  isAdminView: boolean;
  totalCarts: number;
  selectedItems: string[];
  fetchCart: () => Promise<void>;
  addItem: (menuItemId: string, quantity: number, specialInstructions?: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  placeSelectedOrder: (deliveryAddress: string, paymentMethod: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  restaurantName: null,
  items: [],
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  total: 0,
  isLoading: false,
  isAdminView: false,
  totalCarts: 0,
  selectedItems: [],

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await cartAPI.get();
      const cart = response.data;

      if(cart.length == 0){
        set({
        restaurantId: null,
        restaurantName: null,
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        isAdminView: false,
        totalCarts: 0,
        selectedItems: [],
        isLoading: false
      });
      }else{     
        set({
          restaurantId: cart.restaurantId?._id || null,
          restaurantName: cart.restaurantName || null,
          items: cart.items || [],
          subtotal: cart.subtotal || 0,
          tax: cart.tax || 0,
          deliveryFee: cart.deliveryFee || 0,
          total: cart.total || 0,
          isAdminView: cart.isAdminView || false,
          totalCarts: cart.totalCarts || 0,
          selectedItems: [],
          isLoading: false
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
         set({
        restaurantId: null,
        restaurantName: null,
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        isAdminView: false,
        totalCarts: 0,
        selectedItems: [],
        isLoading: false
      });
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
        isAdminView: cart.isAdminView || false,
        totalCarts: cart.totalCarts || 0,
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
      
      // Remove from selected items if it was selected
      const { selectedItems } = get();
      const newSelectedItems = selectedItems.filter(id => id !== itemId);
      
      set({
        restaurantId: cart.restaurantId?._id || null,
        restaurantName: cart.restaurantName || null,
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        tax: cart.tax || 0,
        deliveryFee: cart.deliveryFee || 0,
        total: cart.total || 0,
        isAdminView: cart.isAdminView || false,
        totalCarts: cart.totalCarts || 0,
        selectedItems: newSelectedItems,
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
      await cartAPI.clear();
      
      set({
        restaurantId: null,
        restaurantName: null,
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        isAdminView: false,
        totalCarts: 0,
        selectedItems: [],
        isLoading: false
      });
      
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    }
  },

  toggleItemSelection: (itemId: string) => {
    const { selectedItems } = get();
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    set({ selectedItems: newSelectedItems });
  },

  selectAllItems: () => {
    const { items } = get();
    const allItemIds = items.map(item => item._id);
    set({ selectedItems: allItemIds });
  },

  deselectAllItems: () => {
    set({ selectedItems: [] });
  },

  placeSelectedOrder: async (deliveryAddress: string, paymentMethod: string) => {
    try {
      const { selectedItems } = get();
      
      if (selectedItems.length === 0) {
        toast.error('Please select items to order');
        return;
      }
      
      set({ isLoading: true });
      const response = await cartAPI.placeOrder(selectedItems, deliveryAddress, paymentMethod);
      
      toast.success(response.data.message);
      
      // Refresh cart after placing order
      await get().fetchCart();
    } catch (error: any) {
      console.error('Failed to place order:', error);
      set({ isLoading: false });
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    }
  }
}));