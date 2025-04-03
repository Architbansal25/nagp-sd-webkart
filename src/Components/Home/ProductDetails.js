import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import ServiceUnavailable from "../SystemError/ServiceUnavailable";
import LoadBubbleEffect from "../Effects/LoadBubbleEffect";


const ProductDetails = () => {
  const { id } = useParams();
  const [sampleProducts, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const userEmail = localStorage.getItem("username");
  const backendUrl = "ae7b879491443483190312829691524e-767193481.ap-south-1.elb.amazonaws.com"
  const [SystemError, setSystemError] = useState(false);
  const product = sampleProducts.find((item) => item.productId === Number(id));
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    try{
      const response = await fetch(`http://${backendUrl}/products`);
      const data = await response.json();
      if(data.length>0){
        setLoading(false);
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
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadBubbleEffect />
        </div>
      );
    }

  if (!product) return <p>Product Not Found</p>;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };
  if(SystemError){
      return (<div><ServiceUnavailable /></div>);
 }
  const handleAddToCart = async () => {
    if (!selectedSize) {
      console.log("Please select a size before adding to cart.");
      toast.warn('Please select a size before adding to cart.');
      return;
    }
    const requestData = {
      userName: userEmail,
      productId: product.productId,
      size: selectedSize,
      quantity: 1,
    };
    console.log(requestData);
    
    try {
      await axios.post(`http://${backendUrl}/cart/add`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };
  const handleAddToWishlist = async () => {
    const requestData = {
      userName: userEmail,
      productId: product.productId,
    };

    console.log(requestData);

    try {
      await axios.post(`http://${backendUrl}/wishlist/add`, requestData, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Item added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist.');
    }
  };

  return (
    <div className="flex p-10 max-w-6xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Left Section (Fixed Product Image) */}
      <div className="w-1/2 relative h-[500px]">
        <div
          className="relative w-full border rounded-lg overflow-hidden"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto transition-transform"
            style={{
              transform: zoom ? `scale(1.5)` : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        </div>
      </div>

      {/* Right Section (Scrollable) */}
      <div className="w-1/2 overflow-y-auto h-[calc(100vh-100px)] p-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">{product.brand}</p>

        {/* Rating */}
        {product.rating && product.rating>0?(
          <div className="flex items-center mt-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">
              {product.rating} ★
            </span>
            <span className="text-xs text-gray-600 ml-2">
              ({product.reviewsCount} Ratings)
            </span>
          </div>):( <p className="text-gray-500 mt-4">No reviews available yet.</p>
        )}

        {/* Price & Discount */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-2xl font-bold">₹{product.price}</span>
          <span className="text-gray-500 line-through text-lg">
            ₹{product.originalPrice}
          </span>
          {product.discount && (
            <span className="text-red-500 text-lg font-semibold">
              ({product.discount})
            </span>
          )}
        </div>
        <p className="text-green-600 text-sm mt-1">Inclusive of all taxes</p>

        {/* Sizes */}
        <div className="mt-4">
          <h3 className="text-md font-semibold">Select Size</h3>
          <div className="flex space-x-2 mt-2">
            {product.sizes.map((size, index) => (
              <button
              key={index}
              className={`border p-2 rounded-md text-sm hover:bg-gray-200 ${
                selectedSize === size ? 'bg-gray-300' : ''
              }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
                <button className="bg-red-500 text-white px-6 py-3 rounded-md font-bold hover:bg-red-400" onClick={handleAddToCart}>
                    ADD TO BAG
                </button>
                <button className="border px-6 py-3 rounded-md font-bold hover:bg-gray-200" onClick={handleAddToWishlist}>
                    WISHLIST
                </button>
                </div>

        {/* Delivery Options */}
        <div className="mt-6">
          <h3 className="text-md font-semibold">Delivery Check</h3>
          <p
            className="w-full p-3 bg-gray-100"
          >Delivery only available in NCR</p>
        </div>

        {/* Specification */}
        <div className="p-4 border rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold">Specification</h2>
          <p className="text-gray-700"><span className="font-semibold">Fits:</span>{product.specification.fit}</p>
          <p className="text-gray-700"><span className="font-semibold">fabric:</span> {product.specification.fabric}</p>
        </div>

        {/* Seller Section */}
        <div className="p-4 border rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold">Seller</h2>
          <p className="text-blue-600 font-semibold">WebKart 
            <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md ml-2">4.3 ★</span>
          </p>
          <p className="text-gray-600">10 days return policy</p>
        </div>

        {/* Product Details */}
        <div className="p-4 border rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-bold">Product Details</h2>
          <div className="grid grid-cols-2 gap-2 text-gray-700 mt-2">
            <p><span className="font-semibold">Pack of:</span> {product.specification.packOf}</p>
            <p><span className="font-semibold">Style Code:</span> {product.specification.styleCode}</p>
            <p><span className="font-semibold">Fit:</span> {product.specification.fit}</p>
            <p><span className="font-semibold">Fabric:</span> {product.specification.fabric}</p>
            <p><span className="font-semibold">color:</span> {product.specification.color}</p>
          </div>
        </div>
            {/* Product Description Section */}
            <div className="p-6 border rounded-lg shadow-md mt-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Product Description</h2>
                <div className="flex flex-col md:flex-row items-center">
                    {/* Product Image */}
                    <div className="w-full md:w-1/3">
                    <img src={product.image} alt="Product" className="w-full rounded-lg shadow-md" />
                    </div>

                    {/* Product Description Text */}
                    <div className="w-full md:w-2/3 md:pl-6 mt-4 md:mt-0">
                    <h3 className="text-lg font-semibold">Style That Speaks Volumes</h3>
                    <p className="text-gray-700 mt-2">
                        {product.description}
                    </p>
                    </div>
                </div>
                </div>
        {/* Reviews Section */}
        <div className="p-6 border rounded-lg shadow-md mt-6 bg-white">
          <h2 className="text-xl font-bold flex items-center">
            Ratings & Reviews
            {product.rating && product.rating>0 ?(
              <span className="ml-3 bg-green-600 text-white px-2 py-1 rounded-md text-sm">
                {product.rating} ★
              </span>
            ):(<p></p>)}
            {product.reviewsCount && product.reviewsCount>0 ? (
              <span className="text-gray-600 text-sm ml-2">
                {product.reviewsCount.toLocaleString()} ratings
              </span>
             ) : (<p></p>)}
          </h2>

          {product.reviews && product.reviews.length > 0 ? 
          ( <div className="mt-6"> {product.reviews.map((review, index) => ( 
          <div key={index} className="border-b pb-4 mb-4"> 
          <div className="flex items-center"> 
            <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-md"> 
                {review.rating} ★ </span> 
                <span className="ml-2 font-semibold">
                    {review.title}</span> 
                    </div> 
                    <p className="text-gray-700 mt-2">{review.comment}</p> 
                    <div className="flex items-center mt-2"> 
                        <span className="font-semibold text-gray-800">{review.reviewer}</span> 
                        <span className="text-gray-500 text-sm ml-2">{review.date}</span> </div> 
                        <div className="flex items-center text-gray-600 text-sm mt-2"> 
                            👍 {review.likes} | 👎 {review.dislikes} </div> </div> ))} 
                            </div> ) : ( <p className="text-gray-500 mt-4">No reviews available yet.</p> )} 
                            </div> 
                            </div> 
                            </div> 
                            ); 
                        };

export default ProductDetails;
