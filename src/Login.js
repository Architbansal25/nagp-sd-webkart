import React, { useState } from "react";
import { auth, provider } from "./firebase-config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      debugger;
      const result = await signInWithPopup(auth, provider);
      debugger;
      //console.log("Google Login Success:", result.user);
      console.log("google login success:");
      console.log(result.user.accessToken);
      // const idToken = user.getIdToken();
      // console.log("Google ID Token:", idToken);
      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.error("Google Login Failed:", err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Log in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      console.log("Login Success:", userCredential.user);

      navigate("/home");
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err.message);
    }
  };

  return (
    <div className="bg-blue-500">
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>OR</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <p>
        Don’t have an account? <a href="/signup">Signup here</a>
      </p>
    </div>
  );
};

export default Login;
