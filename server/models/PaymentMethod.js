import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'upi', 'wallet'],
    required: true
  },
  lastFour: String,
  cardBrand: String,
  expiryDate: String,
  name: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('PaymentMethod', paymentMethodSchema);