import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Reset link sent to your email.");
      navigate("/login"); // or homepage
    } catch (error) {
      console.error("Error sending reset email:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-background-logo">8</div>
      <div className="reset-container">
        <button className="back-button" onClick={() => navigate('/')}>&larr;</button>
        <div className="icon-circle">8</div>
        <h2 className="title">Reset Password</h2>
        <p className="subtitle">Enter your email to receive a reset link.</p>

        <div className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSubmit}>Send Reset Link</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
