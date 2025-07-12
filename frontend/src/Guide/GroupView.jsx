import React from 'react';
import './GuideSection.css';

export default function GroupView({ groupId }) {
  return (
    <div className="section-container">
      <h2>Student Work for Group {groupId}</h2>
      <div className="work-section">
        <div className="work-card">
          <h3>Activity Sheet</h3>
          <p>View or download activity sheet submissions.</p>
        </div>
        <div className="work-card">
          <h3>Publications</h3>
          <p>Research papers or conference articles.</p>
        </div>
        <div className="work-card">
          <h3>Patents</h3>
          <p>Patent details, statuses, and links.</p>
        </div>
      </div>
    </div>
  );
}
