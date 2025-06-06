// User types
export type UserRole = 'admin' | 'manager' | 'member';
export type UserCountry = 'India' | 'America';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: UserCountry;
  avatar?: string;
  createdAt: string;
}

// Restaurant types
export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  logo: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  address: string;
  country: UserCountry;
}

// Menu types
export interface MenuItem {
  _id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vegetarian: boolean;
  spicyLevel: number;
  popular: boolean;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  country: string;
  menuItemName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  restaurantName? : string;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

// Payment types
export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'upi' | 'wallet';
  lastFour?: string;
  cardBrand?: string;
  expiryDate?: string;
  name: string;
  isDefault: boolean;
}