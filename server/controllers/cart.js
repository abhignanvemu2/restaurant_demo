import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js'

export const getCart = async (req, res) => {
  try {
    // If user is admin or manager, get all carts
    const country = req.user.country
    if (['admin', 'manager'].includes(req.user.role)) {
      const carts = await Cart.find({})
        .populate('userId', 'name email country')
        .populate({
          path: 'restaurantId',
          select: 'name country',
          match: { country: country },
        })
        .populate('items.menuItemId', 'name price image')
        .sort({ updatedAt: -1 });
      
      // Combine all cart items into a single response
      const allItems = [];
      let totalSubtotal = 0;
      let totalTax = 0;
      let totalDeliveryFee = 0;
      let totalAmount = 0;
      
      carts.forEach(cart => {
        cart.items.forEach(item => {
          allItems.push({
            ...item.toObject(),
            cartId: cart._id,
            userId: cart.userId._id,
            userName: cart.userId.name,
            userEmail: cart.userId.email,
            userCountry: cart.userId.country,
            restaurantName: cart.restaurantName,
            restaurantCountry: cart.restaurantId.country
          });
        });
        totalSubtotal += cart.subtotal;
        totalTax += cart.tax;
        totalDeliveryFee += cart.deliveryFee;
        totalAmount += cart.total;
      });
      
      return res.json({
        items: allItems,
        subtotal: totalSubtotal,
        tax: totalTax,
        deliveryFee: totalDeliveryFee,
        total: totalAmount,
        restaurantId: null,
        restaurantName: 'Multiple Restaurants',
        isAdminView: true,
        totalCarts: carts.length
      });
    }
    
    // For regular users, get their own cart
    const cart = await Cart.findOne({ userId: req.user._id })
      .populate('restaurantId', 'name country')
      .populate('items.menuItemId', 'name price image');
    
    if (!cart) {
      return res.json({
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        restaurantId: null,
        restaurantName: null,
        isAdminView: false
      });
    }
    
    res.json({
      ...cart.toObject(),
      isAdminView: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1, specialInstructions } = req.body;
    
    // Get menu item details
    const menuItem = await MenuItem.findById(menuItemId).populate('restaurantId');
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Check if restaurant is in user's country
    if (menuItem.restaurantId.country !== req.user.country) {
      return res.status(400).json({ message: 'Cannot order from restaurants in different countries' });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    // If cart exists but for different restaurant, clear it
    if (cart && cart.restaurantId.toString() !== menuItem.restaurantId._id.toString()) {
      cart.items = [];
      cart.restaurantId = menuItem.restaurantId._id;
      cart.restaurantName = menuItem.restaurantId.name;
      cart.country = menuItem.restaurantId.country;
    }
    
    // Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        restaurantId: menuItem.restaurantId._id,
        restaurantName: menuItem.restaurantId.name,
        country: menuItem.restaurantId.country,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.menuItemId.toString() === menuItemId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        menuItemId,
        menuItemName: menuItem.name,
        quantity,
        price: menuItem.price,
        specialInstructions
      });
    }
    
    await cart.save();
    
    // Populate and return updated cart
    const populatedCart = await Cart.findById(cart._id)
      .populate('restaurantId', 'name country')
      .populate('items.menuItemId', 'name price image');
    
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    // For admin/manager, find cart by item ID across all carts
    let cart;
    if (['admin', 'manager'].includes(req.user.role)) {
      cart = await Cart.findOne({ 'items._id': itemId });
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    // Return appropriate response based on user role
    if (['admin', 'manager'].includes(req.user.role)) {
      // Return all carts for admin view
      return getCart(req, res);
    } else {
      const populatedCart = await Cart.findById(cart._id)
        .populate('restaurantId', 'name country')
        .populate('items.menuItemId', 'name price image');
      
      res.json(populatedCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // For admin/manager, find cart by item ID across all carts
    let cart;
    if (['admin', 'manager'].includes(req.user.role)) {
      cart = await Cart.findOne({ 'items._id': itemId });
    } else {
      cart = await Cart.findOne({ userId: req.user._id });
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    // If no items left, delete the cart
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
    } else {
      await cart.save();
    }
    
    // Return appropriate response based on user role
    if (['admin', 'manager'].includes(req.user.role)) {
      // Return all carts for admin view
      return getCart(req, res);
    } else {
      if (cart.items.length === 0) {
        return res.json({
          items: [],
          subtotal: 0,
          tax: 0,
          deliveryFee: 0,
          total: 0,
          restaurantId: null,
          restaurantName: null
        });
      }
      
      const populatedCart = await Cart.findById(cart._id)
        .populate('restaurantId', 'name country')
        .populate('items.menuItemId', 'name price image');
      
      res.json(populatedCart);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    // For admin/manager, clear all carts
    if (['admin', 'manager'].includes(req.user.role)) {
      await Cart.deleteMany({});
      
      return res.json({
        message: 'All carts cleared successfully',
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        restaurantId: null,
        restaurantName: null,
        isAdminView: true
      });
    }
    
    // For regular users, clear their own cart
    await Cart.findOneAndDelete({ userId: req.user._id });
    
    res.json({
      message: 'Cart cleared successfully',
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0,
      restaurantId: null,
      restaurantName: null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

// New endpoint for placing orders from selected items
export const placeOrderFromCart = async (req, res) => {
  try {
    const { selectedItems, deliveryAddress, paymentMethod } = req.body;
    
    if (!selectedItems || selectedItems.length === 0) {
      return res.status(400).json({ message: 'No items selected for order' });
    }
    
    // Only admin/manager can place orders
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only admin and manager can place orders' });
    }
    
    // Group items by cart/user for separate orders
    const ordersByCart = {};
    
    for (const itemId of selectedItems) {
      const cart = await Cart.findOne({ 'items._id': itemId })
        .populate('userId', 'name email')
        .populate('restaurantId', 'name');
      
      if (!cart) continue;
      
      const item = cart.items.find(item => item._id.toString() === itemId);
      if (!item) continue;
      
      const cartKey = cart._id.toString();
      if (!ordersByCart[cartKey]) {
        ordersByCart[cartKey] = {
          userId: cart.userId._id,
          restaurantId: cart.restaurantId._id,
          restaurantName: cart.restaurantName,
          items: [],
          customer: cart.userId
        };
      }
      
      ordersByCart[cartKey].items.push(item);
    }
    
    // Create orders for each cart
    const createdOrders = [];
    for (const [cartId, orderData] of Object.entries(ordersByCart)) {
      const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1;
      const deliveryFee = 2.99;
      const total = subtotal + tax + deliveryFee;
      
      // Here you would create the actual order in your Order model
      // For now, we'll simulate it
      const order = {
        // id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: orderData.userId,
        restaurantId: orderData.restaurantId,
        restaurantName: orderData.restaurantName,
        items: orderData.items,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentMethod,
        deliveryAddress,
        status: 'pending',
        createdAt: new Date()
      };
      
      createdOrders.push(order);
      await Order.insertMany(createdOrders)  
      // Remove ordered items from cart
      const cart = await Cart.findById(cartId);
      if (cart) {
        cart.items = cart.items.filter(item => 
          !selectedItems.includes(item._id.toString())
        );
        
        if (cart.items.length === 0) {
          await Cart.findByIdAndDelete(cartId);
        } else {
          await cart.save();
        }
      }
    }
    
    res.json({
      message: `${createdOrders.length} order(s) placed successfully`,
      orders: createdOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};