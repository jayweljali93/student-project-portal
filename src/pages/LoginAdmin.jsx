import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const LoginAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const db = getFirestore();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        localStorage.setItem("UserId", user.uid);
        navigate("/admin-dashboard");
      } else {
        setError("❌ You are not authorized as an admin.");
      }
    } catch (err) {
      setError("❌ Invalid admin credentials.");
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h2>Welcome Back</h2>
        <p>Only Admins allowed to login here.</p>
        <button className="signup-btn" onClick={() => navigate("/register")}>Student Sign Up</button>
      </div>

      <div className="login-right">
        <h3>Admin Login</h3>
        <form onSubmit={handleLogin}>
          <label>Email *</label>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password *</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signin-btn">Sign In</button>
        </form>
        <div className="forgot-password">
          <a href="#" onClick={() => navigate("/reset-password")}>Forgot Password?</a>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginAdmin;
