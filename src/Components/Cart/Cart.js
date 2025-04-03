import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmptyCart from './EmptyCart';
import { FiTrash2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import LoadBubbleEffect from '../Effects/LoadBubbleEffect';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const userEmail = "archit@gmail.com";

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:9093/cart/user/${userEmail}`);
      setCart(data || []);
    } catch (err) {
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const mockCoupons = [
      { code: 'SAVE10', discount: 10 },
      { code: 'MEGA20', discount: 20 },
      { code: 'FESTIVE30', discount: 30 },
    ];
    setCoupons(mockCoupons);
  }, []);

  useEffect(() => {
    let total = cart.reduce((acc, item) => {
      return item.available ? acc + item.price * item.quantity : acc;
    }, 0);

    if (appliedCoupon) {
      const discountAmount = (total * appliedCoupon.discount) / 100;
      total = total - discountAmount;
    }

    setSubtotal(total);
  }, [cart, appliedCoupon]);

  const handleApplyCoupon = () => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (coupon) {
      setAppliedCoupon(coupon);
      setMessage(`Coupon "${coupon.code}" applied! You saved ${coupon.discount}%`);
    } else {
      setMessage('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:9093/wishlist/add', {
        userName: userEmail,
        productId,
      });
      toast.success('Added to wishlist!');
    } catch {
      toast.error('Failed to add to wishlist');
    }
  };

  const updateQuantity = async (cartId, updatedQty) => {
    try {
      await axios.put(`http://localhost:9093/cart/update/quantity/${cartId}?quantity=${updatedQty}`);
      fetchCart(); // refresh cart
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await axios.delete(`http://localhost:9093/cart/delete/${cartId}`);
      fetchCart(); // refresh cart
      toast.error('Removed from cart!');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadBubbleEffect />
      </div>
    );
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  // handle checkout button click


  const handleCheckout = () => {
    if (cart.some(item => !item.available)) {
      toast.error("Remove unavailable items first!");
      return;
    }
  
    const products = cart.map(item => ({
      productId: item.productId,
      size: item.size,
      quantity: item.quantity,
      buyAtPrice: item.price * item.quantity,
    }));
  
    const orderDetails = {
      userName: userEmail,
      coupanCode: appliedCoupon ? appliedCoupon.code : "",
      paymentStatus: "pending",  // Default until payment success
      shippingId: null,  // Will be updated in Shipping.js
    };
    
    console.log("Products:", products);
    console.log("Order Details:", orderDetails);
    navigate('/shipping', { state: { products, orderDetails } });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-6">
        {cart.map(item => (
          <div
            key={item.cartId}
            className={`flex items-center justify-between border rounded-xl p-4 shadow-sm ${!item.available ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">{item.specification.fabric} | {item.specification.color} | Size: {item.size}</p>
                <div className="mt-1 text-green-600 text-xs">{item.discount} Off</div>
                {!item.available && (
                  <span className="text-xs text-red-500 font-semibold">Unavailable</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="text-lg font-bold">₹{item.price.toLocaleString()}</div>
              <div className="text-sm line-through text-gray-500">₹{item.originalPrice.toLocaleString()}</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                  disabled={!item.available}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                  disabled={!item.available}
                  className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToWishlist(item.productId)}
                className="text-sm text-blue-600"
              >
                Add to Wishlist
              </button>
              <button
                onClick={() => removeFromCart(item.cartId)}
                className="text-sm hover:text-red-600"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="flex items-center gap-3 mb-4 p-5">
        <input
          type="text"
          placeholder="Enter coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border px-3 py-2 rounded-md w-1/2 focus:outline-none"
        />
        <button
          onClick={handleApplyCoupon}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          APPLY
        </button>
        {message && (
          <div
            className={`text-sm ${
              appliedCoupon ? 'text-green-600' : 'text-red-500'
            } font-medium`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="mt-8 border rounded-xl p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Price Details</h2>
        <div className="flex justify-between mb-2 text-sm">
          <span>Price ({cart.length} items)</span>
          <span>₹{cart.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-green-600">
          <span>Discount</span>
          <span>- ₹{cart.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm">
          <span>Delivery Charges</span>
          <span className="text-green-600">Free</span>
        </div>
        {appliedCoupon && (
          <div className="text-sm text-green-600">
            Extra Discount: {appliedCoupon.discount}% off
          </div>
        )}
        <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
      </div>
        <button className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition" onClick={handleCheckout}>
          {cart.some(item => !item.available) ? 'UPDATE CART' : 'CHECKOUT'}
        </button>
    </div>
  );
}
