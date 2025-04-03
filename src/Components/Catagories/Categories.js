import React from 'react';
import EthnicWear from "../../assests/images/ethnic-wear.jpg";
import CasualWear from "../../assests/images/casual-wear.jpg";
import WinterCollection from "../../assests/images/winter-wear.jpg";
import SummerCollection from "../../assests/images/summer-wear.jpg";
import WesternWear from "../../assests/images/western-wear.jpg";
import Sportswear from "../../assests/images/sports-wear.jpg";
import { useNavigate } from "react-router-dom";

export default function Categories() {
    const navigate = useNavigate();
    const categories = [
        { img: EthnicWear, title: "Ethnic Wear", discount: "50-80% OFF" },
        { img: CasualWear, title: "Casual Wear", discount: "40-80% OFF" },
        { img: SummerCollection, title: "Summer Wear", discount: "30-70% OFF" },
        { img: WinterCollection, title: "Winter Wear", discount: "30-70% OFF" },
        { img: WesternWear, title: "Western Wear", discount: "40-80% OFF" },
        { img: Sportswear, title: "Sportswear", discount: "30-80% OFF" },
      ];
      const handleCategoryClick = (categoryTitle) => {
        navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
        //navigate("/products"); // Redirect to Products page with category query
      };

      return(
        <div className="text-center mt-14">
        <h2 className="text-5xl font-extrabold text-red-700">Shop By Category</h2>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10 px-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="relative group cursor-pointer"
              onClick={() => handleCategoryClick(category.title)} // Redirect on Click
            >
              <img
                src={category.img}
                alt={category.title}
                className="w-full h-72 object-cover rounded-xl shadow-lg transition-transform transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-100 text-black text-center py-4 rounded-b-xl transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white">
                <h3 className="text-lg font-bold">{category.title}</h3>
                <p className="text-sm font-semibold">{category.discount}</p>
                <p className="text-xs underline font-medium">Shop Now</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      );
}