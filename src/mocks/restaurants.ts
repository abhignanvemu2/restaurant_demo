import { Restaurant } from '../types';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a modern twist. Serving the best curries, biryanis and tandoori dishes.',
    coverImage: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/6646233/pexels-photo-6646233.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['Indian', 'Vegetarian'],
    rating: 4.5,
    deliveryTime: '30-45 min',
    priceRange: '$$',
    address: '123 Curry Lane, Mumbai',
    country: 'India'
  },
  {
    id: 'rest-2',
    name: 'Burger Kingdom',
    description: 'Juicy burgers, crispy fries, and creamy milkshakes. The ultimate American fast-food experience.',
    coverImage: 'https://images.pexels.com/photos/2725744/pexels-photo-2725744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '15-30 min',
    priceRange: '$',
    address: '456 Burger Ave, New York',
    country: 'America'
  },
  {
    id: 'rest-3',
    name: 'Taj Mahal',
    description: 'Royal Indian dining experience with recipes passed down through generations.',
    coverImage: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/10281062/pexels-photo-10281062.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['Indian', 'Mughlai'],
    rating: 4.7,
    deliveryTime: '40-55 min',
    priceRange: '$$$',
    address: '789 Palace Road, Delhi',
    country: 'India'
  },
  {
    id: 'rest-4',
    name: 'American Diner',
    description: 'Classic American comfort food in a nostalgic diner setting. Pancakes, burgers, and more!',
    coverImage: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/2235831/pexels-photo-2235831.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['American', 'Breakfast'],
    rating: 4.0,
    deliveryTime: '20-35 min',
    priceRange: '$$',
    address: '101 Main St, Chicago',
    country: 'America'
  },
  {
    id: 'rest-5',
    name: 'Curry House',
    description: 'Family-run restaurant specializing in regional Indian delicacies and street food.',
    coverImage: 'https://images.pexels.com/photos/7363699/pexels-photo-7363699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/7437989/pexels-photo-7437989.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['Indian', 'Street Food'],
    rating: 4.3,
    deliveryTime: '25-40 min',
    priceRange: '$',
    address: '222 Spice Street, Bangalore',
    country: 'India'
  },
  {
    id: 'rest-6',
    name: 'Texas BBQ',
    description: 'Authentic Texas-style barbecue with slow-smoked meats and homemade sauces.',
    coverImage: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/1251196/pexels-photo-1251196.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['American', 'BBQ'],
    rating: 4.6,
    deliveryTime: '35-50 min',
    priceRange: '$$',
    address: '333 Smoky Lane, Austin',
    country: 'America'
  },
  {
    id: 'rest-7',
    name: 'South Indian Delights',
    description: 'Specializing in authentic South Indian cuisine - dosas, idlis, and flavorful curries.',
    coverImage: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['Indian', 'South Indian'],
    rating: 4.4,
    deliveryTime: '30-45 min',
    priceRange: '$$',
    address: '444 Coconut Road, Chennai',
    country: 'India'
  },
  {
    id: 'rest-8',
    name: 'California Fresh',
    description: 'Fresh, organic ingredients in creative California-inspired dishes and healthy bowls.',
    coverImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    logo: 'https://images.pexels.com/photos/5945565/pexels-photo-5945565.jpeg?auto=compress&cs=tinysrgb&w=100',
    cuisine: ['American', 'Healthy'],
    rating: 4.1,
    deliveryTime: '20-35 min',
    priceRange: '$$$',
    address: '555 Ocean Drive, Los Angeles',
    country: 'America'
  }
];

// Export a function to get restaurants by country
export const getRestaurantsByCountry = (country: string) => {
  return mockRestaurants.filter(restaurant => restaurant.country === country);
};

// Export a function to get a restaurant by ID
export const getRestaurantById = (id: string) => {
  return mockRestaurants.find(restaurant => restaurant._id === id);
};