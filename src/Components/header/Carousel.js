


import React from "react";
import { useState, useEffect } from "react";
import DiscountImage from "../../assests/images/first-slide-discount.jpg";
import HangerImage from "../../assests/images/hanger-clothes.jpg";
import TrendingClothImage from "../../assests/images/trending-collection.jpg";
import "./Carousel.css";

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [isErasing, setIsErasing] = useState(false);

  const slides = [
    { img: DiscountImage, line1: "30% Discount on", line2: "First Shopping" },
    { img: HangerImage, line1: "Wide Range", line2: "of Clothes" },
    { img: TrendingClothImage, line1: "Go with the ", line2: "Trend" }, // notice tweak here
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsErasing(true);

      setTimeout(() => {
        if (direction === "forward") {
          if (currentIndex < slides.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            setDirection("backward");
            setCurrentIndex((prev) => prev - 1);
          }
        } else {
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          } else {
            setDirection("forward");
            setCurrentIndex((prev) => prev + 1);
          }
        }
        setIsErasing(false);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, direction]);

  const getDynamicDelay = (line) => {
    const baseTimePerChar = 0.07; // seconds per char
    return `${line.length * baseTimePerChar}s`;
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="flex w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-2xl bg-white">
      <div className="w-2/3">
        <img
          src={currentSlide.img}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-96 object-cover transition-all duration-[2200ms] ease-in-out"
        />
      </div>

      <div className="w-1/3 flex flex-col justify-center bg-gradient-to-br from-gray-100 to-white p-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col justify-between h-full">
          <div className="text-gray-800 mb-6 leading-relaxed font-[Poppins]">
            <div className="text-3xl font-bold">{slides[currentIndex].line1}</div>
            <div className="text-lg font-normal">{slides[currentIndex].line2}</div>
          </div>


          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setDirection(idx > currentIndex ? "forward" : "backward");
                  setIsErasing(false);
                }}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${idx === currentIndex ? "bg-blue-600" : "bg-gray-400"
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
