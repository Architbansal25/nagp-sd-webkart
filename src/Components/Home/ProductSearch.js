import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Store all products
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all products once when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:9091/products");
        if (response.status === 200 && Array.isArray(response.data)) {
          setProducts(response.data); // Store all products in state
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Handle search input change
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    // Perform search on locally stored products
    const filtered = products.filter(product =>
      product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    setFilteredSuggestions(filtered);
  }, [searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectSuggestion = (product) => {
    setSearchQuery("");
    setFilteredSuggestions([]); // Hide suggestions
    navigate(`/product/${product.productId}`); // Redirect to product details page
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

      {loading && <p className="absolute mt-1 text-gray-500 text-sm">Loading products...</p>}

      {filteredSuggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50">
          {filteredSuggestions.map((product) => (
            <li
              key={product.productId}
              onClick={() => handleSelectSuggestion(product)}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-900"
            >
              {product.name}
            </li>
          ))}
        </ul>
      ) : searchQuery.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 z-50 p-4 text-gray-500">
          No products found
        </div>
      )}

    </div>
  );
}
