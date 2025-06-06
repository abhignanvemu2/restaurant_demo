import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    country: 'India',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    country: 'America',
    createdAt: '2023-01-15T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Member User',
    email: 'member@example.com',
    role: 'member',
    country: 'India',
    createdAt: '2023-02-01T00:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Indian Manager',
    email: 'indian.manager@example.com',
    role: 'manager',
    country: 'India',
    createdAt: '2023-03-01T00:00:00Z'
  },
  {
    id: 'user-5',
    name: 'American Member',
    email: 'american.member@example.com',
    role: 'member',
    country: 'America',
    createdAt: '2023-04-01T00:00:00Z'
  }
];