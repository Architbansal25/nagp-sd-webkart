import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../Config/constants";

function highlightMatch(text, query) {
  if (!query.trim()) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <strong className="font-bold text-gray-900">{text.slice(index, index + query.length)}</strong>
      {text.slice(index + query.length)}
    </>
  );
}

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const backendUrl = BACKEND_URL;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        setActiveIndex(-1);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);
      try {
        const response = await axios.get(
          `http://${backendUrl}/search/name?name=${encodeURIComponent(searchQuery)}`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 3));
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setSuggestions([]);
      }
      setLoading(false);
      setActiveIndex(-1);
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSuggestion = (product) => {
    setSearchQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    navigate(`/product/${product.productId}`);
  };

  const navigateToSearchResults = () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();
    setSearchQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    setIsOpen(false);
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  // total items = suggestions + 1 "View all" row
  const totalItems = suggestions.length + (suggestions.length > 0 ? 1 : 0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        navigateToSearchResults();
      }
      return;
    }

    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev < totalItems - 1 ? prev + 1 : 0;
        scrollItemIntoView(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => {
        const next = prev > 0 ? prev - 1 : totalItems - 1;
        scrollItemIntoView(next);
        return next;
      });
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
      setIsOpen(false);
    }
  };

  const scrollItemIntoView = (index) => {
    if (listRef.current) {
      const item = listRef.current.children[index];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  };

  const showDropdown = isOpen && suggestions.length > 0;
  const showNoResults = isOpen && searchQuery.length > 0 && !loading && suggestions.length === 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          className="p-2 w-56 focus:outline-none text-sm"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
        />
        <button
          onClick={navigateToSearchResults}
          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
          </svg>
        </button>
      </div>

      {loading && (
        <p className="absolute mt-1 text-gray-500 text-sm bg-white px-3 py-1 border border-gray-200 rounded shadow z-50">
          Searching...
        </p>
      )}

      {showDropdown && (
        <ul
          ref={listRef}
          className="absolute left-0 right-0 bg-white border border-gray-300 shadow-lg rounded-md mt-1 z-50 max-h-72 overflow-y-auto"
          role="listbox"
        >
          {suggestions.map((product, index) => (
            <li
              id={`suggestion-${index}`}
              key={product.productId}
              onMouseDown={() => handleSelectSuggestion(product)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-gray-800 text-sm ${
                activeIndex === index ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              role="option"
              aria-selected={activeIndex === index}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt=""
                  className="w-8 h-8 object-contain flex-shrink-0 rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate">{highlightMatch(product.name, searchQuery)}</p>
                {product.price && (
                  <p className="text-xs text-gray-500">Rs. {product.price}</p>
                )}
              </div>
            </li>
          ))}
          <li
            id={`suggestion-${suggestions.length}`}
            onMouseDown={navigateToSearchResults}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer text-blue-600 font-medium text-sm border-t border-gray-200 ${
              activeIndex === suggestions.length ? "bg-blue-50" : "hover:bg-gray-50"
            }`}
            role="option"
            aria-selected={activeIndex === suggestions.length}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z" />
            </svg>
            See all results for "{searchQuery}"
          </li>
        </ul>
      )}

      {showNoResults && (
        <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50 px-4 py-3 text-sm text-gray-500">
          No products found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
