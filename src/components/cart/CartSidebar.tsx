import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useTranslator } from '../../hooks/useTranslator';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

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
    fetchCart
  } = useCartStore();


  const [isClearing, setIsClearing] = useState(false);

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
    onClose();
    navigate('/checkout');
  };

  const canCheckout = ['admin', 'manager'].includes(user?.role || '');

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
              <h2 className="text-lg font-semibold text-neutral-900">{t('your_cart')}</h2>
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
                <div className="mb-4">
                  <p className="text-sm text-neutral-600">
                    Ordering from <span className="font-medium text-neutral-900">{restaurantName}</span>
                  </p>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div 
                      key={item._id} 
                      className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
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
                <h3 className="text-lg font-medium text-neutral-800">{t('cart_empty')}</h3>
                <p className="text-neutral-500 mt-1 mb-4">Add items from a restaurant to get started</p>
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
                  {t('clear_cart')}
                </Button>
                
                <Button
                  size="md"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={!canCheckout || isLoading}
                  rightIcon={canCheckout ? undefined : (
                    <span className="h-4 w-4 text-xs bg-neutral-200 rounded-full flex items-center justify-center">
                      ?
                    </span>
                  )}
                >
                  {canCheckout ? t('checkout') : 'Restricted'}
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
    </>
  );
};

export default CartSidebar;