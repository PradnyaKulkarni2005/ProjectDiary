import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import ActivitySheet from './ActivitySheet';
import ListOfPublications from './ListOfPublications';
import Patents from './Patents';
import CreateGroup from './CreateGroup';
import Notifications from './Notifications';
import CoordinatorNotifications from './CoordinatorNotifications';
import { useNavigate } from 'react-router-dom';
import { checkUserGroupStatus, checkPendingInvites } from '../api';

// Icons
import {
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaBell,
  FaSignOutAlt,
  FaPlusCircle,
  FaLightbulb
} from 'react-icons/fa';

const menuIcons = {
  'Activity Sheet': <FaClipboardList />,
  'Meetings': <FaUsers />,
  'Evaluation': <FaClipboardList />,
  'List Of Publications': <FaFileAlt />,
  'Patents': <FaLightbulb />,
  'Notifications': <FaBell />,
  'Create Group': <FaPlusCircle />,
};

export default function StudentDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [groupExists, setGroupExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPendingInvite, setHasPendingInvite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
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
        const [groupRes, inviteRes] = await Promise.all([
          checkUserGroupStatus(userId),
          checkPendingInvites(userId),
        ]);

        setGroupExists(groupRes.hasGroup);
        setHasPendingInvite(inviteRes.hasPendingInvites);
        console.log('Invitation Status:', inviteRes.hasPendingInvites);

        if (groupRes.hasGroup) {
          setSelectedMenu('Activity Sheet');
        } else if (inviteRes.hasPendingInvites) {
          setSelectedMenu('Notifications');
        } else {
          setSelectedMenu('Create Group');
        }
      } catch (err) {
        console.error('Error fetching status:', err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupStatus();
  }, [userId, navigate, refreshKey]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleInviteAccepted = () => {
    setRefreshKey((prev) => prev + 1); // Refresh group status
  };

  const renderMenu = () => {
    if (groupExists) {
      return [
        'Activity Sheet',
        'Meetings',
        'Evaluation',
        'List Of Publications',
        'Patents',
        'Notifications',
      ];
    } else if (hasPendingInvite) {
      return ['Notifications'];
    } else {
      return ['Create Group', 'Notifications'];
    }
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
          {renderMenu().map((item, index) => (
            <div
              key={index}
              className={`menu-item ${selectedMenu === item ? 'active' : ''}`}
              onClick={() => setSelectedMenu(item)}
            >
              {menuIcons[item]} {item}
            </div>
          ))}

          <button className="hero-button" onClick={() => navigate('/student-dashboard')}>
            Back to Dashboard
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Logout
          </button>
        </nav>
      </aside>
      <main className="main-content">{renderComponent()}</main>
    </div>
  );
}
