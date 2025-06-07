import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuideDashboard.css';

function GuideDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container2">
      <h1 className="dashboard-title">Guide Dashboard</h1>
      <div className="button-container">
        <button className="group-button" onClick={() => navigate('/project-dashboard')}>
          Project Group 1
        </button>
        <button className="group-button" onClick={() => navigate('/project-dashboard')}>
          Project Group 2
        </button>
      </div>
    </div>
  );
}

export default GuideDashboard;