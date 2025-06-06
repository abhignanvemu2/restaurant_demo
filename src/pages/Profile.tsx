import { useState, useEffect } from 'react';
import { User, Mail, MapPin, CreditCard, Clock, LogOut, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { UserCountry } from '../types';
import { cn } from '../utils/cn';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState<UserCountry>('India');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedChanges, setSavedChanges] = useState(false);
  
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    canceled: 0
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'payment-1',
      type: 'credit',
      cardBrand: 'Visa',
      lastFour: '4242',
      expiryDate: '12/25',
      name: 'Personal Card',
      isDefault: true
    }
  ]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setName(user.name);
    setEmail(user.email);
    setCountry(user.country);
    
    // fetching order stats
    setOrderStats({
      total: 12,
      completed: 10,
      canceled: 2
    });
  }, [user, navigate]);
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setSavedChanges(true);
      
      setTimeout(() => {
        setSavedChanges(false);
      }, 3000);
    }, 1000);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-primary-500 text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Profile</h1>
      
      {savedChanges && (
        <div className="bg-success-50 border border-success-200 text-success-700 p-4 rounded-lg mb-6 flex items-center">
          <Save className="h-5 w-5 mr-2" />
          Profile updated successfully.
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold mb-4">
                  {name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-neutral-900">{name}</h2>
                <p className="text-neutral-500 mb-1">{email}</p>
                <div className="flex items-center text-sm text-neutral-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {country}
                </div>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  user.role === 'admin' 
                    ? "bg-primary-100 text-primary-800" 
                    : user.role === 'manager'
                      ? "bg-success-100 text-success-800"
                      : "bg-neutral-100 text-neutral-800"
                )}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <p className="text-xs text-neutral-500 mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-neutral-200 pt-6">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-neutral-900">{orderStats.total}</p>
                  <p className="text-xs text-neutral-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-success-600">{orderStats.completed}</p>
                  <p className="text-xs text-neutral-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-error-600">{orderStats.canceled}</p>
                  <p className="text-xs text-neutral-500">Canceled</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary-500" />
                  Personal Information
                </CardTitle>
                <Button 
                  size="sm"
                  variant={isEditing ? "outline" : "secondary"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name\" className="block text-sm font-medium text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-neutral-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value as UserCountry)}
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="India">India</option>
                      <option value="America">America</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-1">
                      Changing your country will affect which restaurants are available to you.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Full Name</h3>
                    <p className="mt-1">{name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Email Address</h3>
                    <p className="mt-1">{email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Country</h3>
                    <p className="mt-1">{country}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500">Account Type</h3>
                    <p className="mt-1 capitalize">{user.role}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Payment Methods */}
          <Card>
            <CardHeader className="border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-500" />
                  Payment Methods
                </CardTitle>
                <Button 
                  size="sm"
                  variant="secondary"
                  disabled={!['admin'].includes(user.role)}
                >
                  Add New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {!['admin'].includes(user.role) ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-center">
                  <p className="text-neutral-600">
                    Only admin users can manage payment methods.
                  </p>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center text-neutral-700 mr-3">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {method.cardBrand} •••• {method.lastFour}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Expires {method.expiryDate}
                            {method.isDefault && (
                              <span className="ml-2 text-primary-600">Default</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-neutral-500"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-center">
                  <p className="text-neutral-600 mb-2">
                    You haven't added any payment methods yet.
                  </p>
                  <Button size="sm">Add Payment Method</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Order History */}
          <Card>
            <CardHeader className="border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary-500" />
                  Recent Orders
                </CardTitle>
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/orders')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 text-center">
                <p className="text-neutral-600">
                  Your recent orders will appear here.
                </p>
                <Button 
                  onClick={() => navigate('/restaurants')}
                  className="mt-3"
                  size="sm"
                >
                  Browse Restaurants
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Import useNavigate
import { useNavigate } from 'react-router-dom';

export default Profile;