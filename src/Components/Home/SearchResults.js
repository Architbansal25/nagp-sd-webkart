import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../Config/constants";
import LoadBubbleEffect from "../Effects/LoadBubbleEffect";

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = BACKEND_URL;

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    setSelectedBrands([]);
    setSortOption("");
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(
          `http://${backendUrl}/search/name?name=${encodeURIComponent(searchQuery)}`
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(true);
      }
      setLoading(false);
    };

    fetchResults();
  }, [searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  // Derived data
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  let filtered = products.filter(
    (p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand)
  );

  if (sortOption === "lowToHigh") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortOption === "topRated") {
    filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPageNumbers = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadBubbleEffect />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Something went wrong. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Results for <span className="text-blue-600">"{searchQuery}"</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
          {selectedBrands.length > 0 ? " (filtered)" : ""}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="w-52 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm sticky top-4">
              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sort By</h3>
                <select
                  className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Relevance</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="topRated">Top Rated</option>
                </select>
              </div>

              {/* Brand filter */}
              {brands.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Brand</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-blue-500"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                  {selectedBrands.length > 0 && (
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="mt-3 text-xs text-blue-500 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <section className="flex-1">
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginated.map((product) => (
                    <div
                      key={product.productId}
                      className="border p-4 rounded-lg shadow flex flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow duration-200"
                      onClick={() => handleProductClick(product.productId)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-44 object-contain rounded-md"
                      />
                      <div className="mt-3">
                        <h3 className="text-sm font-semibold leading-snug line-clamp-2">{product.name}</h3>
                        <p className="text-gray-500 text-xs mt-1">{product.brand}</p>
                        <div className="mt-2">
                          {product.rating ? (
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-md">
                              {product.rating} ★
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No reviews</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-baseline flex-wrap gap-1">
                          <span className="text-base font-bold">Rs. {product.price}</span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-xs">
                              Rs. {product.originalPrice}
                            </span>
                          )}
                          {product.discount && (
                            <span className="text-red-500 text-xs font-semibold">
                              {product.discount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
                    >
                      Prev
                    </button>
                    {getPageNumbers(currentPage, totalPages).map((page, i) =>
                      page === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded border text-sm ${
                            currentPage === page ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border text-sm disabled:opacity-40 hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 mt-8 text-center">
                No products match the selected filters.{" "}
                <button onClick={() => setSelectedBrands([])} className="text-blue-500 hover:underline">
                  Clear filters
                </button>
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0z"
            />
          </svg>
          <p className="text-lg font-medium">No products found for "{searchQuery}"</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
