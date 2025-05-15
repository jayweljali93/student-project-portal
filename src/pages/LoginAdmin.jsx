import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
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
      const userRef = doc(db, "users", user.uid);

      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          localStorage.setItem("UserId", user.uid);
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "student") {
            navigate("/student-dashboard");
          } else {
            setError("❌ You are not authorized as an admin.");
          }
        }
      });
    } catch (err) {
      setError("❌ Invalid admin credentials.");
      console.log(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <h2>Welcome Back</h2>
        <p>Create your account.<br />It's totally free.</p>
        <button className="signup-btn" onClick={() => navigate("/register")}>Sign Up</button>
      </div>

      <div className="login-right">
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <label>Username or email address<span className="required">*</span></label>
          <input
            type="email"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password<span className="required">*</span></label>
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
