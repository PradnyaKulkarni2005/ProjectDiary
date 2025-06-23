// src/pages/CreateGroup.jsx
import React, { useState } from 'react';
import './CreateGroup.css'; // Optional for custom styling
import { createGroup } from '../api'; // Adjust the import path as necessary
import Swal from 'sweetalert2';

const CreateGroup = () => {
  const [leader, setLeader] = useState({
    name: '',
    prn: '',
    email: '',
    department: '',
  });

  const [members, setMembers] = useState([
    { name: '', prn: '', email: '', department: '' },
    { name: '', prn: '', email: '', department: '' },
    { name: '', prn: '', email: '', department: '' },
  ]);

  const handleLeaderChange = (e) => {
    setLeader({ ...leader, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index][e.target.name] = e.target.value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const UserId = localStorage.getItem('userId');
  try {
    const payload = {
      leaderId:UserId,
      members,
    };
    console.log('Payload being sent:', payload);


    const result = await createGroup(payload);
    Swal.fire({
      icon: 'success',
      title: 'Group Invitations sent Successfully',
      text: `Group created with ID: ${result.groupId}`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      position: 'top-middle',
    });

  } catch (err) {
    alert(err.message || 'Server error while creating group');
  }
};

  return (
    <div className="create-group-container">
      <h2>Create Group</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="group-section">
          <legend>Team Leader Details</legend>
          <input name="name" placeholder="Name" value={leader.name} onChange={handleLeaderChange} required />
          <input name="prn" placeholder="PRN" value={leader.prn} onChange={handleLeaderChange} required />
          <input name="email" type="email" placeholder="Email" value={leader.email} onChange={handleLeaderChange} required />
          <input name="department" placeholder="Department" value={leader.department} onChange={handleLeaderChange} required />
        </fieldset>

        <fieldset className="group-section">
          <legend>Team Members</legend>
          {members.map((member, idx) => (
            <div key={idx} className="member-group">
              <h4>Member {idx + 1}</h4>
              <input name="name" placeholder="Name" value={member.name} onChange={(e) => handleMemberChange(idx, e)} required />
              <input name="prn" placeholder="PRN" value={member.prn} onChange={(e) => handleMemberChange(idx, e)} required />
              <input name="email" type="email" placeholder="Email" value={member.email} onChange={(e) => handleMemberChange(idx, e)} required />
              <input name="department" placeholder="Department" value={member.department} onChange={(e) => handleMemberChange(idx, e)} required />
            </div>
          ))}
        </fieldset>

        <button type="submit" className="submit-btn">Submit Group</button>
      </form>
    </div>
  );
};

export default CreateGroup;
