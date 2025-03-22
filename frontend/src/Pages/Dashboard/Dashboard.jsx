import { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="cd-dashboard">
      {/* Sidebar */}
      <div className="cd-sidebar">
        {/* Welcome Banner */}
        <div className="cd-welcome-banner">
          <h2>Welcome back, [User’s Name]!</h2>
        </div>

        {/* Navigation Bar */}
        <nav className="cd-nav">
          <ul>
            <li>
              <button onClick={() => setActiveSection("home")}>Home</button>
            </li>
            <li>
              <button onClick={() => setActiveSection("about")}>About</button>
            </li>
          </ul>
        </nav>

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
              <button onClick={() => alert("Logging out...")}>Logout</button>
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
            <table className="cd-table">
              <tbody>
                <tr>
                  <th>Name:</th>
                  <td>[User’s Name]</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>[User’s Email]</td>
                </tr>
                <tr>
                  <th>Phone:</th>
                  <td>[User’s Phone]</td>
                </tr>
                <tr>
                  <th>Address:</th>
                  <td>[User’s Address]</td>
                </tr>
              </tbody>
            </table>
            <button className="cd-button">Edit Details</button>
          </div>
        )}

        {/* Civic Issues Section */}
        {activeSection === "civicIssues" && (
          <div className="cd-content">
            <h2>Civic Issues</h2>
            <select className="cd-dropdown">
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
              <textarea className="cd-textarea" placeholder="Issue Description" rows="4"></textarea>
              <input className="cd-file-input" type="file" accept="image/*,video/*" />
              <input className="cd-text-input" type="text" placeholder="Location" />
              <button className="cd-button">Submit</button>
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
