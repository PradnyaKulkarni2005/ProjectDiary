import React, { useEffect, useState } from 'react';
import {
  getInvitations,
  respondToInvitation,
  getGroupMemberStatuses
} from '../api';
import './Notifications.css';

const Notifications = ({ currentUser, onInviteAccepted }) => {
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

      // Remove this invitation from UI after response
      setNotifications((prev) => prev.filter((inv) => inv.group_id !== groupId));

      // Refresh member status
      const memberStatusData = await getGroupMemberStatuses(currentUser.id);
      setMemberStatuses(memberStatusData.members || []);

      // Notify dashboard to re-check group status
      if (action === 'accepted' && typeof onInviteAccepted === 'function') {
        onInviteAccepted();
      }

    } catch (err) {
      console.error('Error responding to invitation:', err);
      alert(err.message || 'Error updating status');
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="notification-container">
      <h2>Group Notifications</h2>

      {/* Invitations received */}
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

      {/* If user is leader, show group members */}
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

      {/* Fallback message */}
      {notifications.length === 0 && memberStatuses.length === 0 && (
        <p>No invitations or group members found.</p>
      )}
    </div>
  );
};

export default Notifications;
