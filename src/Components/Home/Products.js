import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DiscountImage from "../../assests/images/PImages/WomenKurta.png";
import ServiceUnavailable from "../SystemError/ServiceUnavailable";




const Product = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [sampleProducts, setProducts] = useState([]);
  const [SystemError, setSystemError] = useState(false);
 
  const fetchProducts = async () => {
    try{
      const response = await fetch("http://localhost:9091/products");
      const data = await response.json();
      if(data.length>0){

        setProducts(data);
        console.log(data);
      }
    }
    catch(err){
      //navigate("/error");
      //return (<div><ServiceUnavailable /></div>);
      setSystemError(true);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle Brand Filtering
  const handleBrandChange = (brand) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.includes(brand)
        ? prevBrands.filter((b) => b !== brand)
        : [...prevBrands, brand]
    );
  };

  // Handle Sorting
  const handleSortChange = (option) => {
    setSortOption(option);
  };
  if(SystemError){
    return (<div><ServiceUnavailable /></div>);
  }

  // Filter Products Based on Selected Brands
  let filteredProducts = sampleProducts.filter(
    (product) =>
      selectedBrands.length === 0 || selectedBrands.includes(product.brand)
  );

  // Sort Products Based on Selected Option
  if (sortOption === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "mostBought") {
    filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  return (
    <div className="flex p-6">
      {/* Left Sidebar - Filters */}
      <aside className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-md font-semibold">Brand</h3>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              onChange={() => handleBrandChange("Zara")}
              checked={selectedBrands.includes("Zara")}
            />
            <span>Zara</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              onChange={() => handleBrandChange("H&M")}
              checked={selectedBrands.includes("H&M")}
            />
            <span>H&M</span>
          </label>
        </div>

        {/* Sorting Options */}
        <div>
          <h3 className="text-md font-semibold">Sort By</h3>
          <select
            className="w-full p-2 border rounded mt-2"
            onChange={(e) => handleSortChange(e.target.value)}
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
        {filteredProducts.map((product) => (
          <div
            key={product.productId}
            className="border p-4 rounded-lg shadow-lg flex flex-col justify-between cursor-pointer" onClick={() => handleProductClick(product.productId)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-contain rounded-md"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.brand}</p>
              {/* Product Rating - Show rating or "No reviews" */}
              <div className="mt-2">
                {product.rating ? (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                    ({product.rating}) ★
                  </span>
                ) : (
                  <div className="flex items-center">
                    <hr className="flex-grow border-gray-300 mr-2" />
                    <span className="text-sm text-gray-600 italic">No reviews</span>
                  </div>
                )}
              </div>

              {/* Product Rating - Show only if rating exists */}

              {product.reviews && product.reviews.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-md font-semibold">Reviews:</h4>
                  {product.reviews.map((review) => (
                    <div key={review.id} className="mt-2 border-t pt-2">
                      <p className="text-sm font-semibold">{review.reviewer}:</p>
                      <p className="text-sm italic">{review.comment}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-600">{review.date}</span>
                        <span className="text-xs text-gray-600 ml-2">
                          {review.likes} Likes | {review.dislikes} Dislikes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price & Discount - Ensuring Proper Alignment */}
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
        ))}
      </section>
    </div>
  );
};

export default Product;