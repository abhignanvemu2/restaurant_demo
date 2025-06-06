import { MenuItem } from '../types';

export const mockMenuItems: MenuItem[] = [
  {
    _id: 'rest-1-item-1',
    restaurantId: 'rest-1',
    name: 'Butter Chicken',
    description: 'Tender chicken cooked in a rich tomato and butter sauce with aromatic spices.',
    price: 14.99,
    image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Main Course',
    vegetarian: false,
    spicyLevel: 2,
    popular: true
  },
  {
    _id: 'rest-1-item-2',
    restaurantId: 'rest-1',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in a creamy spinach gravy, flavored with garlic and spices.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/5410420/pexels-photo-5410420.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Main Course',
    vegetarian: true,
    spicyLevel: 1,
    popular: true
  },
  {
    _id: 'rest-1-item-3',
    restaurantId: 'rest-1',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice cooked with mixed vegetables and aromatic spices.',
    price: 13.99,
    image: 'https://images.pexels.com/photos/7426867/pexels-photo-7426867.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Rice',
    vegetarian: true,
    spicyLevel: 2,
    popular: false
  },
  {
    _id: 'rest-1-item-4',
    restaurantId: 'rest-1',
    name: 'Chicken Tikka',
    description: 'Boneless chicken pieces marinated in yogurt and spices, grilled to perfection.',
    price: 10.99,
    image: 'https://images.pexels.com/photos/2689419/pexels-photo-2689419.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Appetizer',
    vegetarian: false,
    spicyLevel: 3,
    popular: true
  },
  {
    _id: 'rest-1-item-5',
    restaurantId: 'rest-1',
    name: 'Garlic Naan',
    description: 'Soft flatbread with garlic and butter, baked in a tandoor oven.',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Bread',
    vegetarian: true,
    spicyLevel: 0,
    popular: true
  },
  {
    _id: 'rest-1-item-6',
    restaurantId: 'rest-1',
    name: 'Gulab Jamun',
    description: 'Sweet milk dumplings soaked in sugar syrup, flavored with cardamom and rose water.',
    price: 5.99,
    image: 'https://images.pexels.com/photos/14415336/pexels-photo-14415336.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Dessert',
    vegetarian: true,
    spicyLevel: 0,
    popular: false
  },

  {
    _id: 'rest-2-item-1',
    restaurantId: 'rest-2',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and special sauce.',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers',
    vegetarian: false,
    spicyLevel: 0,
    popular: true
  },
  {
    _id: 'rest-2-item-2',
    restaurantId: 'rest-2',
    name: 'Double Bacon Burger',
    description: 'Two beef patties with crispy bacon, cheese, and all the fixings.',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Burgers',
    vegetarian: false,
    spicyLevel: 0,
    popular: true
  },
  {
    _id: 'rest-2-item-3',
    restaurantId: 'rest-2',
    name: 'Crispy Chicken Sandwich',
    description: 'Crispy fried chicken breast with pickles and special sauce on a toasted bun.',
    price: 9.99,
    image: 'https://images.pexels.com/photos/13798113/pexels-photo-13798113.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sandwiches',
    vegetarian: false,
    spicyLevel: 1,
    popular: false
  },
  {
    _id: 'rest-2-item-4',
    restaurantId: 'rest-2',
    name: 'French Fries',
    description: 'Crispy golden fries seasoned with salt.',
    price: 3.99,
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sides',
    vegetarian: true,
    spicyLevel: 0,
    popular: true
  },
  {
    _id: 'rest-2-item-5',
    restaurantId: 'rest-2',
    name: 'Chocolate Milkshake',
    description: 'Creamy chocolate milkshake topped with whipped cream.',
    price: 4.99,
    image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Drinks',
    vegetarian: true,
    spicyLevel: 0,
    popular: false
  },
  {
    _id: 'rest-2-item-6',
    restaurantId: 'rest-2',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings served with dipping sauce.',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Sides',
    vegetarian: true,
    spicyLevel: 0,
    popular: true
  },

];

// Function to get menu items by restaurant ID
export const getMenuItemsByRestaurantId = (restaurantId: string): MenuItem[] => {
  return mockMenuItems.filter(item => item.restaurantId === restaurantId);
};

// Function to get a menu item by ID
export const getMenuItemById = (id: string): MenuItem | undefined => {
  return mockMenuItems.find(item => item._id === id);
};