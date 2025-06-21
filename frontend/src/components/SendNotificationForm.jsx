import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./SendNotificationForm.css";

const SendNotificationForm = ({ senderId, onClose }) => {
  const [roles] = useState(["student", "guide", "coordinator", "hod"]);
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isForAll, setIsForAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedRole) return;
      try {
        const response = await axios.get("http://localhost:5000/api/notifications/users-by-role", {
          params: { role: selectedRole, coordinatorId: senderId },
        });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch users.", "error");
        setUsers([]);
        setFilteredUsers([]);
      }
    };
    fetchUsers();
  }, [selectedRole, senderId]);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(lower) ||
          u.email?.toLowerCase().includes(lower) ||
          u.dept?.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanIds = selectedUserIds.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (!message.trim() || (!isForAll && cleanIds.length === 0)) {
      Swal.fire("Error", "Please select valid users and enter a message.", "error");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/notifications/send", {
        senderId: parseInt(localStorage.getItem("userId"), 10),
        receiverIds: cleanIds,
        message,
        isForAll,
      });
      Swal.fire("Success", "Notification sent!", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to send notification.", "error");
    }
  };

  return (
    <form className="notification-form" onSubmit={handleSubmit}>
      <h2>Send Notification</h2>

      <div className="form-group">
        <label htmlFor="role">Select Role</label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setSelectedUserIds([]);
            setSearchTerm("");
            setIsForAll(false);
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

      {selectedRole && (
        <>
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="sendToAll"
              checked={isForAll}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsForAll(checked);
                setSelectedUserIds(checked ? filteredUsers.map((u) => String(u.id)) : []);
              }}
            />
            <label htmlFor="sendToAll">Send to all students?</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Search by name, email or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box"
            />
          </div>

          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <p className="no-users">No users found.</p>
            ) : (
              filteredUsers.map((user) => (
                <div className="user-item" key={user.id}>
                  <input
                    type="checkbox"
                    value={user.id}
                    checked={selectedUserIds.includes(String(user.id))}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updated = e.target.checked
                        ? [...selectedUserIds, value]
                        : selectedUserIds.filter((id) => id !== value);
                      setSelectedUserIds(updated);
                      if (updated.length !== filteredUsers.length) {
                        setIsForAll(false);
                      }
                    }}
                  />
                  <label>{user.name} ({user.email}) {user.dept && `- ${user.dept}`}</label>
                </div>
              ))
            )}
          </div>

          <div className="form-group">
            <textarea
              placeholder="Enter your message here"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div className="button-group">
        <button type="submit" className="btn primary">Send</button>
        <button type="button" className="btn cancel" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default SendNotificationForm;
