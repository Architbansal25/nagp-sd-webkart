import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../Config/firebase-config";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../Config/constants";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backendUrl = BACKEND_URL;

  const mergeGuestCart = async (loggedInEmail) => {
    const guestId = localStorage.getItem("guestId");
    if (!guestId) return;
    try {
      // Fetch guest cart and user's existing cart in parallel
      const [guestRes, userRes] = await Promise.all([
        fetch(`http://${backendUrl}/cart/user/${guestId}`),
        fetch(`http://${backendUrl}/cart/user/${loggedInEmail}`),
      ]);
      if (!guestRes.ok) return;
      const guestItems = await guestRes.json();
      if (!Array.isArray(guestItems) || guestItems.length === 0) {
        localStorage.removeItem("guestId");
        return;
      }
      const userItems = userRes.ok ? await userRes.json() : [];
      const existingItems = Array.isArray(userItems) ? userItems : [];

      // Merge: update quantity for duplicates, add new items otherwise
      await Promise.all(
        guestItems.map((item) => {
          const existing = existingItems.find(
            (u) => u.productId === item.productId && u.size === item.size
          );
          if (existing) {
            return fetch(
              `http://${backendUrl}/cart/update/quantity/${existing.cartId}?quantity=${existing.quantity + item.quantity}`,
              { method: "PUT" }
            );
          }
          return fetch(`http://${backendUrl}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: loggedInEmail,
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
            }),
          });
        })
      );
      // Delete each guest cart item after transfer
      await Promise.all(
        guestItems.map((item) =>
          fetch(`http://${backendUrl}/cart/delete/${item.cartId}`, { method: "DELETE" })
        )
      );
      localStorage.removeItem("guestId");
      console.log("Guest cart transferred for:", loggedInEmail);
    } catch (err) {
      console.error("Guest cart transfer failed:", err.message);
    }
  };
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const googleToken = result.user.accessToken;
      const googleEmail = result.user.email;

      // Register/upsert the Google user in the backend (no-op if already exists)
      await fetch(`http://${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleEmail, password: googleToken }),
      });

      // Save Google token in localStorage
      localStorage.setItem("authToken", googleToken);

      console.log("Google Login Success:", googleEmail);
      localStorage.setItem("username", googleEmail);
      await mergeGuestCart(googleEmail);
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Google Login Failed:", err.message);
    }
  };

  // Handle Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Req body:", JSON.stringify({ email, password }));
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", email);
      console.log("Login Success:", data);
      await mergeGuestCart(email);
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm font-medium whitespace-nowrap">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-2xl mr-2" /> Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={switchToSignup}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}
