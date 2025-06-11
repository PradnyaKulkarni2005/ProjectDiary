import React, { useState } from "react";
import "./CoordinatorDashboard.css";
import { FaBell, FaUsers, FaEnvelope, FaHome } from "react-icons/fa";
import SendNotificationForm from "../components/SendNotificationForm";

const CoordinatorDashboard = () => {
  const [showForm, setShowForm] = useState(false);

  // Dummy guides list
  const guides = [
    { id: "g1", name: "Guide One" },
    { id: "g2", name: "Guide Two" },
    { id: "g3", name: "Guide Three" },
  ];

  const loggedInCoordinatorId = "c123";

  const handleSendNotification = (notification) => {
    console.log("Notification to save:", notification);
    alert("Notification sent!");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar + Header container */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Project Diary - PCCOE</h1>
        </div>

        <ul className="sidebar-menu">
          <li><FaHome /> Home</li>
          <li><FaUsers /> Group Updates</li>
          <li><FaEnvelope /> Notifications Received</li>
        </ul>

        <button
          className="send-button"
          onClick={() => setShowForm(true)}
          style={{ marginTop: "auto" }} // pushes button to bottom if you want
        >
          <FaBell /> Send Notification
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="welcome-box">
          <h2>Welcome, Coordinator!</h2>
          <p>Select an action from the sidebar to get started.</p>
        </div>
      </main>

      {/* Modal form */}
      {showForm && (
        <SendNotificationForm
          guides={guides}
          senderId={loggedInCoordinatorId}
          onClose={() => setShowForm(false)}
          onSend={handleSendNotification}
        />
      )}
    </div>
  );
};

export default CoordinatorDashboard;
