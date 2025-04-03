import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Payment() {
  const [selectedMethod, setSelectedMethod] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { products, orderDetails } = location.state || {};

  const handlePlaceOrder = () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }
    toast.success(`Order placed with ${selectedMethod}`);
    const finalOrderDetails = { ...orderDetails, paymentStatus: "success" };
    setTimeout(() => {
      navigate('/checkout', { state: { products, orderDetails: finalOrderDetails } });
      }, 3000);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 border rounded-xl shadow-md p-6 bg-white space-y-6">
        <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-semibold text-white bg-yellow-600 p-3 rounded-md">PAYMENT METHOD</h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-md border transition">
          <input
            type="radio"
            name="payment"
            value="Direct Bank Transfer"
            checked={selectedMethod === 'Direct Bank Transfer'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <span className="text-gray-700 font-medium">Direct Bank Transfer</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-md border transition">
          <input
            type="radio"
            name="payment"
            value="Cheque Payment"
            checked={selectedMethod === 'Cheque Payment'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <span className="text-gray-700 font-medium">Cheque Payment</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-md border transition">
          <input
            type="radio"
            name="payment"
            value="PayPal"
            checked={selectedMethod === 'PayPal'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <span className="text-gray-700 font-medium flex items-center gap-2">
            PayPal
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg" alt="paypal" className="w-10 inline-block" />
          </span>
        </label>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition"
      >
        PLACE ORDER
      </button>
    </div>
  );
}
