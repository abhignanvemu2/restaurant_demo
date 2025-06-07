import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Utensils, 
  ShoppingBag, 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useTranslator } from '../../hooks/useTranslator';
import LanguageToggle from '../ui/LanguageToggle';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar = ({ onCartClick }: NavbarProps) => {
  const { user, logout } = useAuthStore();
  const { items, fetchCart } = useCartStore();
  const { t } = useTranslator();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch cart when user is available
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isProfileOpen && !(e.target as Element).closest('#profile-menu')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isProfileOpen]);

  // Close dropdowns when changing routes
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('restaurants'), path: '/restaurants' },
  ];
  
  // Add role-specific nav links
  if (user) {
    if (['admin', 'manager'].includes(user.role)) {
      navLinks.push({ name: t('orders'), path: '/orders' });
    }
    
    if (user.role === 'admin') {
      navLinks.push({ name: t('admin'), path: '/admin' });
    }
  }
  
  const cartItemCount = items.length;

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled 
          ? "bg-white shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary-500" />
            <span className={cn(
              "text-xl font-bold transition-colors duration-200",
              isScrolled ? "text-neutral-900" : "text-primary-600"
            )}>
              CuisineConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-primary-500",
                  location.pathname === link.path 
                    ? "text-primary-500" 
                    : isScrolled ? "text-neutral-700" : "text-neutral-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Toggle */}
            <LanguageToggle />

            {user ? (
              <>
                {/* Cart Button */}
                <button 
                  onClick={onCartClick}
                  className="relative p-2 text-neutral-600 hover:text-primary-500 transition-colors"
                  aria-label={t('cart')}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" id="profile-menu">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-primary-500 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        {t('profile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-700 hover:text-primary-500"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {t('signup')}
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-primary-500 hover:bg-neutral-100 focus:outline-none md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 animate-slide-down">
          <div className="container mx-auto px-4 pt-2 pb-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "py-2 text-base font-medium transition-colors duration-200",
                    location.pathname === link.path 
                      ? "text-primary-500" 
                      : "text-neutral-700 hover:text-primary-500"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;