import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Page Not Found</h2>
      <p className="text-neutral-600 mb-6 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Go Back
        </Button>
        <Button 
          onClick={() => navigate('/')}
          leftIcon={<Home className="h-4 w-4" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;