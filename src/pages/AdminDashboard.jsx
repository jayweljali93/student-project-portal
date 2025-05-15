import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AdminChatbox from "../components/AdminChatbox";
import "../styles/AdminDashboard.css";
import { AlertCircle } from "lucide-react";
import Projects from "./Projects";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const AdminDashboard = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [uploadedProjects, setUploadedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [errorProjects, setErrorProjects] = useState(null);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/admin-login");

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setAdminName(userData.name || "Admin");
        if (userData.role !== "admin") navigate("/student-dashboard");
      }
    };

    const fetchUploadedProjects = () => {
      setLoadingProjects(true);
      setErrorProjects(null);
      try {
        const user = auth.currentUser;
        if (user) {
          const projectsRef = collection(db, "projects");
          const q = query(projectsRef, where("uploadedBy", "==", user.uid));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUploadedProjects(projectsData);
            setLoadingProjects(false);
          });
          return () => unsubscribe();
        }
      } catch (error) {
        setErrorProjects(error.message || "Failed to fetch projects.");
        setLoadingProjects(false);
      }
    };

    fetchAdminInfo();
    fetchStudentList();
    const unsubscribeProjects = fetchUploadedProjects();

    return () => {
      if (unsubscribeProjects) {
        unsubscribeProjects();
      }
    };
  }, []);

  const fetchStudentList = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const studentList = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.role === "student");
    setStudents(studentList);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(console.error);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(`Failed to delete project: ${error.message}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-overview">
            <h2>Welcome, {adminName}</h2>
            <div className="dashboard-cards">
              <div className="card">
                <h4>Total Students</h4>
                <p>{students.length}</p>
              </div>
              <div className="card">
                <h4>Active Courses</h4>
                <p>16</p>
              </div>
              <div className="card">
                <h4>Faculty Members</h4>
                <p>24</p>
              </div>
              <div className="card">
                <h4>New Registrations</h4>
                <p>12 this week</p>
              </div>
            </div>
          </div>
        );

      case "students":
        return (
          <div className="students-tab">
            <h2>Registered Students</h2>
            <Table striped bordered hover className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        );

      case "projects":
        return (
          <div className="projects-tab">
            <div className="project-header">
              <h2>Projects</h2>
              <Projects />
              
            </div>
            {loadingProjects && <p>Loading projects...</p>}
            {errorProjects && (
              <Alert variant="danger" className="d-flex align-items-center gap-2">
                <AlertCircle size={20} />
                <div>{errorProjects}</div>
              </Alert>
            )}

            {!loadingProjects && !errorProjects && (
              <Table striped bordered hover>
             
                <tbody>
                  {uploadedProjects.length > 0 ? (
                    uploadedProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.description}</td>
                        <td>
                          {project.uploadedOn
                            ? new Date(project.uploadedOn.toDate()).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul className="nav-tabs">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Students
          </li>
          <li
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <main className="main-content">{renderTabContent()}</main>
      <AdminChatbox />
    </div>
  );
};

export default AdminDashboard;
