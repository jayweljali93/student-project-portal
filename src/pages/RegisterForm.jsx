import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate();
  const db = getFirestore();
  const storage = getStorage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePic: files[0],
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, profilePic } = formData;

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePicUrl = "";
      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: profilePicUrl,
      });

      // Save to 'users' collection with role: 'student'
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "student",
        profilePic: profilePicUrl,
      });

      navigate("/student-dashboard");
    } catch (err) {
      setError("❌ Registration failed. " + err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="form-title">Student Register</h2>

        <div className="profile-pic-wrapper">
          <div className="profile-pic">
            <img
              src={previewImage || "https://i.pravatar.cc/100?img=68"}
              alt="Profile Preview"
              className="profile-img"
            />
            <label htmlFor="profilePicInput" className="camera-icon">📷</label>
            <input
              id="profilePicInput"
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="hidden-input"
            />
          </div>
        </div>

        {["name", "email", "password", "confirmPassword"].map((field, idx) => (
          <div key={idx} className="form-group">
            <label className="form-label">
              {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)} *
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

        <button type="submit" className="submit-button">Register</button>
        {error && <p className="error">{error}</p>}
        <p className="form-footer">
          Already have an account? <span className="login-link" onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
