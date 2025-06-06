import { Link } from 'react-router-dom';
import { 
  Utensils, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company information */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Utensils className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold text-neutral-900">CuisineConnect</span>
            </Link>
            <p className="text-neutral-600 mb-4">
              Connecting food lovers with their favorite cuisines. Order delicious meals from top restaurants in your area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-neutral-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-neutral-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-600 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-neutral-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5" />
                <span className="text-neutral-600">
                  123 Food Street, Culinary District, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <span className="text-neutral-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-500" />
                <span className="text-neutral-600">support@cuisineconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} CuisineConnect. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-neutral-500 hover:text-primary-500 text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-500 text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-500 text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;