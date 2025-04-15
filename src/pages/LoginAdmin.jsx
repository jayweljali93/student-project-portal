import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
    const authApp = auth;
    const db = getFirestore();

    try {
      // Login user
      const userCredential = await signInWithEmailAndPassword(
        authApp,
        email,
        password
      );
      const user = userCredential.user;
      console.log("UserCredential:", userCredential);

      // Check user role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      console.log("User data:", userDoc.data());

      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "admin") {
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        } else if (role === "student") {
          navigate("/student-dashboard");
        } else {
          setError("❌ You are not authorized as an admin.");
        }
      }
    } catch (err) {
      setError("❌ Invalid admin credentials.");
      console.log(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/api/placeholder/800/800" alt="Admin Login illustration" />
      </div>
      <div className="login-form">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
      </div>
    </div>
  );
};

export default LoginAdmin;
