import express from 'express';
import { 
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orders.js';
import { authMiddleware, roleCheck } from '../middleware/auth.js';

const router = express.Router();

// Routes accessible to admin and manager
router.get('/', roleCheck(['admin', 'manager']), getOrders);
router.get('/:id', roleCheck(['admin', 'manager']), getOrderById);
router.post('/', roleCheck(['admin', 'manager']), createOrder);
router.put('/:id/status', roleCheck(['admin', 'manager']), updateOrderStatus);
router.post('/:id/cancel', roleCheck(['admin', 'manager']), cancelOrder);

export default router;