import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  MapPin,
  Mail,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockUsers } from '../../mocks/users';
import { User, UserRole } from '../../types';
import { cn } from '../../utils/cn';

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [countryFilter, setCountryFilter] = useState<'all' | 'India' | 'America'>('all');
  
  useEffect(() => {
    // Simulate API fetch
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setUsers(mockUsers);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to load users:', error);
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesCountry = countryFilter === 'all' || user.country === countryFilter;
    
    return matchesSearch && matchesRole && matchesCountry;
  });
  
  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };
  
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-primary-100 text-primary-800';
      case 'manager':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Manage Users</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Add User
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
                  placeholder="Search users by name or email"
                  className="w-full py-2 pl-10 pr-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className="w-full md:w-auto py-2 px-4 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="member">Member</option>
              </select>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value as 'all' | 'India' | 'America')}
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
      
      {/* Users List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div className="flex-grow">
                  <div className="h-6 bg-neutral-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-lg font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getRoleBadgeClass(user.role)
                          )}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                          <div className="flex items-center text-xs text-neutral-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {user.country}
                          </div>
                          <div className="flex items-center text-xs text-neutral-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
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
                          onClick={() => handleDeleteUser(user.id)}
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
          <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-800 mb-2">No users found</h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || roleFilter !== 'all' || countryFilter !== 'all'
              ? "Try adjusting your search or filters."
              : "Add your first user to get started."}
          </p>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add User
          </Button>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;