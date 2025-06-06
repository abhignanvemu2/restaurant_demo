import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Package, 
  DollarSign,
  BarChart4
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockRestaurants } from '../../mocks/restaurants';
import { mockUsers } from '../../mocks/users';

// Mock data for dashboard
const mockStats = {
  totalOrders: 186,
  totalRevenue: 4328.75,
  averageOrderValue: 23.27,
  activeUsers: 42,
  pendingOrders: 8
};

const mockRecentOrders = [
  { id: 'order-101', restaurant: 'Spice Garden', customer: 'John D.', total: 28.45, status: 'delivered' },
  { id: 'order-102', restaurant: 'Burger Kingdom', customer: 'Sarah M.', total: 19.99, status: "out for delivery" },
  { id: 'order-103', restaurant: 'American Diner', customer: 'Michael B.', total: 32.50, status: 'preparing' },
  { id: 'order-104', restaurant: 'Taj Mahal', customer: 'Lisa W.', total: 45.20, status: 'confirmed' },
  { id: 'order-105', restaurant: 'South Indian Delights', customer: 'Robert J.', total: 24.75, status: 'pending' }
];

// Mock chart data
const mockOrdersChartData = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [65, 78, 52, 91, 84, 110]
};

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setRestaurantCount(mockRestaurants.length);
          setUserCount(mockUsers.length);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: 'bg-neutral-100 text-neutral-700',
      confirmed: 'bg-primary-100 text-primary-700',
      preparing: 'bg-warning-100 text-warning-700',
      "out for delivery": 'bg-info-100 text-info-700',
      delivered: 'bg-success-100 text-success-700',
      cancelled: 'bg-error-100 text-error-700'
    };
    
    return statusColors[status] || 'bg-neutral-100 text-neutral-700';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
        <div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            leftIcon={<Calendar className="h-4 w-4" />}
          >
            Last 30 Days
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
            </div>
          ))
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Orders</p>
                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalOrders}</h3>
                  </div>
                  <div className="p-3 bg-primary-100 rounded-full">
                    <Package className="h-6 w-6 text-primary-500" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>12% increase</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">${stats.totalRevenue.toFixed(2)}</h3>
                  </div>
                  <div className="p-3 bg-success-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-success-500" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-success-600 mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>8% increase</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Restaurants</p>
                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">{restaurantCount}</h3>
                  </div>
                  <div className="p-3 bg-warning-100 rounded-full">
                    <Store className="h-6 w-6 text-warning-500" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-neutral-600 mt-2">
                  <Link to="/admin/restaurants" className="text-primary-500 hover:underline">
                    Manage Restaurants
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Users</p>
                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">{userCount}</h3>
                  </div>
                  <div className="p-3 bg-info-100 rounded-full">
                    <Users className="h-6 w-6 text-info-500" />
                  </div>
                </div>
                <div className="flex items-center text-sm text-neutral-600 mt-2">
                  <Link to="/admin/users" className="text-primary-500 hover:underline">
                    Manage Users
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader className="border-b border-neutral-200">
            <CardTitle className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-primary-500" />
              Orders Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-primary-500">Loading chart...</div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  {/* In a real app, this would be a chart component */}
                  <BarChart4 className="h-12 w-12 mx-auto text-neutral-300 mb-2" />
                  <p>Orders trend chart would display here</p>
                  <p className="text-sm text-neutral-400 mt-1">Last 6 months data</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader className="border-b border-neutral-200">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary-500" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="animate-pulse flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-200 rounded w-24"></div>
                      <div className="h-3 bg-neutral-200 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-neutral-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-neutral-900">{order.restaurant}</p>
                        <div className="flex items-center text-sm text-neutral-500 mt-1">
                          <span>#{order.id.split('-')[1]}</span>
                          <span className="mx-1">•</span>
                          <span>{order.customer}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-medium">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="p-4 border-t border-neutral-200">
              <Link
                to="/orders"
                className="text-primary-500 text-sm font-medium hover:underline flex items-center justify-center"
              >
                View All Orders
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="flex items-center">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/admin/restaurants">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
                <Store className="h-6 w-6 mx-auto text-primary-500 mb-2" />
                <span className="font-medium text-neutral-900">Manage Restaurants</span>
              </div>
            </Link>
            <Link to="/admin/users">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
                <Users className="h-6 w-6 mx-auto text-primary-500 mb-2" />
                <span className="font-medium text-neutral-900">Manage Users</span>
              </div>
            </Link>
            <Link to="/admin/payment-methods">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
                <CreditCard className="h-6 w-6 mx-auto text-primary-500 mb-2" />
                <span className="font-medium text-neutral-900">Payment Methods</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;