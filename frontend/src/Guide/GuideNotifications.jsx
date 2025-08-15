import React, { useEffect, useState } from 'react';
import { getGuideInvites, respondToInvite } from '../api';
import Swal from 'sweetalert2';
import './GuideNotification.css'; 

export default function GuideNotifications() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // preferenceId being processed

  const fetchInvites = async () => {
    console.log('Fetching guide invites...');
    try {
      setLoading(true);
      const data = await getGuideInvites();
      console.log('Fetched invites:', data);
      setInvites(data.invites || []);
    } catch (err) {
      console.error('Error fetching invites:', err);
      Swal.fire('Error', 'Failed to load invites', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleResponse = async (preferenceId, action) => {
    try {
      setActionLoading(preferenceId);
      const res = await respondToInvite(preferenceId, action);
      Swal.fire('Success', res.message, 'success');
      fetchInvites(); // Refresh list after action
    } catch (err) {
      console.error(`Error ${action}ing invite:`, err);
      Swal.fire('Error', `Failed to ${action} invite`, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div>Loading invites...</div>;

  if (invites.length === 0) {
    return <div>No pending group invites.</div>;
  }

  return (
    <div className="guide-notifications">
      <h2>Pending Group Invites</h2>
      {invites.map(invite => (
        <div key={invite.preference_id} className="invite-card">
          <p><strong>Group ID:</strong> {invite.group_id}</p>
          <p><strong>Status:</strong> {invite.status}</p>
          <p><strong>Members:</strong></p>
          <ul className="invite-members">
            {invite.members.map(m => <li key={m.id}>{m.email}</li>)}
          </ul>

         <div className="invite-actions">
  {(!invite.group_guide_selected && invite.status === 'pending') ? (
    <>
      <button
        onClick={() => handleResponse(invite.preference_id, 'accept')}
        disabled={actionLoading === invite.preference_id}
      >
        {actionLoading === invite.preference_id ? 'Processing...' : 'Accept'}
      </button>
      <button
        onClick={() => handleResponse(invite.preference_id, 'reject')}
        disabled={actionLoading === invite.preference_id}
      >
        {actionLoading === invite.preference_id ? 'Processing...' : 'Reject'}
      </button>
    </>
  ) : (
    <p className="guide-allocated">Guide allocated</p>
  )}
</div>

        </div>
      ))}
    </div>
  );
}
