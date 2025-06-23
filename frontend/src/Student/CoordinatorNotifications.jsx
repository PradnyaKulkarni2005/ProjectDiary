import React, { useEffect, useState } from 'react';
import { getNotificationsByUserId } from '../api';
import './CoordinatorNotifications.css';
import { FaEnvelopeOpenText, FaUserTie, FaClock } from 'react-icons/fa';

const CoordinatorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsByUserId(userId);
        setNotifications(data || []);
        console.log("Notifications set:", data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div className="notifications-container">
      <h3>
        <FaEnvelopeOpenText size={24} color="#003049" />
        Messages from Coordinator
      </h3>

      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>No messages yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li key={notif.id} className="notification-card">
              <p>
                <strong><FaUserTie style={{ marginRight: '6px', color: '#0d1b2a' }} /> From:</strong>{' '}
                {notif.sender_name || 'Unknown Coordinator'}
              </p>
              <p>
                <strong>Message:</strong> {notif.message}
              </p>
              <p>
                <em>
                  <FaClock style={{ marginRight: '5px',color:'#403d39' }} />
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
