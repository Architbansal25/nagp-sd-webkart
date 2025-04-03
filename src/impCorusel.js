import React, { useState, useEffect } from "react";

import DiscountImage from "../../assests/images/first-slide-discount.jpg";
import HangerImage from "../../assests/images/hanger-clothes.jpg";
import TrendingClothImage from "../../assests/images/trending-collection.jpg";

const Home = () => {
  const slides = [
    {
      img: DiscountImage,
      text: "30% Discount on First Shopping",
    },
    {
      img: HangerImage,
      text: "Wide Range of Clothes",
    },
    {
      img: TrendingClothImage,
      text: "Go with the Trend",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-10 overflow-hidden rounded-lg shadow-xl">
      {/* Background Blur Effect */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 blur-lg"
        style={{
          backgroundImage: `url(${slides[currentIndex].img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Main Image */}
      <div className="relative z-10">
        <img
          src={slides[currentIndex].img}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-auto max-h-96 object-cover transition-opacity duration-700 ease-in-out"
        />

        {/* Slide Text Overlay */}
        <p className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-lg px-6 py-2 rounded-full shadow-lg">
          {slides[currentIndex].text}
        </p>
      </div>

      {/* Left Navigation Button */}
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
          )
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300"
      >
        &#10094;
      </button>

      {/* Right Navigation Button */}
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
        }
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300"
      >
        &#10095;
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white w-5"
                : "bg-gray-300 opacity-60 hover:opacity-100"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Home;
