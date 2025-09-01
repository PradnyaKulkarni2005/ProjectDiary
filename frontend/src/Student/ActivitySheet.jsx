import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { submitActivitySheet, getProjectGroup, getActivitySheet } from '../api';
import styles from'./ActivitySheet.module.css';

export default function ActivitySheet() {
  const [selectedMonth, setSelectedMonth] = useState('Month1');
  const [formData, setFormData] = useState({
    task: '',
    scope: '',
    solution: '',
    remarks: '',
  });
  const [groupid, setGroupid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [isLeader, setIsLeader] = useState(null); // null while loading
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sheetExists, setSheetExists] = useState(false);
  const [loading, setLoading] = useState(false);

  // Decode JWT token and get user/group info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserid(decoded.id);
      setGroupid(decoded.groupid);

      if (!decoded.groupid) {
        setMessage('You must join a project group first.');
        return;
      }

      getProjectGroup(decoded.groupid)
        .then(group => {
          setIsLeader(group.leader_id === decoded.id);
        })
        .catch(() => {
          setMessage('Could not fetch group details');
          setIsLeader(false);
        });
    } catch (err) {
      console.error('Error decoding token:', err);
      setMessage('Invalid token. Please log in again.');
    }
  }, []);

  // Fetch activity sheet when month/group/leader state changes
  useEffect(() => {
    if (!groupid || !selectedMonth || isLeader === null) return;

    const fetchSheet = async () => {
      setLoading(true);
      const sheetId = `${groupid}-${selectedMonth}`;

      try {
        const data = await getActivitySheet(sheetId);
        setFormData({
          task: data.task || '',
          scope: data.scope_of_work || '',
          solution: data.proposed_solution || '',
          remarks: data.guide_remarks || '',
        });
        setSheetExists(true);
        setMessage('');
      } catch (err) {
        if (err.response?.status === 404) {
          setSheetExists(false);

          if (isLeader) {
            // Show empty editable form
            setFormData({ task: '', scope: '', solution: '', remarks: '' });
            setMessage('No existing sheet. You can create one.');
          } else {
            // Non-leader: show empty read-only form
            setFormData({ task: '', scope: '', solution: '', remarks: '' });
            setMessage('No activity sheet available for this month.');
          }
        } else {
          setMessage('Error fetching activity sheet.');
          console.error('Error fetching activity sheet:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSheet();
  }, [groupid, selectedMonth, isLeader]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!groupid || !isLeader) return;

    const payload = {
      groupid,
      month: selectedMonth,
      task: formData.task,
      scope: formData.scope,
      solution: formData.solution,
      remarks: '', // guide remarks not submitted by leader
    };

    try {
      setSubmitting(true);
      await submitActivitySheet(payload);
      setMessage('Activity sheet submitted successfully!');
      setSheetExists(true);
    } catch (err) {
      setMessage(`Error: ${err.message || 'Submission failed'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.activitysheet}>
      <div className={styles.monthsrow}>
        {['Month1', 'Month2', 'Month3', 'Month4'].map((month) => (
          <button
  key={month}
  className={`${styles["month-button"]} ${selectedMonth === month ? styles.active : ""}`}
  onClick={() => setSelectedMonth(month)}
>
  {month}
</button>

        ))}
      </div>

      <h3 className={styles.sheettitle}>Activity Sheet - {selectedMonth}</h3>

      {message && <p className={styles.message}>{message}</p>}

      <label className={styles.inputlabel}>Task / Activity Scheduled</label>
      <textarea
        value={formData.task}
        onChange={handleChange('task')}
        readOnly={!isLeader}
        placeholder="Enter scheduled tasks..."
      />

      <label className={styles.inputlabel}>Scope of Work</label>
      <textarea
        value={formData.scope}
        onChange={handleChange('scope')}
        readOnly={!isLeader}
        placeholder="Describe scope..."
      />

      <label className={styles.inputlabel}>Proposed Solution</label>
      <textarea
        value={formData.solution}
        onChange={handleChange('solution')}
        readOnly={!isLeader}
        placeholder="Proposed solution..."
      />

      <label className={styles.inputlabel}>Guide Remarks</label>
      <textarea
        value={formData.remarks}
        readOnly
        placeholder="Guide's remarks..."
      />

      {isLeader && (
        <button
          className={styles.submitbutton}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting
            ? 'Submitting...'
            : sheetExists
            ? 'Update Activity Sheet'
            : 'Submit Activity Sheet'}
        </button>
      )}
    </div>
  );
}
