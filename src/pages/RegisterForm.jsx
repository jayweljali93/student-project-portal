import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add validation or API logic here
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
