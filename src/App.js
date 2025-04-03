import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Registration/Login";
import Signup from "./Components/Registration/Signup";
//import Signup from "./Signup";
import "./App.css";
import Header from "./Components/header/header";
import { useState } from "react";
import Home from "./Components/Home/Home";
import Footer from "./Components/header/footer";
import Product from "./Components/Home/Products";
import ProductDetails from "./Components/Home/ProductDetails";
import Cart from "./Components/Cart/Cart";
import Wishlist from "./Components/Wishlist/Wishlist";
import Shipping from "./Components/Shipping/Shipping";
import About from "./Components/header/About";
import Payment from "./Components/Payment/Payment";
import Checkout from "./Components/Checkout/Checkout";
import ServiceUnavailable from "./Components/SystemError/ServiceUnavailable";
import Categories from "./Components/Catagories/Categories";
import ProtectedRoute from "./Components/utils/ProtectedRoute";

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Router>
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<ServiceUnavailable />} />
        <Route path="/categories" element={<Categories />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path = "checkout" element = {<Checkout />} />
        </Route>
        <Route
          path="/login"
          element={
            isLogin ? (
              <Login switchToSignup={() => setIsLogin(false)} />
            ) : (
              <Signup switchToLogin={() => setIsLogin(true)} />
            )
          }
        />
      </Routes>
    </main>
    <Footer />
  </div>
</Router>

  );
};

export default App;
