import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartSidebar from '../components/cart/CartSidebar';
import { useState } from 'react';

const MainLayout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Navbar onCartClick={toggleCart} />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <Footer />
    </div>
  );
};

export default MainLayout;