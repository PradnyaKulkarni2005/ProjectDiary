import React, { useState } from "react";
import "./CoordinatorDashboard.css";
import { FaBell, FaUsers, FaEnvelope, FaHome } from "react-icons/fa";
import SendNotificationForm from "../components/SendNotificationForm";

const CoordinatorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home"); // "home", "updates", "notifications", "sendNotification"

  const guides = [
    { id: "g1", name: "Guide One" },
    { id: "g2", name: "Guide Two" },
    { id: "g3", name: "Guide Three" },
  ];

  const loggedInCoordinatorId = "c123";

  const handleSendNotification = (notification) => {
    console.log("Notification to save:", notification);
    alert("Notification sent!");
    setSelectedTab("home"); // Redirect back to home after sending
  };

  // Render center content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "home":
        return (
          <div className="welcome-box">
            <h2>Welcome, Coordinator!</h2>
            <p>Select an action from the sidebar to get started.</p>
          </div>
        );
      case "updates":
        return (
          <div className="welcome-box">
            <h2>Group Updates</h2>
            <p>Here you will see student group submissions and progress.</p>
          </div>
        );
      case "notifications":
        return (
          <div className="welcome-box">
            <h2>Notifications Received</h2>
            <p>Here are the notifications sent to you.</p>
          </div>
        );
      case "sendNotification":
        return (
          <div className="form-wrapper">
            <h2>Send Notification</h2>
            <SendNotificationForm
              guides={guides}
              senderId={loggedInCoordinatorId}
              onClose={() => setSelectedTab("home")}
              onSend={handleSendNotification}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Project Diary - PCCOE</h1>
        </div>

        <ul className="sidebar-menu">
          <li onClick={() => setSelectedTab("home")}><FaHome /> Home</li>
          <li onClick={() => setSelectedTab("updates")}><FaUsers /> Group Updates</li>
          <li onClick={() => setSelectedTab("notifications")}><FaEnvelope /> Notifications Received</li>
        </ul>

        <button
          className="send-button"
          onClick={() => setSelectedTab("sendNotification")}
          style={{ marginTop: "auto" }}
        >
          <FaBell /> Send Notification
        </button>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
