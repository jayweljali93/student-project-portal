import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

const SignupStudent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with the role 'student'
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name,
        role: 'student',
      });

      // Redirect user to student dashboard
      navigate('/student-dashboard');
    } catch (err) {
      setError('❌ Error creating account: ' + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Student Signup</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
          
          <p className="login-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupStudent;