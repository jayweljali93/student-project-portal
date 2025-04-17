import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminChatbox from '../components/AdminChatbox';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sample data for the dashboard
  const projectRequests = [
    { id: 1, student: "John Doe", project: "E-commerce Website", status: "Pending", date: "2025-04-10" },
    { id: 2, student: "Sarah Smith", project: "Task Manager App", status: "Approved", date: "2025-04-08" },
    { id: 3, student: "Mike Johnson", project: "Portfolio Website", status: "Pending", date: "2025-04-12" },
  ];

  const paymentDetails = [
    { id: 1, student: "John Doe", amount: "$49.99", date: "2025-04-05", status: "Completed" },
    { id: 2, student: "Sarah Smith", amount: "$29.99", date: "2025-04-07", status: "Completed" },
    { id: 3, student: "Mike Johnson", amount: "$49.99", date: "2025-04-09", status: "Pending" },
    { id: 4, student: "Emily Davis", amount: "$29.99", date: "2025-04-10", status: "Completed" },
  ];

  const purchasedUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", projects: 2, totalSpent: "$79.98" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", projects: 1, totalSpent: "$29.99" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", projects: 1, totalSpent: "$49.99" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", projects: 3, totalSpent: "$129.97" },
    { id: 5, name: "David Wilson", email: "david@example.com", projects: 2, totalSpent: "$79.98" },
  ];

  const projects = [
    { 
      id: 1, 
      name: "Weather App", 
      description: "A React weather application using OpenWeatherMap API", 
      price: "$29.99", 
      purchases: 8, 
      dateAdded: "2025-03-15" 
    },
    { 
      id: 2, 
      name: "Todo List", 
      description: "A simple React Todo application with Firebase integration", 
      price: "$19.99", 
      purchases: 12, 
      dateAdded: "2025-03-20" 
    },
    { 
      id: 3, 
      name: "E-commerce Website", 
      description: "A complete e-commerce solution with payment integration", 
      price: "$49.99", 
      purchases: 5, 
      dateAdded: "2025-03-25" 
    },
    { 
      id: 4, 
      name: "Portfolio Template", 
      description: "Customizable portfolio website template for developers", 
      price: "$24.99", 
      purchases: 15, 
      dateAdded: "2025-04-01" 
    },
  ];

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/admin-login');
        return;
      }
      
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAdminName(userData.name || 'Admin');
          
          const userRole = userData.role;
          if (userRole === 'student') {
            navigate('/student-dashboard'); // Redirect to student dashboard if role is student
          }
        } else {
          console.log("User document not found.");
        }
      } catch (error) {
        console.log("Error fetching user role:", error);
      }
    };
    checkRole();
  }, [auth, db, navigate]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch((error) => {
      console.log("Logout error:", error);
    });
  };

  const handleUploadProject = (e) => {
    e.preventDefault();
    // Here you would handle the actual project upload logic
    alert("Project uploaded successfully!");
    setShowUploadModal(false);
  };

  const renderDashboard = () => (
    <>
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="welcome-message">Welcome, {adminName}!</p>
      
      <div className="admin-cards">
        <div className="admin-card">
          <h3>Total Students</h3>
          <p>128</p>
        </div>
        
        <div className="admin-card">
          <h3>Active Courses</h3>
          <p>16</p>
        </div>
        
        <div className="admin-card">
          <h3>Faculty Members</h3>
          <p>24</p>
        </div>
        
        <div className="admin-card">
          <h3>New Registrations</h3>
          <p>12 this week</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-widget">
          <div className="widget-header">
            <h3>Recent Project Requests</h3>
            <button 
              className="view-all-btn"
              onClick={() => setActiveTab('requests')}
            >
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Project</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projectRequests.slice(0, 3).map(request => (
                  <tr key={request.id}>
                    <td>{request.student}</td>
                    <td>{request.project}</td>
                    <td>
                      <span className={`status-badge ${request.status === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-widget">
          <div className="widget-header">
            <h3>Recent Payments</h3>
            <button 
              className="view-all-btn"
              onClick={() => setActiveTab('payments')}
            >
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentDetails.slice(0, 3).map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.student}</td>
                    <td>{payment.amount}</td>
                    <td>
                      <span className={`status-badge ${payment.status === 'Completed' ? 'status-approved' : 'status-pending'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderProjectRequests = () => (
    <>
      <div className="tab-header">
        <h1 className="section-title">Project Requests</h1>
      </div>
      <div className="table-card">
        <table className="admin-table full-width">
          <thead>
            <tr>
              <th>Student</th>
              <th>Project</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projectRequests.map(request => (
              <tr key={request.id}>
                <td>{request.student}</td>
                <td>{request.project}</td>
                <td>{request.date}</td>
                <td>
                  <span className={`status-badge ${request.status === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                    {request.status}
                  </span>
                </td>
                <td className="action-buttons">
                  {request.status === 'Pending' && (
                    <button className="approve-btn">
                      Approve
                    </button>
                  )}
                  <button className="view-btn">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderPayments = () => (
    <>
      <div className="tab-header">
        <h1 className="section-title">Payment Details</h1>
      </div>
      <div className="table-card">
        <table className="admin-table full-width">
          <thead>
            <tr>
              <th>Student</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentDetails.map(payment => (
              <tr key={payment.id}>
                <td>{payment.student}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={`status-badge ${payment.status === 'Completed' ? 'status-approved' : 'status-pending'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="view-btn">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderPurchaseUsers = () => (
    <>
      <div className="tab-header">
        <h1 className="section-title">Users Who Purchased Code</h1>
      </div>
      <div className="table-card">
        <table className="admin-table full-width">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Projects Purchased</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchasedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.projects}</td>
                <td>{user.totalSpent}</td>
                <td className="action-buttons">
                  <button className="view-btn">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderProjects = () => (
    <>
      <div className="tab-header">
        <h1 className="section-title">Projects</h1>
        <button 
          className="upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          Upload New Project
        </button>
      </div>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p className="project-description">{project.description}</p>
            <div className="project-meta">
              <span className="project-price">{project.price}</span>
              <span className="purchase-count">{project.purchases} purchases</span>
            </div>
            <p className="project-date">Added: {project.dateAdded}</p>
            <div className="project-actions">
              <button className="edit-btn">
                Edit
              </button>
              <button className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'requests':
        return renderProjectRequests();
      case 'payments':
        return renderPayments();
      case 'users':
        return renderPurchaseUsers();
      case 'projects':
        return renderProjects();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={activeTab === 'requests' ? 'active' : ''}
            onClick={() => setActiveTab('requests')}
          >
            Project Requests
          </li>
          <li 
            className={activeTab === 'payments' ? 'active' : ''}
            onClick={() => setActiveTab('payments')}
          >
            Payment Details
          </li>
          <li 
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Purchase Users
          </li>
          <li 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </li>
          <li>Students</li>
          <li>Instructors</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="admin-main">
        {renderContent()}
      </div>

      {/* Upload Project Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload New Project</h2>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUploadProject} className="upload-form">
              <div className="form-group">
                <label htmlFor="projectName">
                  Project Name
                </label>
                <input 
                  id="projectName" 
                  type="text" 
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="projectDescription">
                  Description
                </label>
                <textarea 
                  id="projectDescription" 
                  placeholder="Enter project description"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="projectPrice">
                  Price ($)
                </label>
                <input 
                  id="projectPrice" 
                  type="number" 
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="projectCode">
                  Project Code
                </label>
                <div className="file-upload">
                  <div className="upload-area">
                    <p>Upload project code files (ZIP)</p>
                    <input 
                      type="file" 
                      accept=".zip"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="projectScreenshot">
                  Screenshot
                </label>
                <div className="file-upload">
                  <div className="upload-area">
                    <p>Upload project screenshot</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AdminChatbox />
    </div>
  );
};

export default AdminDashboard;