import React, { useEffect, useRef  } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Checkout.css"; // Import your CSS file for styling
export default function Checkout() {
  const location = useLocation();
  const { products, orderDetails } = location.state || {};
  const orderPlacedRef = useRef(false);
  const totalAmount = orderDetails.paidAmount || 0;
  const backendUrl = "ae7b879491443483190312829691524e-767193481.ap-south-1.elb.amazonaws.com"
  useEffect(() => {
    if (!orderPlacedRef.current && products?.length && orderDetails) {
      const finalOrder = {
        orderDetails,
        products
      };

      console.log("Final Order:", finalOrder);
      const deleteCartItems = async () => {
        try {
          await Promise.all(
            products.map((item) =>
              axios.delete(`http://${backendUrl}/cart/delete/${item.cartId}`)
            )
          );
          console.log("Cart items deleted successfully.");
        } catch (error) {
          console.error("Error deleting cart items:", error);
        }
      };

      deleteCartItems();
      
      // ✅ Prevents duplicate logs & API calls
      orderPlacedRef.current = true;

     
    }
  }, [products, orderDetails]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="Order Completed"
        className="w-36 h-36 fixed-checkmark"
      />
      <h2 className="text-xl font-semibold">Order is completed</h2>
      <p className="text-gray-500">Thank you for shopping with us.</p>
      {/* Order Summary */}
      <div className="mt-6 text-left border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          <p><strong>Email:</strong> {orderDetails?.userName}</p>
          <p><strong>Shipping Address:</strong> {orderDetails?.shippingAddress}</p>
          <p><strong>Payment Status:</strong> <span className="text-green-600">{orderDetails?.paymentStatus}</span></p>
          <p><strong>Coupan Code:</strong> <span className="text-green-600">{orderDetails?.coupanCode}</span></p>
          
          {/* Product Table */}
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Ordered Items:</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Size</th>
                    <th className="border border-gray-300 px-4 py-2">Qty</th>
                    <th className="border border-gray-300 px-4 py-2">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">₹{item.buyAtPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Order Amount */}
          <p className="text-lg font-semibold mt-4 text-gray-800">
            Paid Amount: ₹{totalAmount}
          </p>
        </div>
      <Link to="/">
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
