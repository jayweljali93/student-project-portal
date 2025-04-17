// 

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info and role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "student", // You can customize this based on user selection
      });

      navigate("/"); // redirect to login page after successful registration
    } catch (err) {
      setError("Registration failed. " + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="form-title">Register</h2>

        {["name", "email", "password", "confirmPassword"].map((field, idx) => (
          <div key={idx} className="form-group">
            <label className="form-label">
              <span className="required">*</span>{" "}
              {field === "confirmPassword"
                ? "Confirm password"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        ))}

        <button type="submit" className="submit-button">
          Register
        </button>

        {error && <p className="error">{error}</p>}

        <p className="form-footer">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
