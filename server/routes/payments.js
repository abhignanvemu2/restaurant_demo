import express from 'express';
import { 
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '../controllers/payments.js';
import { authMiddleware, roleCheck } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/', roleCheck(['admin']), getPaymentMethods);
router.post('/', roleCheck(['admin']), addPaymentMethod);
router.put('/:id', roleCheck(['admin']), updatePaymentMethod);
router.delete('/:id', roleCheck(['admin']), deletePaymentMethod);
router.put('/:id/default', roleCheck(['admin']), setDefaultPaymentMethod);

export default router;