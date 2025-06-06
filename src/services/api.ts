import axios from 'axios';
import { Restaurant } from '../types';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: (name: string, email: string, password: string, country: string) => {
    return api.post('/auth/register', { name, email, password, country });
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  getCurrentUser: () => {
    return api.get('/users/profile');
  }
};

// User API
export const userAPI = {
  getProfile: () => {
    return api.get('/users/profile');
  },

  updateProfile: (data: any) => {
    return api.put('/users/profile', data);
  },

  getAllUsers: () => {
    return api.get('/users');
  },

  getUser: (id: string) => {
    return api.get(`/users/${id}`);
  },

  updateUser: (id: string, data: any) => {
    return api.put(`/users/${id}`, data);
  },

  deleteUser: (id: string) => {
    return api.delete(`/users/${id}`);
  }
};

// Restaurant API
export const restaurantAPI = {
  getAll: async (country?: string): Promise<Restaurant> => {
    const res = await  api.get('/restaurants', { params: { country } })
    return res.data;
  },

  getById: async (id: string | undefined) => {
    const res = await api.get(`/restaurants/${id}`);
    return res.data
  },

  create: (data: any) => {
    return api.post('/restaurants', data);
  },

  update: (id: string, data: any) => {
    return api.put(`/restaurants/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/restaurants/${id}`);
  }
};

// Menu API
export const menuAPI = {
  getByRestaurant: async (restaurantId: string | undefined) => {
    const res = await api.get(`/menu/restaurant/${restaurantId}`);
    return res.data
  },

  getById: (id: string) => {
    return api.get(`/menu/${id}`);
  },

  create: (data: any) => {
    return api.post('/menu', data);
  },

  update: (id: string, data: any) => {
    return api.put(`/menu/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/menu/${id}`);
  }
};

// Order API
export const orderAPI = {
  create: async(data: any) => {
    const response = await api.post('/orders', data); 
    return response.data
  },

  getAll: () => {
    return api.get('/orders');
  },

  getById: async(id: string | undefined) => {
    const response = await api.get(`/orders/${id}`);
    return response.data
  },

  updateStatus: (id: string, status: string) => {
    return api.put(`/orders/${id}/status`, { status });
  },

  cancel: async (id: string) => {
    const request = await api.post(`/orders/${id}/cancel`);
    return request.data
  }
};

// Payment API
export const paymentAPI = {
  getMethods: () => {
    return api.get('/payments');
  },

  add: async (data: any) => {
    const res = await api.post('/payments', data);
    return res.data
  },

  update: (id: string, data: any) => {
    return api.put(`/payments/${id}`, data);
  },

  delete: (id: string) => {
    return api.delete(`/payments/${id}`);
  },

  setDefault: (id: string) => {
    return api.put(`/payments/${id}/default`);
  }
};


// Cart API
export const cartAPI = {
  get: (country?: string) => {
    return api.get('/cart', { params: { country } });
  },

  add: (menuItemId: string, quantity: number, specialInstructions?: string) => {
    return api.post('/cart/add', { menuItemId, quantity, specialInstructions });
  },

  updateItem: (itemId: string, quantity: number) => {
    return api.put(`/cart/item/${itemId}`, { quantity });
  },

  removeItem: (itemId: string) => {
    return api.delete(`/cart/item/${itemId}`);
  },

  clear: (_id: string) => {
    console.log('im here with _id:', _id)
    return api.delete(`/cart/clear/${_id}`);
  }
};