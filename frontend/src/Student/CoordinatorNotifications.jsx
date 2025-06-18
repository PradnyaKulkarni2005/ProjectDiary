// CoordinatorNotifications.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CoordinatorNotifications = ({ userId }) => {
const [notifications, setNotifications] = useState([]); // default to array


  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${userId}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]); // fallback to empty array
    }
  };

  fetchNotifications();
}, [userId]);

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Messages from Coordinator</h3>
      {notifications.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
              <p><strong>From:</strong> Coordinator #{notif.sender_id}</p>
              <p><strong>Message:</strong> {notif.message}</p>
              <p><em>{new Date(notif.timestamp).toLocaleString()}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoordinatorNotifications;
