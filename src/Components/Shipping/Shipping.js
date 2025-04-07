import React, { useState } from 'react'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Shipping() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    contactNo: '',
    fullAddress: '',
  });
  const location = useLocation();
  const { products, orderDetails } = location.state || {};
 // const [shippingId, setShippingId] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook for redirection
  const userEmail = localStorage.getItem("username");
  const backendUrl = "a03ca4bfe8f9349dd913e64221f7c0a8-699713062.ap-south-1.elb.amazonaws.com" // Replace with actual user data

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'lastName' && !value.trim()) {
        tempErrors[key] = `${key} is required`;
      }
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post(`http://${backendUrl}/shipping/add`, {
        userName: userEmail,
        ...formData,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
       // setShippingId(response.data.shippingId); // Store the shipping ID
       const newShippingId = response.data.id; 
       console.log('Shipping ID:', newShippingId);
        toast.success('Address submitted successfully!');

        // Reset form after success
        setFormData({
          firstName: '',
          lastName: '',
          country: '',
          state: '',
          city: '',
          pincode: '',
          contactNo: '',
          fullAddress: '',
        });

        // Redirect to payment page after success
        setTimeout(() =>  navigate('/payment', { state: { products, orderDetails: { ...orderDetails, shippingId: newShippingId, shippingAddress: formData.fullAddress } } }), 2000); // Redirect after 2 seconds
      }
    } catch (error) {
      console.error('Error submitting address:', error);
      toast.error('Failed to submit address. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Country *</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.country ? 'border-red-500' : ''}`}
          />
          {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.state ? 'border-red-500' : ''}`}
            />
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">City / Town *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.city ? 'border-red-500' : ''}`}
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.pincode ? 'border-red-500' : ''}`}
          />
          {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Contact No *</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            maxLength={10}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.contactNo ? 'border-red-500' : ''}`}
          />
          {errors.contactNo && <p className="text-red-500 text-xs">{errors.contactNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Full Address *</label>
          <textarea
            name="fullAddress"
            rows="3"
            value={formData.fullAddress}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none ${errors.fullAddress ? 'border-red-500' : ''}`}
          ></textarea>
          {errors.fullAddress && <p className="text-red-500 text-xs">{errors.fullAddress}</p>}
        </div>

        <button
          type="submit"
          className={`w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'SAVE ADDRESS'}
        </button>
      </form>
    </div>
  );
}
