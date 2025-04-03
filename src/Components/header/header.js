import { FaGlobe } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ProductSearch from "../Home/ProductSearch";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const disabledRoutes = ['/cart', '/wishlist', '/login', '/signup'];

  const isDisableSearchPage = disabledRoutes.includes(location.pathname);

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        
        {/* Left Section: Logo */}
        <div className="lg:flex-none">
          <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <FaGlobe className="text-blue-500 text-xl" />
            <p className="text-lg font-semibold text-gray-900">WebKart</p>
          </Link>
        </div>

        {/* Center Section: Navigation & Search */}
        <div className="flex-1 flex items-center space-x-6 justify-center">
          <Link to="/products" className="text-sm font-semibold text-gray-900">Products</Link>
          <Link to="/categories" className="text-sm font-semibold text-gray-900">Categories</Link>
          <Link to="/about" className="text-sm font-semibold text-gray-900">About</Link>

          {/* Search Box with Dropdown */}
          {!isDisableSearchPage && (
            <div className="relative">
              <ProductSearch />
            </div>
          )}
        </div>

        {/* Right Section: Icons & Login */}
        <div className="flex items-center space-x-4">
          <Link to="/wishlist" className="text-gray-700 hover:text-gray-900">
            <FaRegHeart className="text-xl" />
          </Link>
          <Link to = "/cart" className="text-gray-700 hover:text-gray-900">
            <AiOutlineShoppingCart className="text-xl" />
          </Link>
          <Link to="/login" className="text-sm font-semibold text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
