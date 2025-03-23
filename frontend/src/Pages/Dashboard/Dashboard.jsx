import { useState, useEffect } from "react";
import "./Dashboard.css";
import { FiLogOut } from "react-icons/fi";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("personalDetails");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      issueType,
      description,
      location,
      file
    });
    alert("Issue submitted successfully!");
    
    // Reset form fields after submission
    setIssueType("");
    setDescription("");
    setLocation("");
    setFile(null);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("userId"); // Get JWT token
        console.log(token);

        const response = await fetch("http://localhost:5000/api/user/user-details", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setUserDetails(data);
        } else {
          setError(data.message || "Failed to fetch user details.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="cd-dashboard">
      {/* Sidebar */}
      <div className="cd-sidebar">
        {/* Welcome Banner */}
        <div className="cd-welcome-banner">
          <h2>Welcome back, User!</h2>
        </div>

        {/* Navigation Bar */}
        {/* <nav className="cd-nav">
          <ul>
            <li>
              <button onClick={() => setActiveSection("home")}>Home</button>
            </li>
            <li>
              <button onClick={() => setActiveSection("about")}>About</button>
            </li>
          </ul>
        </nav> */}

        {/* Sidebar Sections */}
        <div className="cd-sidebar-sections">
          <div className="cd-section">
            <button onClick={() => setActiveSection("personalDetails")}>
              👤 Personal Details
            </button>
          </div>
          <div className="cd-section">
            <button onClick={() => setActiveSection("civicIssues")}>
              📋 Civic Issues
            </button>
          </div>
          <div className="cd-section">
            <button onClick={() => setActiveSection("issueTracking")}>
              📊 Issue Tracking
            </button>
          </div>
          <div className="cd-section">
            <button onClick={() => setActiveSection("notifications")}>
              🔔 Notifications
            </button>
          </div>
        </div>

        {/* Logout Option */}
        <nav className="cd-nav">
          <ul>
            <li>
            <button className="cd-button">
                <FiLogOut style={{ marginRight: "8px" }} />
                Logout
            </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="cd-main-content">
        <h1 className="cd-title">Community Engagement & Safety Dashboard</h1>

        {/* Personal Details Section */}
        {activeSection === "personalDetails" && (
          <div className="cd-content">
          <h2>Personal Details</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="cd-table">
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>{userDetails?.name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>{userDetails?.email}</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>{userDetails?.phonenumber}</td>
                </tr>
                <tr>
                  <th>Address:</th>
                  <td>{userDetails?.address}</td>
                </tr>
              </tbody>
            </table>
          )}
          <button className="cd-button">Edit Details</button>
        </div>
        )}

        {/* Civic Issues Section */}
        {activeSection === "civicIssues" && (
          <div className="cd-content">
            <h2>Civic Issues</h2>
            <select className="cd-dropdown" onChange={(e) => setIssueType(e.target.value)}>
              <option value="">Select Issue</option>
              <option value="Streetlight">Streetlight Issues</option>
              <option value="RoadCracks">Road Cracks</option>
              <option value="Garbage">Garbage Pickup</option>
              <option value="Noise">Noise Complaints</option>
              <option value="Other">Other</option>
            </select>
            <br />
            <br />
            <div className="cd-issue-form">
              <textarea className="cd-textarea" placeholder="Issue Description" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
              <input className="cd-file-input" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])}/>
              <input className="cd-text-input" type="text" placeholder="Location" onChange={(e) => setLocation(e.target.value)}/>
              <button className="cd-button" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}

        {/* Issue Tracking Section */}
        {activeSection === "issueTracking" && (
          <div className="cd-content">
            <h2>Issue Tracking</h2>
            <ul>
              <li>
                Garbage Issue - <span className="cd-status cd-resolved">Resolved</span>{" "}
                <a href="#">View Details</a>
              </li>
              <br />
              <li>
                Streetlight Issue -{" "}
                <span className="cd-status cd-in-progress">In Progress</span>{" "}
                <a href="#">View Details</a>
              </li>
            </ul>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <div className="cd-content">
            <h2>Notifications</h2>
            <p>Your garbage issue has been resolved!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
