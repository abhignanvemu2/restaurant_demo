import express from 'express';
import { 
  getAllRestaurants, 
  getRestaurantById, 
  createRestaurant,
  updateRestaurant,
  deleteRestaurant 
} from '../controllers/restaurants.js';
import { authMiddleware, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Admin only routes
router.post('/', authMiddleware, roleCheck(['admin']), createRestaurant);
router.put('/:id', authMiddleware, roleCheck(['admin']), updateRestaurant);
router.delete('/:id', authMiddleware, roleCheck(['admin']), deleteRestaurant);

export default router;