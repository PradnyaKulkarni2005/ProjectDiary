import React from 'react';
import './StudentDashboard.css';

const menuItems = [
  'Activity Sheet',
  'Meetings',
  'Evaluation',
  'List Of Publications',
  'Patents',
  'National Journal',
];

export default function StudentDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Student Portal</h2>
        <nav className="menu">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item">
              {item}
            </div>
          ))}
          <button className="hero-button">Back to Dashboard</button>
        </nav>
      </aside>
      <main className="main-content">
        <div className="welcome-card">
          <h3>Welcome!</h3>
          <p>Select an option from the menu to manage your academic activity.</p>
        </div>
      </main>
    </div>
  );
}
