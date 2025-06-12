// src/components/SendNotificationForm.jsx
import React, { useState } from "react";
import "./SendNotificationForm"; // use the same css as LoginPage for styling

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
    <div className="modal-overlay">
      <div className="login-container" style={{ width: "400px" }}>
        <form className="form" onSubmit={handleSubmit}>
          <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
            Send Notification
          </h3>

          <div className="flex-column">
            <label>Receiver (Guide)</label>
          </div>
          <div className="inputForm">
            <select
              className="input"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            >
              <option value="">Select guide</option>
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
          <div className="inputForm">
            <textarea
              className="input"
              rows="4"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: "none" }}
            />
          </div>

          <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
            <button type="submit" className="button-submit">
              Send
            </button>
            <button type="button" className="button-submit" onClick={onClose} style={{ backgroundColor: "#ef4444" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendNotificationForm;
