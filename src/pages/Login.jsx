import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../Utils/validators';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return setError('⚠️ Please enter a valid email.');
    }
    if (password.length < 6) {
      return setError('⚠️ Password must be at least 6 characters.');
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/student-dashboard');
    } catch (err) {
      console.error(err.message);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/api/placeholder/800/800" alt="Login illustration" />
      </div>
      <div className="login-form">
        <h2>Student Login</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@college.edu"
            required
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          
          <button type="submit">
            Login
          </button>
          
          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;