import React from "react";
import Banner from "../header/Banner";
import Categories from "../Catagories/Categories";
import Carousel from "../header/Carousel";

const Home = () => {



  return (
    <div className="text-center mt-10">
      {/* Carousel Section */}
      <Carousel></Carousel>
      {/* Static Banner */}
      <div className="p-8 "> <Banner></Banner></div>
  
      {/* "Shop By Category" Section */}
      <div className="text-center mt-14">
        <p>hello nagp</p>
        <Categories></Categories>
      </div>
    </div>
  );
};

export default Home;
