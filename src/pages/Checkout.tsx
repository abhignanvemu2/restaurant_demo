import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils/cn';
import { cartAPI, orderAPI, paymentAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    items, 
    restaurantName, 
    subtotal, 
    tax, 
    deliveryFee, 
    total, 
    restaurantId,
    clearCart 
  } = useCartStore();
  
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [addressDetails, setAddressDetails] = useState({
    street: '',
    city: '',
    state: '',
    zipcode: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState('');
  
  useEffect(() => {
    // Check if user has permission to checkout
    if (user && !['admin', 'manager'].includes(user.role)) {
      navigate('/');
      return;
    }
    
    // Check if cart has items
    if (items.length === 0) {
      navigate('/restaurants');
    }
  }, [user, items, navigate]);
  
  const handleAddressChange = (e: any) => {
    const { name, value } = e.target;
    setAddressDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const isFormValid = () => {
    return (
      addressDetails.street.trim() !== '' &&
      addressDetails.city.trim() !== '' &&
      addressDetails.state.trim() !== '' &&
      addressDetails.zipcode.trim() !== '' &&
      addressDetails.phone.trim() !== ''
    );
  };
  
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!isFormValid()) {
    setOrderError('Please fill in all required fields');
    return;
  }

  setIsProcessing(true);
  setOrderError('');

  try {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    let cardNumber = formData.get('card_number')?.toString() || '';
    cardNumber = cardNumber.slice(-4);
    const expiryDate = formData.get('expiry_date')?.toString() || '';
    const cvv = formData.get('cvv')?.toString() || '';
    const cardName = formData.get('card_name')?.toString() || '';
const formattedAddress = Object.values(addressDetails).join(', ');
    const data = {
      restaurantName,
      restaurantId,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      deliveryAddress: formattedAddress,
      paymentMethod,
    };

    await paymentAPI.add({
      type : paymentMethod,
      lastFour : cardNumber,
      cardBrand : 'visa',
      expiryDate : expiryDate,
      name : cardName
    }).then(async res => {
      if(res.ok){
        await orderAPI.create(data)
      }
    })


    // TODO: Call backend API with this data

    await orderAPI.create(data)

    setOrderComplete(true);
    clearCart();
  } catch (error) {
    setOrderError('Failed to process your order. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-neutral-600 mb-6">
              Thank you for your order. Your food is being prepared and will be delivered soon.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
              >
                View Orders
              </Button>
              <Button onClick={() => navigate('/restaurants')}>
                Order More Food
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>
      
      {orderError && (
        <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{orderError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Checkout Form */}
          <div className="lg:w-2/3 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader className="border-b border-neutral-200">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-neutral-700 mb-1">
                      Street Address*
                    </label>
                    <input
                      id="street"
                      name="street"
                      type="text"
                      value={addressDetails.street}
                      onChange={handleAddressChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                      City*
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={addressDetails.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                      State*
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={addressDetails.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipcode" className="block text-sm font-medium text-neutral-700 mb-1">
                      ZIP Code*
                    </label>
                    <input
                      id="zipcode"
                      name="zipcode"
                      type="text"
                      value={addressDetails.zipcode}
                      onChange={handleAddressChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="flex-grow">
                      <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                        Phone Number*
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-neutral-50 border border-r-0 border-neutral-300 rounded-l-md text-neutral-500">
                          <Phone className="h-4 w-4" />
                        </span>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={addressDetails.phone}
                          onChange={handleAddressChange}
                          required
                          className="w-full p-2 border border-neutral-300 rounded-r-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Method */}
            <Card>
              <CardHeader className="border-b border-neutral-200">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-500" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <label className="block">
                    <div className={cn(
                      "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
                      paymentMethod === 'credit'
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:bg-neutral-50"
                    )}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="creditCard"
                        checked={paymentMethod === 'credit'}
                        onChange={() => setPaymentMethod('credit')}
                        className="mr-3 text-primary-500 focus:ring-primary-500"
                      />
                      <div className="flex items-center justify-between flex-grow">
                        <div>
                          <span className="font-medium text-neutral-900">Credit/Debit Card</span>
                          <p className="text-xs text-neutral-500 mt-1">Pay securely with your card</p>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-8 h-6 bg-neutral-200 rounded"></div>
                          <div className="w-8 h-6 bg-neutral-200 rounded"></div>
                          <div className="w-8 h-6 bg-neutral-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="block">
                    <div className={cn(
                      "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
                      paymentMethod === 'cashOnDelivery'
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-200 hover:bg-neutral-50"
                    )}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cashOnDelivery"
                        checked={paymentMethod === 'cashOnDelivery'}
                        onChange={() => setPaymentMethod('cashOnDelivery')}
                        className="mr-3 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <span className="font-medium text-neutral-900">Cash on Delivery</span>
                        <p className="text-xs text-neutral-500 mt-1">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                  
                  {paymentMethod === 'credit' && (
                    <div className="mt-4 border border-neutral-200 rounded-lg p-4">
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-20">
              <Card>
                <CardHeader className="border-b border-neutral-200">
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-primary-500" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="text-neutral-600 mb-1">Ordering from:</p>
                    <p className="font-medium text-neutral-900">{restaurantName}</p>
                  </div>
                  
                  <div className="border-t border-neutral-200 pt-4 mb-4">
                    <h3 className="font-medium text-neutral-900 mb-2">Items</h3>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item._id} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.quantity}x</span> {item.menuItemName}
                          </div>
                          <span className="text-neutral-700">${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-neutral-200 pt-4 mb-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tax</span>
                        <span className="text-neutral-900">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Delivery Fee</span>
                        <span className="text-neutral-900">${deliveryFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-200 pt-4 mb-6">
                    <div className="flex justify-between font-medium">
                      <span className="text-lg">Total</span>
                      <span className="text-lg text-primary-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;