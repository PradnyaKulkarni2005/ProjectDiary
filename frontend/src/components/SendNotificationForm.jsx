import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../pages/LoginPage.css'; // Reusing existing styles

const SendNotificationForm = ({ onClose }) => {
  const [roles] = useState(['student', 'guide', 'coordinator', 'hod']);
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Get senderId from localStorage (ensure it's stored as number)

  const senderId = parseInt(localStorage.getItem("userId"), 10);
 // ← this is the fix

  useEffect(() => {
    if (!selectedRole) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/users-by-role?role=${selectedRole}`);
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || selectedUsers.length === 0) {
      Swal.fire('Error', 'Please select at least one user and enter a message.', 'error');
      return;
    }

    setLoading(true);
    try {
      console.log("📦 Payload being sent:", {
        senderId,
        receiverIds: selectedUsers,
        message
      });

      await axios.post('http://localhost:5000/api/notifications/send', {
        senderId,
        receiverIds: selectedUsers.map((id) => parseInt(id)), // ensure integers
        message
      });

      Swal.fire('Success', 'Notification sent!', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to send notification.', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h3>Send Notification</h3>

      {/* Select Role */}
      <div className="inputForm">
        <label>Role</label>
        <select
          className="input"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setUsers([]); // Reset users
            setSelectedUsers([]); // Reset selection
          }}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Select Users */}
      {selectedRole && (
        <div className="inputForm">
          <label>Users</label>
          <select
            multiple
            className="input"
            value={selectedUsers}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
              setSelectedUsers(selected);
            }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Message */}
      <div className="inputForm" style={{ marginTop: "1rem" }}>
        <label>Message</label>
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

      {/* Buttons */}
      <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <button type="submit" className="button-submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
        <button
          type="button"
          className="button-submit"
          onClick={onClose}
          style={{ backgroundColor: "#ef4444" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SendNotificationForm;
