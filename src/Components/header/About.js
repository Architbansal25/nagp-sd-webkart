import React from "react";
import { Link } from "react-router-dom";
import HappyCustomers from "../../assests/images/happy-customer.jpg";
import Banner from "./Banner";

export default function About() {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">About WebKart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to <span className="font-semibold text-black">WebKart</span>, your one-stop online store for the latest in electronics, fashion, and more. We are passionate about delivering the best shopping experience with top-notch products and services.
          </p>
        </section>
  
        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <img
            src = {HappyCustomers}
            alt="Our Mission"
            className="rounded-xl shadow-lg"
          />
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
            <p className="text-gray-600">
              At WebKart, our mission is simple: to make online shopping seamless, trustworthy, and enjoyable. We aim to connect people with the products they love, while providing fast delivery, competitive prices, and outstanding customer support.
            </p>
          </div>
        </section>
  
        {/* Why Choose Us Section */}
        <section className="bg-gray-50 rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Why Choose WebKart?</h2>
          <Banner/>

        </section>
        {/* Contact Us Section */}
        <section className="text-center bg-gray-50 p-6 rounded-xl shadow-md mt-12">
          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            Have questions? Need support? Reach out to us at:
          </p>
          <p className="text-lg font-semibold text-blue-600 mt-2">
            <a href="mailto:webcart.support@gmail.com">webkart.support@gmail.com</a>
          </p>
        </section>
        {/* Call to Action */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Join Thousands of Happy Shoppers</h2>
          <p className="text-gray-600">Explore our wide collection of products and enjoy a smooth shopping journey today.</p>
          <Link to = "/">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition">
            Shop Now
          </button>
          </Link>
        </section>
      </div>
    );
  }
  