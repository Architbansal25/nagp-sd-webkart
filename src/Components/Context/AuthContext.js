import React, { createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(authToken ? jwtDecode(authToken) : null);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      setUser(jwtDecode(authToken)); // Decode token to get user data
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
