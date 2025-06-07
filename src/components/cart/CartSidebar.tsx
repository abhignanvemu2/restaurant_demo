import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, User, MapPin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useTranslator } from '../../hooks/useTranslator';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';
import { paymentAPI } from '../../services/api';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslator();
  const { 
    items, 
    restaurantName, 
    subtotal, 
    tax, 
    deliveryFee, 
    total, 
    updateItemQuantity, 
    removeItem, 
    clearCart,
    isLoading,
    fetchCart,
    isAdminView,
    totalCarts,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    placeSelectedOrder
  } = useCartStore();

  const [isClearing, setIsClearing] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Fetch cart when sidebar opens
  useEffect(() => {
    if (isOpen && user) {
      fetchCart();
    }
  }, [isOpen, user, fetchCart]);

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
    } finally {
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    if (isAdminView && selectedItems.length > 0) {
      setShowOrderModal(true);
    } else {
      onClose();
      navigate('/checkout');
    }
  };

  const handlePlaceOrder = async (e: any) => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
        const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    let cardNumber = formData.get('card_number')?.toString() || '';
    cardNumber = cardNumber.slice(-4);
    const expiryDate = formData.get('expiry_date')?.toString() || '';
    const cvv = formData.get('cvv')?.toString() || '';
    const cardName = formData.get('card_name')?.toString() || '';

    paymentAPI.add({
         type : paymentMethod,
      lastFour : cardNumber,
      cardBrand : 'visa',
      expiryDate : expiryDate,
      name : cardName
    })

      await placeSelectedOrder(deliveryAddress, paymentMethod);
      setShowOrderModal(false);
      setDeliveryAddress('');
      setPaymentMethod('credit');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const canCheckout = ['admin', 'manager'].includes(user?.role || '');
  const selectedItemsCount = selectedItems.length;
  const allItemsSelected = items.length > 0 && selectedItems.length === items.length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-neutral-900">
                {isAdminView ? 'All Carts' : t('your_cart')}
              </h2>
              {isAdminView && totalCarts > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                  {totalCarts} {totalCarts === 1 ? 'cart' : 'carts'}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-pulse text-primary-500">{t('loading')}</div>
              </div>
            ) : items.length > 0 ? (
              <>
                {isAdminView && (
                  <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-primary-700">
                        Select items to order ({selectedItemsCount} selected)
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllItems}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Select All
                        </button>
                        <button
                          onClick={deselectAllItems}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!isAdminView && (
                  <div className="mb-4">
                    <p className="text-sm text-neutral-600">
                      Ordering from <span className="font-medium text-neutral-900">{restaurantName}</span>
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item._id} 
                      className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      {isAdminView && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => toggleItemSelection(item._id)}
                            className="rounded text-primary-500 focus:ring-primary-500"
                          />
                        </div>
                      )}
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-neutral-900">{item.menuItemName}</h3>
                          <p className="text-primary-500 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <p className="text-sm text-neutral-600 mt-1">
                          ${item.price.toFixed(2)} each
                        </p>

                        {isAdminView && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs text-neutral-500">
                              <User className="h-3 w-3 mr-1" />
                              <span>{item.userName} ({item.userEmail})</span>
                            </div>
                            <div className="flex items-center text-xs text-neutral-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{item.restaurantName} - {item.restaurantCountry}</span>
                            </div>
                          </div>
                        )}
                        
                        {item.specialInstructions && (
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.specialInstructions}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isLoading}
                            className="p-1 rounded-md border border-neutral-300 text-neutral-600 
                              hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 rounded-md border border-neutral-300 text-neutral-600 
                              hover:bg-neutral-100 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => removeItem(item._id)}
                            disabled={isLoading}
                            className="p-1 rounded-md border border-neutral-300 text-error-500 
                              hover:bg-error-50 ml-auto transition-colors disabled:opacity-50"
                            aria-label={`Remove ${item.menuItemName} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-neutral-300 mb-2" />
                <h3 className="text-lg font-medium text-neutral-800">
                  {isAdminView ? 'No items in any cart' : t('cart_empty')}
                </h3>
                <p className="text-neutral-500 mt-1 mb-4">
                  {isAdminView 
                    ? 'No users have added items to their carts yet'
                    : 'Add items from a restaurant to get started'
                  }
                </p>
                <Button
                  onClick={() => {
                    onClose();
                    navigate('/restaurants');
                  }}
                  size="md"
                >
                  Browse {t('restaurants')}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-200">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t('subtotal')}</span>
                  <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t('tax')}</span>
                  <span className="text-neutral-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{t('delivery_fee')}</span>
                  <span className="text-neutral-900">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-neutral-200">
                  <span className="text-neutral-800">{t('total')}</span>
                  <span className="text-primary-500">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={handleClearCart}
                  isLoading={isClearing}
                  disabled={isLoading}
                >
                  {isAdminView ? 'Clear All Carts' : t('clear_cart')}
                </Button>
                
                <Button
                  size="md"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={!canCheckout || isLoading || (isAdminView && selectedItemsCount === 0)}
                >
                  {isAdminView 
                    ? `Order Selected (${selectedItemsCount})`
                    : canCheckout ? t('checkout') : 'Restricted'
                  }
                </Button>
              </div>
              
              {!canCheckout && (
                <p className="text-xs text-error-500 mt-2 text-center">
                  Only admin and manager roles can checkout
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal for Admin View */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div 
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Place Order for Selected Items
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-neutral-600 mb-2">
                  {selectedItemsCount} items selected from {totalCarts} cart(s)
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Address*
                </label>
                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  rows={3}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              {/* <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Payment Method*
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm">Credit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={paymentMethod === 'cashOnDelivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm">Cash on Delivery</span>
                  </label>
                </div>
              </div> */}
              <form onSubmit={handlePlaceOrder}>
               <div className="mt-4 z-100 border-neutral-200 rounded-lg pb-4">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                            Card Number
                          </label>
                          <input
                            id="cardNumber"
                            type="text"
                            name="card_number"
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                              Expiry Date
                            </label>
                            <input
                              id="expiryDate"
                              name="expiry_date"
                              type="text"
                              placeholder="MM/YY"
                              className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                              CVV
                            </label>
                            <input
                              id="cvv"
                              name="cvv"
                              type="text"
                              placeholder="123"
                              className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-neutral-700 mb-1">
                            Name on Card
                          </label>
                          <input
                            id="cardName"
                            name="card_name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                      </div>
                    </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowOrderModal(false)}
                  disabled={isPlacingOrder}
                  >
                  Cancel
                </Button>
                <Button 
                  // onClick={handlePlaceOrder}
                  isLoading={isPlacingOrder}
                  leftIcon={<Check className="h-4 w-4" />}
                  >
                  Place Order
                </Button>
              </div>
                  </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;