import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

export const getCart = async (req, res) => {
  try {
    let carts;

    const userRole = req.user.role;
    const userId = req.user._id;
    const userCountry = req.user.country;

    if (userRole == 'admin' || userRole == 'manager') {
      carts = await Cart.find()
        .populate({
          path: 'restaurantId',
          select: 'name country',
          match: { country: userCountry },
        })
        .populate('userId', 'name email') 
        .populate('items.menuItemId', 'name price image');

      carts = carts.filter(cart => cart.restaurantId !== null);
    } else {
      // Members: only their cart
      carts = await Cart.find({ userId })
        .populate('restaurantId', 'name country')
        .populate('items.menuItemId', 'name price image');
      }
      console.log("🚀 ~ getCart ~ carts:", carts)

    // Member with no cart: return empty structure
    if (userRole == 'member' && carts.length == 0) {
      return res.json({
        items: [],
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
        restaurantId: null,
        restaurantName: null,
      });
    }

    res.json(carts);
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
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id)
      .populate('restaurantId', 'name country')
      .populate('items.menuItemId', 'name price image');
    
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    // If no items left, delete the cart
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
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
    
    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id)
      .populate('restaurantId', 'name country')
      .populate('items.menuItemId', 'name price image');
    
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    console.log(req.params)
    const {_id} = req.params;
    await Cart.findByIdAndDelete({_id});
    console.log("🚀 ~ clearCart ~ _id:", _id)
    
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