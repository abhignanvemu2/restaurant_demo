import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star,
  Info,
  Plus,
  Flame,
  Leaf,
  Minus,
  X
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { useTranslator } from '../hooks/useTranslator';
import { restaurantAPI, menuAPI } from '../services/api';
import { MenuItem, Restaurant } from '../types';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { t } = useTranslator();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch restaurant details
        const restaurantData = await restaurantAPI.getById(id);
        
        // Fetch menu items
        const menuData = await menuAPI.getByRestaurant(id);
        
        // Extract unique categories
        const uniqueCategories: any = Array.from(
          new Set(menuData.map((item: MenuItem) => item.category))
        );
        
        setRestaurant(restaurantData);
        setMenuItems(menuData);
        setCategories(uniqueCategories);
        setActiveCategory(uniqueCategories[0] || '');
      } catch (error: any) {
        console.error('Failed to load restaurant data:', error);
        const message = error.response?.data?.message || 'Failed to load restaurant';
        toast.error(message);
        navigate('/restaurants');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRestaurantData();
  }, [id, navigate, user]);

  const handleAddToCart = async () => {
    if (!selectedItem) return;
    
    setAddingToCart(true);
    
    try {
      await addItem(selectedItem._id, itemQuantity, specialInstructions.trim() || undefined);
      
      // Reset modal state
      setSelectedItem(null);
      setItemQuantity(1);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };
  
  const renderSpicyLevel = (level: number) => {
    return (
      <div className="flex items-center">
        {Array(3).fill(0).map((_, index) => (
          <Flame 
            key={index}
            size={14}
            className={cn(
              "mr-0.5",
              index < level ? "text-error-500" : "text-neutral-200"
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-primary-500 text-xl font-semibold">
          {t('loading')}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-800 mb-2">Restaurant not found</h2>
          <Button onClick={() => navigate('/restaurants')}>
            Back to {t('restaurants')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/restaurants')}
        className="flex items-center text-neutral-600 hover:text-primary-600 mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to {t('restaurants')}
      </button>
      
      {/* Restaurant Header */}
      <div className="relative h-64 rounded-lg overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 z-10" />
        <img 
          src={restaurant.coverImage} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-start">
            <img 
              src={restaurant.logo} 
              alt={`${restaurant.name} logo`}
              className="w-16 h-16 rounded-lg object-cover border-2 border-white mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-warning-500 text-warning-500" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Country Restriction Warning */}
      {user?.country && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 mb-6 flex items-center text-sm">
          <Info className="h-4 w-4 text-primary-500 mr-2" />
          <p className="text-primary-700">
            You are viewing a restaurant in {restaurant.country}. Orders are only available within your country.
          </p>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64 bg-white rounded-lg border border-neutral-200 overflow-hidden h-fit sticky top-20">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">{t('menu')} Categories</h2>
          </div>
          <div className="p-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "w-full text-left p-3 rounded-md transition-colors text-sm font-medium",
                  activeCategory === category
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="flex-grow space-y-8">
          {categories.map((category) => (
            <div 
              key={category} 
              id={category.toLowerCase().replace(/\s+/g, '-')}
              className={activeCategory === category ? '' : 'hidden lg:block'}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-4">{category}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems
                  .filter(item => item.category === category)
                  .map((item) => (
                    <Card 
                      key={item._id} 
                      className="overflow-hidden hover:shadow-card-hover transition-all duration-200"
                      hoverable
                    >
                      <div className="flex">
                        <div className="flex-grow p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-neutral-900">{item.name}</h3>
                            <span className="text-primary-500 font-medium">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1 mb-2">
                            {item.vegetarian && (
                              <span className="inline-flex items-center text-xs text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
                                <Leaf className="h-3 w-3 mr-1" />
                                {t('vegetarian')}
                              </span>
                            )}
                            
                            {item.spicyLevel > 0 && (
                              <span className="inline-flex items-center text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                                {renderSpicyLevel(item.spicyLevel)}
                              </span>
                            )}
                            
                            {item.popular && (
                              <span className="inline-flex items-center text-xs text-warning-700 bg-warning-50 px-2 py-0.5 rounded-full">
                                <Star className="h-3 w-3 mr-1 fill-warning-500" />
                                {t('popular')}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          
                          <Button 
                            size="sm"
                            leftIcon={<Plus className="h-4 w-4" />}
                            onClick={() => setSelectedItem(item)}
                          >
                            {t('add_to_cart')}
                          </Button>
                        </div>
                        
                        <div className="w-32 h-32">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add to Cart Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-neutral-700 hover:text-neutral-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-neutral-900">{selectedItem.name}</h3>
                <span className="text-primary-500 font-medium">${selectedItem.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                {selectedItem.vegetarian && (
                  <span className="inline-flex items-center text-xs text-success-700 bg-success-50 px-2 py-0.5 rounded-full">
                    <Leaf className="h-3 w-3 mr-1" />
                    {t('vegetarian')}
                  </span>
                )}
                
                {selectedItem.spicyLevel > 0 && (
                  <span className="inline-flex items-center text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {t('spicy_level')}: {renderSpicyLevel(selectedItem.spicyLevel)}
                  </span>
                )}
              </div>
              
              <p className="text-neutral-600 mb-4">
                {selectedItem.description}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('quantity')}
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="p-2 border border-neutral-300 rounded-l-md text-neutral-700 hover:bg-neutral-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <div className="w-12 h-10 flex items-center justify-center border-t border-b border-neutral-300">
                    {itemQuantity}
                  </div>
                  
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="p-2 border border-neutral-300 rounded-r-md text-neutral-700 hover:bg-neutral-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-neutral-700 mb-1">
                  {t('special_instructions')} (Optional)
                </label>
                <textarea
                  id="specialInstructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests?"
                  rows={3}
                  className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="flex justify-between items-center font-medium text-lg mb-4">
                <span>{t('total')}:</span>
                <span className="text-primary-500">${(selectedItem.price * itemQuantity).toFixed(2)}</span>
              </div>
              
              <Button
                fullWidth
                onClick={handleAddToCart}
                isLoading={addingToCart}
              >
                {t('add_to_cart')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;