import express from 'express';
import { 
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.js';
import { authMiddleware, roleCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getMenuItems);
router.get('/:id', getMenuItem);

// Admin only routes
router.post('/', authMiddleware, roleCheck(['admin']), createMenuItem);
router.put('/:id', authMiddleware, roleCheck(['admin']), updateMenuItem);
router.delete('/:id', authMiddleware, roleCheck(['admin']), deleteMenuItem);

export default router;