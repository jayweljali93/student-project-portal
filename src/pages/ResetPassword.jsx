// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/ResetPassword.css"; // link the custom CSS if needed

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = () => {
//     if (!email || !password || !confirmPassword) {
//       alert("Please fill in all fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     console.log("Reset info:", { email, password, confirmPassword });

//     // Perform reset logic or redirect
//     // Example: navigate("/login");
//   };

//   return (
//     <div className="reset-wrapper">
//       <div className="reset-background-logo">8</div>
//       <div className="reset-container">
//         <button className="back-button" onClick={() => navigate('/')}>&larr;</button>

//         <div className="icon-circle">8</div>

//         <h2 className="title">Reset Password</h2>
//         <p className="subtitle">Reset your password if you forgot them.</p>

//         <div className="form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <button onClick={handleSubmit}>Send Code</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError("❌ " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="reset-wrapper">
      {/* <div className="reset-background-logo">8</div> */}
      <div className="reset-container">
        <button className="back-button" onClick={() => navigate("/")}>
          &larr;
        </button>

        <div className="icon-circle">8</div>
        <h2 className="title">Reset Password</h2>
        <p className="subtitle">Enter your email to get the reset link.</p>

        <div className="form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleReset}>Send Reset Link</button>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
