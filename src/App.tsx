import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePaymentMethods from './pages/admin/ManagePaymentMethods';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import RoleGuard from './components/guards/RoleGuard';

function App() {
  const { user, initialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const publicRoutes = ['/login', '/register'];
    if (initialized && !user && !publicRoutes.includes(location.pathname)) {
      navigate('/login');
    }
  }, [initialized, user, navigate]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-pulse text-primary-500 text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            
            {/* Routes accessible to Admins and Managers */}
            <Route element={<RoleGuard allowedRoles={['admin', 'manager']} />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
            
            <Route path="/profile" element={<Profile />} />
            
            {/* Admin Routes */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/restaurants" element={<ManageRestaurants />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/payment-methods" element={<ManagePaymentMethods />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;