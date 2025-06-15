import React, { useEffect, useState } from 'react';
import {
  getInvitations,
  respondToInvitation,
  getGroupMemberStatuses
} from '../api';
import './Notifications.css';


const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [memberStatuses, setMemberStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [invitationsData, memberStatusData] = await Promise.all([
          getInvitations(currentUser.id),
          getGroupMemberStatuses(currentUser.id),
        ]);

        setNotifications(invitationsData.invitations || []);
        setMemberStatuses(memberStatusData.members || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) fetchData();
  }, [currentUser]);

  const handleResponse = async (groupId, action) => {
    try {
      await respondToInvitation({ userId: currentUser.id, groupId, action });
      alert(`You have ${action} the invitation.`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.group_id === groupId ? { ...n, status: action } : n
        )
      );
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notification-container">
      <h2>Group Notifications</h2>

      {/* Invitations for members */}
      {notifications.length > 0 && (
        <>
          <h3>Invitations Received</h3>
          {notifications.map((inv, idx) => (
            <div key={idx} className="notification-card">
              <p><strong>Group ID:</strong> {inv.group_id}</p>
              <p><strong>Invited By:</strong> {inv.leader_email}</p>
              <p><strong>Status:</strong> {inv.status}</p>

              {inv.status === 'pending' && (
                <div className="action-buttons">
                  <button onClick={() => handleResponse(inv.group_id, 'accepted')}>Accept</button>
                  <button onClick={() => handleResponse(inv.group_id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Leader's view */}
      {memberStatuses.length > 0 && (
        <>
          <h3>Group Members' Responses</h3>
          <table className="status-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>PRN</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {memberStatuses.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.prn}</td>
                  <td>{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {notifications.length === 0 && memberStatuses.length === 0 && (
        <p>No invitations or group members found.</p>
      )}
    </div>
  );
};

export default Notifications;
