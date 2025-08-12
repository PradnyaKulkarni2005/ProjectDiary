import React, { useState } from 'react';
import './Patents.css';
import { postPatentDetails } from '../api';
import {jwtDecode} from 'jwt-decode';
import Swal from 'sweetalert2';

export default function Patents() {
  // State to store the patent details
  const [patents, setPatents] = useState([
    {
      title: '',
      patentNumber: '',
      applicationNumber: '',
      inventors: '',
      filingDate: '',
      status: 'Filed',
      office: '',
      description: '',
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (index, e) => {
    // Update the patent details in the state
    const { name, value } = e.target;
    const updated = [...patents];
    updated[index][name] = value;
    setPatents(updated);
  };
// add the patents to the state
  const addPatent = () => {
    setPatents([
      ...patents,
      {
        title: '',
        patentNumber: '',
        applicationNumber: '',
        inventors: '',
        filingDate: '',
        status: 'Filed',
        office: '',
        description: '',
      },
    ]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage('');

    try {
      // Decode the JWT token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const decoded = jwtDecode(token);
      const groupId = decoded.groupid || decoded.groupId || decoded.group_id;

      if (!groupId) {
        throw new Error('Group ID not found in token');
      }
// send the patents to the server with the groupid
      const payload = {
        project_group_id: groupId,
        patents,
      };
// send the payload to the server
      await postPatentDetails(payload);
      setMessage('Patent details submitted successfully!');
      Swal.fire({
        title: 'Success',
        text: 'Patent details submitted successfully!',
        icon: 'success',
        position: 'top-start'
      })

    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Failed to submit patent details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="patents-container">
      <h2 className="section-title">Patent Details</h2>

      {patents.map((patent, index) => (
        <div key={index} className="patent-form animate-fade-in">
          <label>Title of the Patent</label>
          <input
            type="text"
            name="title"
            value={patent.title}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Patent Number</label>
          <input
            type="text"
            name="patentNumber"
            value={patent.patentNumber}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Application Number</label>
          <input
            type="text"
            name="applicationNumber"
            value={patent.applicationNumber}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Inventors</label>
          <input
            type="text"
            name="inventors"
            value={patent.inventors}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Filing Date</label>
          <input
            type="date"
            name="filingDate"
            value={patent.filingDate}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Status</label>
          <select
            name="status"
            value={patent.status}
            onChange={(e) => handleChange(index, e)}
          >
            <option value="Filed">Filed</option>
            <option value="Published">Published</option>
            <option value="Granted">Granted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <label>Patent Office</label>
          <input
            type="text"
            name="office"
            value={patent.office}
            onChange={(e) => handleChange(index, e)}
          />

          <label>Abstract / Description</label>
          <textarea
            name="description"
            value={patent.description}
            onChange={(e) => handleChange(index, e)}
            placeholder="Brief abstract of the invention..."
          />
        </div>
      ))}

      <button className="add-button" onClick={addPatent}>
        + Add Another Patent
      </button>

      <button className="submit-button" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Patents'}
      </button>
    </div>
  );
}
