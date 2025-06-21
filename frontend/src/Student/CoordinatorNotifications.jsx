import React, { useEffect, useState } from 'react';
import { getNotificationsByUserId } from '../api';
import './CoordinatorNotifications.css';

const CoordinatorNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByUserId(userId);
        setNotifications(data);
        console.log("Notifications set:", data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="notifications-container">
      <h3>Messages from Coordinator</h3>
      {notifications.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li key={notif.id} className="notification-card">
              <p><strong>From:</strong> {notif.sender_name || 'Unknown Coordinator'}</p>
              <p><strong>Message:</strong> {notif.message}</p>
              <p>
                <em>
                  {notif.created_at
                    ? new Date(notif.created_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'Invalid Date'}
                </em>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoordinatorNotifications;
