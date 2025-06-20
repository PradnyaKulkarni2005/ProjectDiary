import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../pages/LoginPage.css";

const SendNotificationForm = ({ senderId, onClose }) => {
  const [roles] = useState(["student", "guide", "coordinator", "hod"]);
  const [selectedRole, setSelectedRole] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
useEffect(() => {
  const fetchUsers = async () => {
    if (!selectedRole) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/users-by-role?role=${selectedRole}`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        console.error("Unexpected data:", response.data);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch users.", "error");
      setUsers([]);
      setFilteredUsers([]);
    }
  };
  fetchUsers();
}, [selectedRole]);


  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower) ||
            u.dept?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, users]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const cleanReceiverIds = selectedUserIds
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id)); // ✅ filters invalid ones

  if (cleanReceiverIds.length === 0 || !message.trim()) {
    Swal.fire("Error", "Please select valid users and enter a message.", "error");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/notifications/send", {
      senderId: parseInt(localStorage.getItem("userId"), 10),
      receiverIds: cleanReceiverIds,
      message,
    });

    Swal.fire("Success", "Notification sent!", "success");
    onClose();
  } catch (error) {
    console.error("❌ Failed to send:", error);
    Swal.fire("Error", "Failed to send notification.", "error");
  }
};

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map((u) => String(u.id)));
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3>Send Notification</h3>

      <div className="inputForm">
        <label style={{ marginRight: "10px" }}>Select Role</label>
        <select
          className="input"
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setSelectedUserIds([]);
            setSearchTerm("");
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
          <div className="inputForm" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Users</label>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="button-submit"
                style={{ width: "auto", padding: "4px 10px", fontSize: "12px", margin: "0" }}
              >
                {selectedUserIds.length === filteredUsers.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name, email or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                margin: "10px 0",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />

            <div className="checkbox-list">
              {filteredUsers.length === 0 ? (
                <p style={{ margin: 0 }}>No users found.</p>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px 0",
                      gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <input
                      type="checkbox"
                      value={user.id}
                      checked={selectedUserIds.includes(String(user.id))}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          setSelectedUserIds([...selectedUserIds, value]);
                        } else {
                          setSelectedUserIds(selectedUserIds.filter((id) => id !== value));
                        }
                      }}
                    />
                    <span>{user.name || "Unnamed"} ({user.email}) {user.dept && `- ${user.dept}`}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="inputForm" style={{ marginTop: "1rem", height: "120px" }}>
            <textarea
              className="input"
              rows="4"
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{ resize: "none", paddingTop: "12px" }}
            />
          </div>
        </>
      )}

      <div className="flex-row" style={{ justifyContent: "space-between", marginTop: "1rem" }}>
        <button type="submit" className="button-submit" style={{ width: "48%" }}>
          Send
        </button>
        <button
          type="button"
          className="button-submit"
          onClick={onClose}
          style={{ backgroundColor: "#ef4444", width: "48%" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SendNotificationForm;
