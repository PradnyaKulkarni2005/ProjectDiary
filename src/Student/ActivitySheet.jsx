// components/ActivitySheet.js
import React, { useState } from 'react';
import './ActivitySheet.css';

export default function ActivitySheet() {
  const [selectedMonth, setSelectedMonth] = useState('Month 1');
  const [formData, setFormData] = useState({
    task: '',
    scope: '',
    solution: '',
    remarks: '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="activity-sheet">
      <div className="months-row">
        {['Month 1', 'Month 2', 'Month 3', 'Month 4'].map((month) => (
          <button
            key={month}
            className={`month-button ${selectedMonth === month ? 'active' : ''}`}
            onClick={() => setSelectedMonth(month)}
          >
            {month}
          </button>
        ))}
      </div>

      <h3 className="sheet-title">Activity Sheet - {selectedMonth}</h3>

      <label className="input-label">Task / Activity Scheduled</label>
      <textarea
        value={formData.task}
        onChange={handleChange('task')}
        placeholder="Enter scheduled tasks or activities..."
      />

      <label className="input-label">Scope of Work</label>
      <textarea
        value={formData.scope}
        onChange={handleChange('scope')}
        placeholder="Describe the scope of work..."
      />

      <label className="input-label">Proposed Solution</label>
      <textarea
        value={formData.solution}
        onChange={handleChange('solution')}
        placeholder="Describe the proposed solution..."
      />

      <label className="input-label">Guide Remarks</label>
      <textarea
        value={formData.remarks}
        onChange={handleChange('remarks')}
        placeholder="Remarks from the guide..."
      />
    </div>
  );
}
