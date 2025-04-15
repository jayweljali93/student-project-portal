import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [userName, setUserName] = useState('');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const projects = [
    {
      id: 1,
      name: "Weather App Tutorial",
      description: "Complete React weather application tutorial with source code",
      screenshot: "/api/placeholder/600/400",
      fileType: "zip",
      fileSize: "2.4 MB",
      fileName: "weather-app-tutorial.zip",
      price: "$4.99"
    },
    {
      id: 2,
      name: "React Hooks Guide",
      description: "Comprehensive PDF guide to React Hooks with examples",
      screenshot: "/api/placeholder/600/400",
      fileType: "pdf",
      fileSize: "1.8 MB",
      fileName: "react-hooks-guide.pdf",
      price: "$3.99"
    },
    {
      id: 3,
      name: "Firebase Authentication",
      description: "Implementation of Firebase Auth with React",
      screenshot: "/api/placeholder/600/400",
      fileType: "zip",
      fileSize: "3.2 MB",
      fileName: "firebase-auth-implementation.zip",
      price: "$5.99"
    },
    {
      id: 4,
      name: "CSS Animation Library",
      description: "Collection of ready-to-use CSS animations",
      screenshot: "/api/placeholder/600/400",
      fileType: "zip",
      fileSize: "1.5 MB",
      fileName: "css-animation-library.zip",
      price: "$2.99"
    }
  ];

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || 'Student');

          const userRole = userData.role;
          if (userRole === 'admin') {
            navigate('/admin-dashboard'); // Redirect to admin dashboard if role is admin
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
      navigate('/login');
    }).catch((error) => {
      console.log("Logout error:", error);
    });
  };

  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const closeProjectDetails = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  const showPayment = (e) => {
    e.stopPropagation();
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const processPayment = () => {
    // In a real app, this would integrate with a payment processor
    // For now we're just simulating a successful payment
    setPaymentCompleted(true);
    setTimeout(() => {
      closePaymentModal();
    }, 1000);
  };

  const downloadFile = (e) => {
    e.stopPropagation();
    
    // Show payment modal if payment not completed
    if (!paymentCompleted) {
      showPayment(e);
      return;
    }
    
    // Handle file download (in a real app)
    console.log(`Downloading ${selectedProject.fileName}`);
    alert(`Downloading ${selectedProject.fileName}`);
    
    // In a real app, you would trigger the download here
    // For example:
    // const link = document.createElement('a');
    // link.href = `/api/download/${selectedProject.fileName}`;
    // link.download = selectedProject.fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return '📄';
      case 'zip':
        return '📦';
      default:
        return '📁';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <h2>Student Portal</h2>
        <ul>
          <li>Dashboard</li>
          <li>My Projects</li>
          <li>Assignments</li>
          <li>Grades</li>
          <li>Calendar</li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <h1>Student Dashboard</h1>
        <p>Welcome, {userName}!</p>

        <div className="cards">
          <div className="card">
            <h3>Upcoming Assignments</h3>
            <p>You have 2 assignments due this week</p>
          </div>

          <div className="card">
            <h3>My Projects</h3>
            <p>You have {projects.length} resources available</p>
            <button className="view-projects-btn" onClick={() => setShowProjectDetails(false)}>View All Resources</button>
          </div>

          <div className="card">
            <h3>Recent Grades</h3>
            <p>Check your latest assessment results</p>
          </div>
        </div>

        {!showProjectDetails ? (
          <div className="projects-section">
            <h2>Learning Resources</h2>
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card" onClick={() => viewProjectDetails(project)}>
                  <div className="project-screenshot">
                    <img src={project.screenshot} alt={project.name} />
                    <div className="file-badge">
                      <span className="file-icon">{getFileIcon(project.fileType)}</span>
                      <span className="file-type">{project.fileType.toUpperCase()}</span>
                    </div>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="file-info">
                    <span className="file-size">{project.fileSize}</span>
                    <span className="file-price">{project.price}</span>
                  </div>
                  <button 
                    className="get-code-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      viewProjectDetails(project);
                    }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="project-details-viewer">
            <div className="details-header">
              <h2>{selectedProject?.name}</h2>
              <button onClick={closeProjectDetails} className="close-btn">Back to Resources</button>
            </div>
            <div className="project-details">
              <div className="screenshot-container">
                <img src={selectedProject?.screenshot} alt={selectedProject?.name} className="project-full-screenshot" />
                <div className="file-details">
                  <div className="file-type-large">
                    <span className="file-icon-large">{getFileIcon(selectedProject?.fileType)}</span>
                    <span>{selectedProject?.fileType.toUpperCase()} File</span>
                  </div>
                  <div className="file-info-details">
                    <p><strong>File Name:</strong> {selectedProject?.fileName}</p>
                    <p><strong>Size:</strong> {selectedProject?.fileSize}</p>
                    <p><strong>Price:</strong> {selectedProject?.price}</p>
                  </div>
                  <button 
                    className="download-file-btn" 
                    onClick={downloadFile}
                  >
                    {paymentCompleted ? `Download ${selectedProject?.fileName}` : "Get File (Requires Payment)"}
                  </button>
                </div>
              </div>
              <div className="file-preview">
                <h3>Description</h3>
                <p>{selectedProject?.description}</p>
                <div className="preview-content">
                  <div className="preview-placeholder">
                    {selectedProject?.fileType === 'pdf' ? (
                      <div className="pdf-preview">
                        <div className="pdf-icon">📄</div>
                        <p>PDF Preview</p>
                      </div>
                    ) : (
                      <div className="zip-preview">
                        <div className="zip-icon">📦</div>
                        <p>ZIP Archive Contents</p>
                        <ul className="zip-contents">
                          <li>src/</li>
                          <li>public/</li>
                          <li>package.json</li>
                          <li>README.md</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {!paymentCompleted && (
                  <div className="preview-overlay">
                    <div className="lock-message">
                      <i className="lock-icon">🔒</i>
                      <p>Full preview available after payment</p>
                      <button className="unlock-btn" onClick={showPayment}>Unlock Content</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h2>Complete Payment</h2>
                <button className="close-modal-btn" onClick={closePaymentModal}>×</button>
              </div>
              <div className="payment-content">
                <h3>Purchase: {selectedProject?.name}</h3>
                <p>Price: {selectedProject?.price}</p>
                
                <div className="qr-code">
                  <img src="/api/placeholder/200/200" alt="Payment QR Code" />
                </div>
                
                <p className="payment-instructions">
                  Scan the QR code above with your payment app to complete the purchase.
                </p>
                
                {/* This button simulates completing the payment process */}
                <button className="complete-payment-btn" onClick={processPayment}>
                  {paymentCompleted ? "Payment Completed!" : "Simulate Payment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;