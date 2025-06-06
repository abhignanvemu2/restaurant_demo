import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickLogins = [
    { email: 'admin@example.com', password: 'password123', role: 'Admin' },
    { email: 'manager@example.com', password: 'password123', role: 'Manager' },
    { email: 'member@example.com', password: 'password123', role: 'Member' }
  ];
  
  const handleQuickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Quick login failed. Please try manual login.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Login to CuisineConnect</CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-error-50 text-error-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            leftIcon={isLoading ? <Loader className="animate-spin" /> : <LogIn />}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        {/* Demo Quick Login Section */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Demo Quick Login</h4>
          <div className="space-y-2">
            {quickLogins.map((login, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(login.email, login.password)}
                disabled={isLoading}
                className="w-full p-2 text-sm border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors flex justify-between items-center"
              >
                <span>{login.role}</span>
                <span className="text-neutral-500 text-xs">{login.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            *For demonstration purposes only
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-neutral-200 p-4">
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;