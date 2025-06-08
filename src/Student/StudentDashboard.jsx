// StudentDashboard.js
import React, { useState } from 'react';
import './StudentDashboard.css';
import ActivitySheet from './ActivitySheet';
import ListOfPublications from './ListOfPublications';


const menuItems = [
  'Activity Sheet',
  'Meetings',
  'Evaluation',
  'List Of Publications',
  'Patents',
  'National Journal',
];

export default function StudentDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('Activity Sheet');

  const renderComponent = () => {
    switch (selectedMenu) {
      case 'Activity Sheet':
        return <ActivitySheet />;
      case 'List Of Publications':
        return <ListOfPublications />;

      default:
        return <div>Select a section from the menu.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Student Portal</h2>
        <nav className="menu">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${selectedMenu === item ? 'active' : ''}`}
              onClick={() => setSelectedMenu(item)}
            >
              {item}
            </div>
          ))}
          <button className="hero-button">Back to Dashboard</button>
        </nav>
      </aside>
      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  );
}
