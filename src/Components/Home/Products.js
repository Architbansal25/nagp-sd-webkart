import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServiceUnavailable from "../SystemError/ServiceUnavailable";
import LoadBubbleEffect from "../Effects/LoadBubbleEffect";
const Product = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]); // Store unique brands
  const [systemError, setSystemError] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const backendUrl = "a03ca4bfe8f9349dd913e64221f7c0a8-699713062.ap-south-1.elb.amazonaws.com";

  // Extract category from URL query
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`http://${backendUrl}/products`);
      const data = await response.json();
      if (data.length > 0) {
        setProducts(data);

        // Filter products based on category if selected
        let categoryFilteredProducts = data;
        if (selectedCategory) {
          categoryFilteredProducts = data.filter((product) =>
            product.categories?.includes(selectedCategory)
          );
        }

        // Extract unique brands (all brands if no category, else category-specific brands)
        const uniqueBrands = [...new Set(categoryFilteredProducts.map((product) => product.brand))];
        setBrands(uniqueBrands);
        setLoading(false);
      }
    } catch (err) {
      setSystemError(true);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]); // Refetch products when category changes

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Filter Products by Selected Brands
  let filteredProducts = products.filter((product) =>
    selectedCategory ? product.categories?.includes(selectedCategory) : true
  );

  filteredProducts = filteredProducts.filter(
    (product) => selectedBrands.length === 0 || selectedBrands.includes(product.brand)
  );

  // Sort Products Based on Selected Option
  if (sortOption === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "mostBought") {
    filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  if (systemError) {
    return <ServiceUnavailable />;
  }
  if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <LoadBubbleEffect />
          </div>
        );
      }
  return (
    <div className="flex p-6">
      {/* Left Sidebar - Filters */}
      <aside className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-md font-semibold">Brand</h3>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  onChange={() =>
                    setSelectedBrands((prev) =>
                      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
                    )
                  }
                  checked={selectedBrands.includes(brand)}
                />
                <span>{brand}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-2">No brands available</p>
          )}
        </div>

        {/* Sorting Options */}
        <div>
          <h3 className="text-md font-semibold">Sort By</h3>
          <select
            className="w-full p-2 border rounded mt-2"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Select</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
            <option value="mostBought">Most Bought</option>
          </select>
        </div>
      </aside>

      {/* Right Section - Products */}
      <section className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.productId}
              className="border p-4 rounded-lg shadow-lg flex flex-col justify-between cursor-pointer"
              onClick={() => handleProductClick(product.productId)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-contain rounded-md"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.brand}</p>
                <div className="mt-2">
                  {product.rating ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                      ({product.rating}) ★
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600 italic">No reviews</span>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <span className="text-xl font-bold">Rs. {product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                      Rs. {product.originalPrice}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-red-500 text-sm font-semibold ml-2">
                      ({product.discount})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found.
          </p>
        )}
      </section>
    </div>
  );
};

export default Product;
