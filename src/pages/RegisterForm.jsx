import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { db } from "../firebase"; // Adjust the import based on your project structure
import { doc, setDoc } from "firebase/firestore";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set display name in auth profile
      await updateProfile(user, { displayName: name });

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        uid: user.uid,
        role: "student", // or "admin" based on logic
      });

      // Navigate to login page
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert(error.message);
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
