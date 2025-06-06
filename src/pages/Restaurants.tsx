import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Filter,
  Clock,
  Star,
  Utensils
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { cn } from '../utils/cn';
import { mockRestaurants } from '../mocks/restaurants';
import { Restaurant } from '../types';
import { restaurantAPI } from '../services/api';

const Restaurants = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const initialSearchQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get unique cuisines from all restaurants
  const allCuisines = Array.from(
    new Set(
      mockRestaurants.flatMap(restaurant => restaurant.cuisine)
    )
  );
  
  // Get unique price ranges
  const allPriceRanges = Array.from(
    new Set(
      mockRestaurants.map(restaurant => restaurant.priceRange)
    )
  );

  useEffect(() => {
    // API fetch 
    const loadRestaurants = async () => {
      setIsLoading(true);
      try {
      const data : Restaurant[] = await restaurantAPI.getAll(user?.country);
      setRestaurants(data);
      setIsLoading(false);
      } catch (error) {
        console.error('Failed to load restaurants:', error);
        setIsLoading(false);
      }
    };
    
    loadRestaurants();
  }, [user]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...restaurants];
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
          restaurant.cuisine.some(c => c.toLowerCase().includes(lowerCaseQuery))
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter.length > 0) {
      result = result.filter(
        restaurant => restaurant.cuisine.some(c => cuisineFilter.includes(c))
      );
    }
    
    // Apply price filter
    if (priceFilter.length > 0) {
      result = result.filter(restaurant => priceFilter.includes(restaurant.priceRange));
    }
    
    // Apply rating filter
    if (ratingFilter !== null) {
      result = result.filter(restaurant => restaurant.rating >= ratingFilter);
    }
    
    setFilteredRestaurants(result);
  }, [restaurants, searchQuery, cuisineFilter, priceFilter, ratingFilter]);
  
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    // Update URL to include search query
    navigate(`/restaurants?search=${searchQuery}`);
  };
  
  const toggleCuisineFilter = (cuisine: string) => {
    setCuisineFilter(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine) 
        : [...prev, cuisine]
    );
  };
  
  const togglePriceFilter = (price: string) => {
    setPriceFilter(prev => 
      prev.includes(price) 
        ? prev.filter(p => p !== price) 
        : [...prev, price]
    );
  };
  
  const handleRatingFilter = (rating: number) => {
    setRatingFilter(prev => prev === rating ? null : rating);
  };
  
  const clearFilters = () => {
    setCuisineFilter([]);
    setPriceFilter([]);
    setRatingFilter(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-primary-500 -mx-4 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">Restaurants</h1>
          
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by restaurant name or cuisine"
                  className="w-full py-3 pl-12 pr-4 rounded-l-lg border-0 focus:ring-2 focus:ring-primary-300 outline-none text-neutral-800"
                />
              </div>
              <Button 
                type="button"
                variant="secondary" 
                className="rounded-none border-l border-neutral-200"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filters
              </Button>
              <Button 
                type="submit" 
                className="rounded-l-none"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={cn(
          "lg:w-64 bg-white rounded-lg border border-neutral-200 overflow-hidden h-fit sticky top-20",
          !showFilters && "hidden lg:block"
        )}>
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-semibold text-neutral-900">Filters</h2>
            <button 
              onClick={clearFilters}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              Clear All
            </button>
          </div>
          
          {/* Cuisine Filter */}
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-medium text-neutral-800 mb-3">Cuisine</h3>
            <div className="space-y-2">
              {allCuisines.map((cuisine) => (
                <label key={cuisine} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cuisineFilter.includes(cuisine)}
                    onChange={() => toggleCuisineFilter(cuisine)}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-700">{cuisine}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range Filter */}
          <div className="p-4 border-b border-neutral-200">
            <h3 className="font-medium text-neutral-800 mb-3">Price Range</h3>
            <div className="space-y-2">
              {allPriceRanges.map((price) => (
                <label key={price} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={priceFilter.includes(price)}
                    onChange={() => togglePriceFilter(price)}
                    className="rounded text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-neutral-700">{price}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="p-4">
            <h3 className="font-medium text-neutral-800 mb-3">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingFilter(rating)}
                  className={cn(
                    "flex items-center w-full py-1 px-2 rounded text-sm",
                    ratingFilter === rating 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-neutral-700 hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={cn(
                          "mr-0.5",
                          index < rating 
                            ? "fill-warning-500 text-warning-500" 
                            : "text-neutral-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="ml-1">& Up</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Restaurant List */}
        <div className="flex-grow">
          {/* Location Info */}
          {user?.country && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3 mb-6 flex items-center text-sm">
              <MapPin className="h-4 w-4 text-primary-500 mr-2" />
              <p className="text-primary-700">
                Showing restaurants available in {user.country}
              </p>
            </div>
          )}
          
          {/* Results Count */}
          <div className="mb-4">
            <p className="text-neutral-700">
              {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
            </p>
          </div>
          
          {/* Restaurant Grid */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden animate-pulse"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 bg-neutral-200" />
                    <div className="p-4 space-y-3 flex-grow">
                      <div className="h-6 bg-neutral-200 rounded w-3/4" />
                      <div className="h-4 bg-neutral-200 rounded w-1/2" />
                      <div className="h-4 bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="space-y-4">
              {filteredRestaurants.map((restaurant) => (
                <Card 
                  key={restaurant.id} 
                  className="overflow-hidden transition-all duration-200 hover:shadow-card-hover"
                  hoverable
                >
                  <div className="flex flex-col sm:flex-row">
                    <div 
                      className="sm:w-48 h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${restaurant.coverImage})` }}
                    />
                    <CardContent className="p-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-lg text-neutral-900">{restaurant.name}</h3>
                        <span className="text-sm text-neutral-500">{restaurant.priceRange}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {restaurant.cuisine.map((type, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-50 text-primary-700"
                          >
                            <Utensils className="h-3 w-3 mr-1" />
                            {type}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center text-warning-500">
                            <Star className="h-4 w-4 mr-1 fill-warning-500" />
                            <span>{restaurant.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center text-neutral-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                        >
                          View Menu
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
              <Utensils className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">No restaurants found</h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your search or filters to find restaurants.
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurants;