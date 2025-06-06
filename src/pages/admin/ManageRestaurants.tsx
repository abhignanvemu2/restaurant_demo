import { useState, useEffect } from 'react';
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Star,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Restaurant } from '../../types';
import { restaurantAPI } from '../../services/api';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<'all' | 'India' | 'America'>('all');
  
  useEffect(() => {
    // Simulate API fetch
    const loadRestaurants = async () => {
      setIsLoading(true);
      try {
        const getRestaurants: Restaurant[] = await restaurantAPI.getAll()
        setTimeout(() => {
          setRestaurants(getRestaurants);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load restaurants:', error);
        setIsLoading(false);
      }
    };
    
    loadRestaurants();
  }, []);
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCountry = selectedCountry === 'all' || restaurant.country === selectedCountry;
    
    return matchesSearch && matchesCountry;
  });
  
  const handleDeleteRestaurant = (restaurantId: string) => {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      setRestaurants(prev => prev.filter(r => r._id !== restaurantId));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Manage Restaurants</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add Restaurant
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants by name or cuisine"
                  className="w-full py-2 pl-10 pr-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as 'all' | 'India' | 'America')}
                className="w-full md:w-auto py-2 px-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Countries</option>
                <option value="India">India</option>
                <option value="America">America</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Restaurants List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                <div className="flex-grow">
                  <div className="h-6 bg-neutral-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img 
                    src={restaurant.logo} 
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-warning-500 fill-warning-500 mr-1" />
                            {restaurant.rating.toFixed(1)}
                          </div>
                          <span>•</span>
                          <span>{restaurant.priceRange}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {restaurant.country}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {restaurant.cuisine.map((type, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-error-600 hover:bg-error-50"
                          leftIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => handleDeleteRestaurant(restaurant._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <Store className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No restaurants found</h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || selectedCountry !== 'all'
              ? "Try adjusting your search or filters."
              : "Add your first restaurant to get started."}
          </p>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Restaurant
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;