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
    const db = getFirestore();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "student") {
          navigate("/student-dashboard");
        } else {
          setError("❌ You are not authorized as an admin.");
        }
      }
    } catch (err) {
      setError("❌ Invalid admin credentials.");
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
          <button type="submit" className="signin-btn">Sing In</button>
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
