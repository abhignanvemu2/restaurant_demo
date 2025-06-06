import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Package, 
  X, 
  AlertCircle, 
  CheckCircle, 
  MapPin,
  CreditCard,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { Order, OrderStatus } from '../types';
import { cn } from '../utils/cn';
import { orderAPI } from '../services/api';

const statusColors = {
  pending: { bg: 'bg-neutral-100', text: 'text-neutral-700', icon: Clock },
  confirmed: { bg: 'bg-primary-100', text: 'text-primary-700', icon: CheckCircle },
  preparing: { bg: 'bg-warning-100', text: 'text-warning-700', icon: Package },
  'out-for-delivery': { bg: 'bg-info-100', text: 'text-info-700', icon: MapPin },
  delivered: { bg: 'bg-success-100', text: 'text-success-700', icon: CheckCircle },
  cancelled: { bg: 'bg-error-100', text: 'text-error-700', icon: X }
};

const getStatusLabel = (status: OrderStatus): string => {
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  
  return statusLabels[status] || 'Unknown';
};
const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  
  useEffect(() => {
    if (user && !['admin', 'manager'].includes(user.role)) {
      setOrders([]);
      setIsLoading(false);
      return;
    }
    
    // API fetch
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const response = await orderAPI.getAll();
        const data = response.data as Order[];
          setOrders(data);
          setIsLoading(false);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [user]);
  
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (status: OrderStatus | 'all') => {
    setStatusFilter(status);
  };
  
  const handleCancelOrder = async(order: Order) => {
    await orderAPI.cancel(order._id).then(() => {
    })
      setSelectedOrder(order);
      setShowCancellationModal(true);
  };
  
  const confirmCancelOrder = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.map(order => 
      order._id === selectedOrder._id 
        ? { ...order, status: 'cancelled' as OrderStatus } 
        : order
    );
    
    setOrders(updatedOrders);
    setShowCancellationModal(false);
    setSelectedOrder(null);
    setCancellationReason('');
  };
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Orders</h1>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search orders by ID or restaurant name"
                className="w-full py-2 pl-10 pr-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilterChange('all')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md",
                statusFilter === 'all' 
                  ? "bg-primary-500 text-white" 
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              )}
            >
              All
            </button>
            {['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status as OrderStatus)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md",
                  statusFilter === status && status !== 'all'
                    ? `${statusColors[status as OrderStatus].bg} ${statusColors[status as OrderStatus].text}`
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                {getStatusLabel(status as OrderStatus)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden animate-pulse"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-6 bg-neutral-200 rounded w-1/6"></div>
                </div>
                <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const StatusIcon = statusColors[order.status].icon;
            
            return (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-neutral-50 border-b border-neutral-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center text-lg">
                        <span>Order #{order._id}</span>
                        <span className="mx-2 text-neutral-300">|</span>
                        <span>{order.restaurantName}</span>
                      </CardTitle>
                      <p className="text-sm text-neutral-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                        statusColors[order.status].bg,
                        statusColors[order.status].text
                      )}>
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {getStatusLabel(order.status)}
                      </span>
                      
                      {/* Only show cancel button for pending or confirmed orders */}
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-error-600 hover:bg-error-50"
                          onClick={() => handleCancelOrder(order)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Items */}
                    <div className="lg:w-2/3">
                      <h3 className="font-medium text-neutral-900 mb-3">Order Items</h3>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex justify-between items-start p-3 bg-neutral-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-neutral-800">
                                {item.quantity}x {item.menuItemName}
                              </p>
                              <p className="text-sm text-neutral-500 mt-1">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <p className="font-medium text-neutral-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="lg:w-1/3 space-y-4">
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">Delivery Address</h3>
                        <div className="flex items-start bg-neutral-50 p-3 rounded-lg">
                          <MapPin className="h-5 w-5 text-neutral-500 mt-0.5 mr-2" />
                          <p className="text-sm text-neutral-700">{order.deliveryAddress}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">Payment Method</h3>
                        <div className="flex items-center bg-neutral-50 p-3 rounded-lg">
                          <CreditCard className="h-5 w-5 text-neutral-500 mr-2" />
                          <p className="text-sm text-neutral-700">{order.paymentMethod}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-neutral-900 mb-2">Order Summary</h3>
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="space-y-1 mb-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Subtotal</span>
                              <span className="text-neutral-900">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Tax</span>
                              <span className="text-neutral-900">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-600">Delivery Fee</span>
                              <span className="text-neutral-900">${order.deliveryFee.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-neutral-200">
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span className="text-primary-500">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No orders found</h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? "Try adjusting your search or filters to find orders." 
              : "You haven't placed any orders yet."}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => navigate('/restaurants')}>
              Browse Restaurants
            </Button>
          )}
        </div>
      )}
      
      {/* Cancellation Modal */}
      {showCancellationModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="h-6 w-6 text-error-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Cancel Order</h3>
                  <p className="text-neutral-600 mt-1">
                    Are you sure you want to cancel your order from {selectedOrder.restaurantName}?
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="cancellationReason" className="block text-sm font-medium text-neutral-700 mb-1">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowCancellationModal(false);
                    setSelectedOrder(null);
                    setCancellationReason('');
                  }}
                >
                  Keep Order
                </Button>
                <Button 
                  variant="danger"
                  onClick={confirmCancelOrder}
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;