import PaymentMethod from '../models/PaymentMethod.js';

export const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ userId: req.user._id });
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
  }
};

export const addPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = new PaymentMethod({
      ...req.body,
      userId: req.user._id
    });
    
    if (paymentMethod.isDefault) {
      await PaymentMethod.updateMany(
        { userId: req.user._id },
        { isDefault: false }
      );
    }
    
    await paymentMethod.save();
    res.status(201).json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment method', error: error.message });
  }
};

export const updatePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment method', error: error.message });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment method', error: error.message });
  }
};

export const setDefaultPaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.updateMany(
      { userId: req.user._id },
      { isDefault: false }
    );
    
    const paymentMethod = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDefault: true },
      { new: true }
    );
    
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    res.json(paymentMethod);
  } catch (error) {
    res.status(500).json({ message: 'Error setting default payment method', error: error.message });
  }
};