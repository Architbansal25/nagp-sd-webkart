import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const authToken = localStorage.getItem("authToken");
  
    if (!authToken) {
      alert("You must log in to access this page!");
      return <Navigate to="/login" />;
    }
  
    return <Outlet />;
  };
  

export default ProtectedRoute;
