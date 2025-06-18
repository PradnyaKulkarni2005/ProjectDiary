import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import ActivitySheet from './ActivitySheet';
import ListOfPublications from './ListOfPublications';
import Patents from './Patents';
import CreateGroup from './CreateGroup';
import Notifications from './Notifications';
import { useNavigate } from 'react-router-dom';
import { checkUserGroupStatus } from '../api';
import CoordinatorNotifications from './CoordinatorNotifications';

const fullMenuItems = [
  'Activity Sheet',
  'Meetings',
  'Evaluation',
  'List Of Publications',
  'Patents',
  'Notifications',
];

const preGroupMenuItems = ['Create Group', 'Notifications'];

export default function StudentDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [groupExists, setGroupExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // used to re-render after acceptance
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const currentUser = { id: userId };

  useEffect(() => {
    const fetchGroupStatus = async () => {
      if (!userId || userId === 'null') {
        console.warn('User ID not found');
        navigate('/login');
        return;
      }

      try {
        const res = await checkUserGroupStatus(userId);
        setGroupExists(res.hasGroup);
        setSelectedMenu(res.hasGroup ? 'Activity Sheet' : 'Create Group');
      } catch (err) {
        console.error('Failed to check group status:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupStatus();
  }, [userId, navigate, refreshKey]); // run when refreshKey changes

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Callback passed to Notifications to trigger refresh on acceptance
  const handleInviteAccepted = () => {
    setRefreshKey((prev) => prev + 1); // Triggers recheck of group status
  };

  const renderComponent = () => {
    if (loading) return <div>Loading...</div>;

    if (!groupExists) {
      switch (selectedMenu) {
        case 'Create Group':
          return <CreateGroup />;
        case 'Notifications':
          return (
            <>
              <Notifications currentUser={currentUser} onInviteAccepted={handleInviteAccepted} />
              <CoordinatorNotifications userId={currentUser} />
            </>
          );
        default:
          return <div>Select a section from the menu.</div>;
      }
    }

    switch (selectedMenu) {
      case 'Activity Sheet':
        return <ActivitySheet />;
      case 'List Of Publications':
        return <ListOfPublications />;
      case 'Patents':
        return <Patents />;
      case 'Notifications':
        return (
          <>
            <Notifications currentUser={currentUser} />
            <CoordinatorNotifications userId={userId} />
          </>
        );
      default:
        return <div>Select a section from the menu.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Student Portal</h2>
        <nav className="menu">
          {(groupExists ? fullMenuItems : preGroupMenuItems).map((item, index) => (
            <div
              key={index}
              className={`menu-item ${selectedMenu === item ? 'active' : ''}`}
              onClick={() => setSelectedMenu(item)}
            >
              {item}
            </div>
          ))}
          <button className="hero-button" onClick={() => navigate('/student-dashboard')}>
            Back to Dashboard
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>
      <main className="main-content">{renderComponent()}</main>
    </div>
  );
}
