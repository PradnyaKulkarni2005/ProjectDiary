import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUsers } from 'react-icons/fa';
import { getInvitations, respondToInvitation, getGroupMemberStatuses } from '../api';
import './Notifications.css';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'success',
        title: `You have ${action} the invitation.`,
        text: `Group ID: ${groupId}`,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: 'top-middle',
      });


      setNotifications((prev) => prev.filter((inv) => inv.group_id !== groupId));

      const memberStatusData = await getGroupMemberStatuses(currentUser.id);
      setMemberStatuses(memberStatusData.members || []);

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
    <div className="notification-container1">
      <h2><FaUsers style={{ marginRight: '10px', color: '#4e91fc' }} /> Group Notifications</h2>

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
                  <button onClick={() => handleResponse(inv.group_id, 'accepted')}>
                    <FaCheckCircle /> Accept
                  </button>
                  <button onClick={() => handleResponse(inv.group_id, 'rejected')}>
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

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
                  <td data-label="Name">{member.name}</td>
                  <td data-label="PRN">{member.prn}</td>
                  <td data-label="Status">{member.status}</td>
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
