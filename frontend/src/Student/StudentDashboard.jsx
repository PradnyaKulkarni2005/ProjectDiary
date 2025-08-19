import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import ActivitySheet from './ActivitySheet';
import ListOfPublications from './ListOfPublications';
import Patents from './Patents';
import CreateGroup from './CreateGroup';
import Notifications from './Notifications';
import CoordinatorNotifications from './CoordinatorNotifications';
import GuidePreferences from './GuidePreference';
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
  'Submit Guide Preferences': <FaLightbulb />
};

export default function StudentDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [groupExists, setGroupExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPendingInvite, setHasPendingInvite] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [groupId, setGroupId] = useState(null);
  const [showGuidePref, setShowGuidePref] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [eligibleForGuidePreferences, setEligibleForGuidePreferences] = useState(false);
  const [allMembersAccepted, setAllMembersAccepted] = useState(false); // 🟢 NEW

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
        setGroupId(groupRes.groupId || null);
        setIsLeader(groupRes.isLeader || false);
        setEligibleForGuidePreferences(groupRes.eligibleForGuidePreferences || false);
        setAllMembersAccepted(groupRes.allMembersAccepted || false); // 🟢 capture from API

        console.log('Group status:', groupRes);

        if (groupRes.isLeader && groupRes.eligibleForGuidePreferences) {
          setShowGuidePref(true);
        }

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

  // 🟢 Updated renderMenu
  const renderMenu = () => {
    if (groupExists) {
      if (!allMembersAccepted) {
        return ['Notifications']; // Only show notifications until all accept
      }

      const baseMenu = [
        'Activity Sheet',
        'Meetings',
        'Evaluation',
        'List Of Publications',
        'Patents',
        'Notifications',
      ];

      if (isLeader && eligibleForGuidePreferences) {
        baseMenu.unshift('Submit Guide Preferences');
      }

      return baseMenu;
    } else if (hasPendingInvite) {
      return ['Notifications'];
    } else {
      return ['Create Group', 'Notifications'];
    }
  };

  // 🟢 Updated renderComponent
  const renderComponent = () => {
    if (loading) return <div>Loading...</div>;

    if (showGuidePref) {
      return (
        <GuidePreferences
          groupId={groupId}
          onSubmitted={() => {
            setShowGuidePref(false);
            setRefreshKey((prev) => prev + 1);
            setEligibleForGuidePreferences(false);
            setSelectedMenu('Activity Sheet');
          }}
        />
      );
    }

    if (!groupExists) {
      switch (selectedMenu) {
        case 'Create Group':
          return (
            <CreateGroup
              onGroupCreated={(newGroupId) => {
                setGroupId(newGroupId);
                setShowGuidePref(true);
              }}
            />
          );
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

    // 🟢 Restrict access until all members accepted
    if (groupExists && !allMembersAccepted) {
      return (
        <div>
          Waiting for all group members to accept the invitation.  
          <Notifications currentUser={currentUser} />
        </div>
      );
    }

    switch (selectedMenu) {
      case 'Submit Guide Preferences':
        return (
          <GuidePreferences
            groupId={groupId}
            onSubmitted={() => {
              setShowGuidePref(false);
              setRefreshKey(prev => prev + 1);
              setEligibleForGuidePreferences(false);
              setSelectedMenu('Activity Sheet');
            }}
          />
        );
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
              onClick={() => {
                if (item === 'Submit Guide Preferences') {
                  setShowGuidePref(true);
                } else {
                  setShowGuidePref(false);
                }
                setSelectedMenu(item);
              }}
            >
              {menuIcons[item]} {item}
            </div>
          ))}

          <button className="herobutton" onClick={() => navigate('/student-dashboard')}>
            Back to Dashboard
          </button>
          <button className="logoutbutton" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Logout
          </button>
        </nav>
      </aside>
      <main className="main-content">{renderComponent()}</main>
    </div>
  );
}
