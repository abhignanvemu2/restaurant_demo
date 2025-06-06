import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin,
  Clock,
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils/cn';
import { restaurantAPI } from '../services/api';
import { Restaurant } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // API fetch
    const loadRestaurants = async () => {
      setIsLoading(true);
      try {
        const data : Restaurant[] = await restaurantAPI.getAll(user?.country);
        setFeaturedRestaurants(data)
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load restaurants:', error);
        setIsLoading(false);
      }
    };
    
    loadRestaurants();
  }, [user]);
  
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    navigate(`/restaurants?search=${searchQuery}`);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mt-20 h-[500px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/80 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600')" 
          }}
        />
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Delicious Food, Delivered to Your Door
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Order from your favorite restaurants with just a few clicks. 
              Fast delivery, great taste.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex">
                <div className="relative flex-grow">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for food or restaurants"
                    className="w-full py-3 pl-12 pr-4 rounded-l-lg border-0 focus:ring-2 focus:ring-primary-500 outline-none text-neutral-800"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="rounded-l-none"
                  leftIcon={<Search className="h-4 w-4" />}
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      {/* Country-Specific Message */}
      {user?.country && (
        <section className="container mx-auto px-4">
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-center">
            <MapPin className="h-5 w-5 text-primary-500 mr-2" />
            <p className="text-primary-700">
              <span className="font-medium">Location:</span> Showing restaurants available in {user.country}
            </p>
          </div>
        </section>
      )}
      
      {/* Featured Restaurants */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Featured Restaurants</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/restaurants')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-neutral-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-neutral-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  <div className="h-4 bg-neutral-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Card 
                key={restaurant._id} 
                className="overflow-hidden transition-all duration-200 hover:shadow-card-hover"
                hoverable
              >
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${restaurant.coverImage})` }}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-white text-primary-500 text-xs font-semibold px-2 py-1 rounded">
                        {restaurant.rating.toFixed(1)} ★
                      </span>
                      <span className="text-white text-xs font-medium">
                        {restaurant.cuisine.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-neutral-900 line-clamp-1">{restaurant.name}</h3>
                    <span className="text-sm text-neutral-500">{restaurant.priceRange}</span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-neutral-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    >
                      View Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
            <UtensilsCrossed className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-800 mb-2">No restaurants found</h3>
            <p className="text-neutral-600 mb-6">
              {user?.country 
                ? `We couldn't find any restaurants in ${user.country}.` 
                : "We couldn't find any restaurants. Please try again later."}
            </p>
            {user?.role === 'admin' && (
              <Button onClick={() => navigate('/admin/restaurants')}>
                Add Restaurants
              </Button>
            )}
          </div>
        )}
      </section>
      
      {/* How It Works */}
      <section className="bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-10">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-10 w-10 text-primary-500" />,
                title: 'Find Restaurants',
                description: 'Discover restaurants in your area serving delicious food.'
              },
              {
                icon: <UtensilsCrossed className="h-10 w-10 text-primary-500" />,
                title: 'Choose Your Meal',
                description: 'Browse menus and select your favorite dishes to order.'
              },
              {
                icon: <MapPin className="h-10 w-10 text-primary-500" />,
                title: 'Fast Delivery',
                description: 'Get your food delivered quickly to your doorstep.'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "bg-white rounded-lg p-6 text-center relative shadow-sm",
                  "transform transition-transform duration-300 hover:-translate-y-1"
                )}
              >
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-primary-50 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-primary-500 rounded-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Hungry? We've got you covered!
              </h2>
              <p className="text-primary-50 mb-6">
                Start ordering your favorite meals from the best restaurants near you.
                Fast delivery, easy payment, and delicious food await!
              </p>
              <div>
                <Button
                  onClick={() => navigate('/restaurants')}
                  className="bg-white text-primary-600 hover:bg-primary-50"
                >
                  Order Now
                </Button>
              </div>
            </div>
            <div 
              className="lg:w-1/2 h-60 lg:h-auto bg-cover bg-center"
              style={{ 
                backgroundImage: "url('https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;