import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

// Import components
import Login from './pages/Login';
import SignupStudent from './pages/SignupStudent';
import LoginAdmin from './pages/LoginAdmin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
      <Routes>
        {/* Public routes */}
        {/* <Route path="/student-dashboard" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupStudent />} />
        <Route path="/admin-login" element={<LoginAdmin />} />

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
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
};

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { useState, useEffect } from 'react';

// // Import your components
// import Login from './pages/Login';
// import Signup from './pages/SignupStudent';
// import StudentDashboard from './pages/StudentDashboard';
// // Import other components as needed

// // Protected Route component
// const ProtectedRoute = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
        
//         {/* Protected routes */}
//         <Route 
//           path="/dashboard" 
//           element={
//             <ProtectedRoute>
//               <StudentDashboard />
//             </ProtectedRoute>
//           } 
//         />
        
//         {/* Redirect root to dashboard or login based on auth state */}
//         <Route 
//           path="/" 
//           element={<Navigate to="/dashboard" replace />} 
//         />

//         {/* Handle 404 - page not found */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;