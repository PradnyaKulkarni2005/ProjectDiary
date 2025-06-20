import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CoordinatorDashboard.css";
import { FaBell, FaUsers, FaEnvelope, FaHome, FaTrash } from "react-icons/fa";
import SendNotificationForm from "../components/SendNotificationForm";
import axios from "axios";
import Swal from "sweetalert2";

const CoordinatorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [sentNotifications, setSentNotifications] = useState([]);
  const navigate = useNavigate();

  const senderId = parseInt(localStorage.getItem("userId"), 10);

  const fetchSentNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/sent/${senderId}`);
      setSentNotifications(res.data);
    } catch (err) {
      console.error("Error fetching sent notifications:", err);
    }
  };

  useEffect(() => {
    if (selectedTab === "sentNotifications") {
      fetchSentNotifications();
    }
  }, [selectedTab]);

  const handleDeleteNotification = async (notificationId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the notification for all receivers!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/notifications/delete/${notificationId}`);
        Swal.fire("Deleted!", "Notification has been deleted.", "success");
        fetchSentNotifications(); // Refresh
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Failed to delete notification.", "error");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
      case "sentNotifications":
        return (
          <div className="welcome-box">
            <h2>Sent Notifications</h2>
            {sentNotifications.length === 0 ? (
              <p>No notifications sent yet.</p>
            ) : (
              <ul className="notification-list">
                {sentNotifications.map((n) => (
                  <li key={n.id} className="notification-item">
                    <div>
                      <strong>To:</strong> {n.receiver_name} <br />
                      <strong>Message:</strong> {n.message} <br />
                      <strong>Time:</strong> {new Date(n.created_at).toLocaleString()}
                    </div>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteNotification(n.id)}
                    >
                      <FaTrash style={{ marginRight: "5px" }} />
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "sendNotification":
        return (
          <div className="form-wrapper">
            <h2>Send Notification</h2>
            <SendNotificationForm
              senderId={senderId}
              onClose={() => setSelectedTab("home")}
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
          <li onClick={() => setSelectedTab("sentNotifications")}><FaEnvelope /> Sent Notifications</li>
        </ul>

        <button
          className="send-button"
          onClick={() => setSelectedTab("sendNotification")}
          style={{ marginTop: "auto" }}
        >
          <FaBell /> Send Notification
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default CoordinatorDashboard;
