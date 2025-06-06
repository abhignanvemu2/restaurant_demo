import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import PaymentMethod from '../models/PaymentMethod.js';

dotenv.config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    country: 'India'
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'manager',
    country: 'America'
  },
  {
    name: 'Member User',
    email: 'member@example.com',
    password: 'password123',
    role: 'member',
    country: 'India'
  }
];

const restaurants = [
  {
    name: 'Spice Garden',
    description: 'Authentic Indian cuisine with a modern twist.',
    coverImage: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    logo: 'https://images.pexels.com/photos/6646233/pexels-photo-6646233.jpeg',
    cuisine: ['Indian', 'Vegetarian'],
    rating: 4.5,
    deliveryTime: '30-45 min',
    priceRange: '$$',
    address: '123 Curry Lane, Mumbai',
    country: 'India'
  },
  {
    name: 'Burger Kingdom',
    description: 'Juicy burgers and crispy fries.',
    coverImage: 'https://images.pexels.com/photos/2725744/pexels-photo-2725744.jpeg',
    logo: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
    cuisine: ['American', 'Fast Food'],
    rating: 4.2,
    deliveryTime: '15-30 min',
    priceRange: '$',
    address: '456 Burger Ave, New York',
    country: 'America'
  }
];

const menuItems = [
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato sauce',
    price: 14.99,
    image: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg',
    category: 'Main Course',
    vegetarian: false,
    spicyLevel: 2,
    popular: true
  },
  {
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheese and fresh veggies',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    category: 'Burgers',
    vegetarian: false,
    spicyLevel: 0,
    popular: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await PaymentMethod.deleteMany({});

    // Seed users
    const createdUsers = await User.create(users);
    console.log('Users seeded');

    // Seed restaurants
    const createdRestaurants = await Restaurant.create(restaurants);
    console.log('Restaurants seeded');

    // Seed menu items
    const menuItemsWithRestaurant = menuItems.map((item, index) => ({
      ...item,
      restaurantId: createdRestaurants[index % createdRestaurants.length]._id
    }));
    await MenuItem.create(menuItemsWithRestaurant);
    console.log('Menu items seeded');

    // Seed payment methods for admin
    const adminUser = createdUsers.find(user => user.role === 'admin');
    await PaymentMethod.create({
      userId: adminUser._id,
      type: 'credit',
      cardBrand: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      name: 'Default Credit Card',
      isDefault: true
    });
    console.log('Payment methods seeded');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();