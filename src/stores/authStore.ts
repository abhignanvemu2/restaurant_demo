import { create } from 'zustand';
import { User, UserRole } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, country: 'India' | 'America') => Promise<boolean>;
  logout: () => Promise<void>;
  checkUserPermission: (requiredRole: UserRole[]) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,

  login: async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, initialized: true });
      // toast.success('Logged in successfully');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  },

  register: async (name, email, password, country) => {
    try {
      const response = await authAPI.register(name, email, password, country);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, initialized: true });
      toast.success('Registration successful');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      set({ user: null });
      // toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      set({ user: null });
      toast.error('Failed to logout properly');
    }
  },

  checkUserPermission: (requiredRoles) => {
    const { user } = get();
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }
}));

// auth state from token
const token = localStorage.getItem('token');
if (token) {
  authAPI.getCurrentUser()
    .then(response => {
      useAuthStore.setState({ user: response.data, initialized: true });
    })
    .catch(() => {
      localStorage.removeItem('token');
      useAuthStore.setState({ initialized: true });
      toast.error('Session expired. Please login again.');
    });
} else {
  useAuthStore.setState({ initialized: true });
}