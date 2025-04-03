import React, { useEffect, useRef  } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const { products, orderDetails } = location.state || {};
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (!orderPlacedRef.current && products?.length && orderDetails) {
      const finalOrder = {
        orderDetails,
        products
      };

      console.log("Final Order:", finalOrder);
      
      // ✅ Prevents duplicate logs & API calls
      orderPlacedRef.current = true;

      // axios.post('http://localhost:9093/order/create', finalOrder)
      //   .then(() => toast.success("Order placed successfully!"))
      //   .catch(() => toast.error("Failed to place order"));
    }
  }, [products, orderDetails]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="Order Completed"
        className="w-36 h-36"
      />
      <h2 className="text-xl font-semibold">Order is completed</h2>
      <p className="text-gray-500">Thank you for shopping with us.</p>
      <Link to="/">
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
