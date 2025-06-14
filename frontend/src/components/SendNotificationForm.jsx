// src/components/SendNotificationForm.jsx
import React, { useState } from "react";
import "../pages/LoginPage.css"; // Reusing login styles

const SendNotificationForm = ({ guides, senderId, onClose, onSend }) => {
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!receiverId || !message.trim()) {
      alert("Please select a receiver and enter a message.");
      return;
    }

    const notification = {
      senderId,
      receiverId,
      message,
      datetime: new Date().toISOString(),
    };

    onSend(notification);
    onClose();
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      {/* Removed <h3> heading as it's already in CoordinatorDashboard */}
      <div className="flex-column">
        <label>Receiver</label>
      </div>
      <div className="inputForm">
        <select
          className="input"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        >
          <option value="">Select receiver</option>
          {guides.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-column" style={{ marginTop: "1rem" }}>
        <label>Message</label>
      </div>
      <div className="inputForm" style={{ height: "120px" }}>
        <textarea
          className="input"
          rows="4"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          style={{ resize: "none", paddingTop: "12px" }}
        />
      </div>

      <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <button type="submit" className="button-submit" style={{ width: "48%" }}>
          Send
        </button>
        <button
          type="button"
          className="button-submit"
          onClick={onClose}
          style={{ backgroundColor: "#ef4444", width: "48%" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SendNotificationForm;
