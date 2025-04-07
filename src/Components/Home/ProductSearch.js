import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl =
    "a03ca4bfe8f9349dd913e64221f7c0a8-699713062.ap-south-1.elb.amazonaws.com";

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `http://${backendUrl}/search/name?name=${encodeURIComponent(searchQuery)}`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setSuggestions(response.data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setSuggestions([]);
      }
      setLoading(false);
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // Debounce for better UX
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSuggestion = (product) => {
    setSearchQuery("");
    setSuggestions([]);
    navigate(`/product/${product.productId}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border p-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <p className="absolute mt-1 text-gray-500 text-sm">Searching...</p>
      )}

      {suggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <li
              key={product.productId}
              onClick={() => handleSelectSuggestion(product)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
            >
              {product.name}
            </li>
          ))}
        </ul>
      ) : (
        searchQuery.length > 0 &&
        !loading && (
          <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50 p-4 text-gray-500">
            No products found
          </div>
        )
      )}
    </div>
  );
}
