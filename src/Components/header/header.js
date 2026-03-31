import { FaGlobe } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import ProductSearch from "../Home/ProductSearch";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const syncUsername = () => setUsername(localStorage.getItem("username"));
    window.addEventListener("loginStateChange", syncUsername);
    return () => window.removeEventListener("loginStateChange", syncUsername);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    setUsername(null);
    setShowDropdown(false);
    navigate("/login");
  };

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
          {username ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                {username}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
