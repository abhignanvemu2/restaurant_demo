import { Outlet, Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary-500" />
            <span className="text-xl font-bold text-neutral-900">CuisineConnect</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4 text-center text-neutral-500 text-sm">
          © {new Date().getFullYear()} CuisineConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;