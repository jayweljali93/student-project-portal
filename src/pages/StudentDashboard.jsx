import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import StudentChatbox from '../components/StudentChatbox';
import ProfileSection from './ProfileSection';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  
  const [userName, setUserName] = useState('');
  const [projects, setProjects] = useState([]);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorLoadingProjects, setErrorLoadingProjects] = useState(null);

  // Role-based protection
  useEffect(() => {
    const checkRole = async () => {
      if (!user || !user.uid) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role !== "student") {
            navigate("/unauthorized");
          } else {
            setUserName(data.name || 'Student');
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    };

    checkRole();
  }, [user, db, navigate]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      setErrorLoadingProjects(null);
      try {
        const response = await fetch('https://upload-5v3q.onrender.com/projects');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setErrorLoadingProjects("Failed to load learning resources.");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/'))
      .catch((error) => console.log("Logout error:", error));
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
    setPaymentCompleted(true);
    setTimeout(() => closePaymentModal(), 1000);
  };

  const downloadFile = (e) => {
    e.stopPropagation();
    if (!selectedProject) return console.error("No project selected.");
    if (!paymentCompleted && selectedProject?.price !== "$0.00") {
      showPayment(e);
      return;
    }

    const fileId = selectedProject.fileId;
    if (!fileId) return console.error("No file ID provided.");
    
    const downloadUrl = `https://upload-5v3q.onrender.com/download/${fileId}`;
    window.open(downloadUrl, '_blank');
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'zip': return '📦';
      default: return '📁';
    }
  };

  if (loadingProjects) {
    return <div className="dashboard-content"><h2>Loading Learning Resources...</h2></div>;
  }

  if (errorLoadingProjects) {
    return <div className="dashboard-content"><p className="error-message">{errorLoadingProjects}</p></div>;
  }

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <ProfileSection userName={userName} />
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
            <p>You have {projects.length} learning resources available</p>
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
                <div key={project._id} className="project-card" onClick={() => viewProjectDetails(project)}>
                  <div className="project-screenshot">
                    <img src={`/api/placeholder/600/400?text=${project.title}`} alt={project.title} />
                    <div className="file-badge">
                      <span className="file-icon">{getFileIcon(project.fileType)}</span>
                      <span className="file-type">{project.fileType?.toUpperCase()}</span>
                    </div>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="file-info">
                    <span className="file-price">{project.price || 'Free'}</span>
                  </div>
                  <button className="get-code-btn" onClick={(e) => {
                    e.stopPropagation();
                    viewProjectDetails(project);
                  }}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="project-details-viewer">
            <div className="details-header">
              <h2>{selectedProject?.title}</h2>
              <button onClick={closeProjectDetails} className="close-btn">Back to Resources</button>
            </div>
            <div className="project-details">
              <div className="screenshot-container">
                <img src={`/api/placeholder/600/400?text=${selectedProject?.title}`} alt={selectedProject?.title} className="project-full-screenshot" />
                <div className="file-details">
                  <div className="file-type-large">
                    <span className="file-icon-large">{getFileIcon(selectedProject?.fileType)}</span>
                    <span>{selectedProject?.fileType?.toUpperCase()} File</span>
                  </div>
                  <div className="file-info-details">
                    <p><strong>File Name:</strong> {selectedProject?.title || 'N/A'}</p>
                    <p><strong>Price:</strong> {selectedProject?.price || 'Free'}</p>
                  </div>
                  <button className="download-file-btn" onClick={downloadFile}>
                    {paymentCompleted || selectedProject?.price === "$0.00"
                      ? `Download ${selectedProject?.title}`
                      : "Get File (Requires Payment)"}
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
                {!paymentCompleted && selectedProject?.price !== "$0.00" && (
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

        {showPaymentModal && (
          <div className="modal-overlay">
            <div className="payment-modal">
              <div className="modal-header">
                <h2>Complete Payment</h2>
                <button className="close-modal-btn" onClick={closePaymentModal}>×</button>
              </div>
              <div className="payment-content">
                <h3>Purchase: {selectedProject?.title}</h3>
                <p>Price: {selectedProject?.price}</p>
                <div className="qr-code">
                  <img src="/api/placeholder/200/200" alt="Payment QR Code" />
                </div>
                <p className="payment-instructions">
                  Scan the QR code above with your payment app to complete the purchase.
                </p>
                <button className="complete-payment-btn" onClick={processPayment}>
                  {paymentCompleted ? "Payment Completed!" : "Simulate Payment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <StudentChatbox currentStudent={{ name: userName, id: auth.currentUser?.uid }} />
    </div>
  );
};

export default StudentDashboard;
