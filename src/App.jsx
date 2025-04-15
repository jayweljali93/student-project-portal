import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

// Import components
import SignupStudent from './pages/SignupStudent';
import LoginAdmin from './pages/LoginAdmin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
      <Routes>
       
        <Route path="/signup" element={<SignupStudent />} />
        <Route path="/" element={<LoginAdmin />} />

        {/* Protected routes */}
        <Route 
          path="/student-dashboard" 
          element={<ProtectedRoute element={<StudentDashboard />}  redirectPath="/login" />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={<ProtectedRoute element={<AdminDashboard />} redirectPath="/admin-login" />} 
        />
        
        {/* Redirect for any other route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
};

export default App;

