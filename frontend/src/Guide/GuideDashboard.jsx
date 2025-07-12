import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Student/StudentDashboard.css';
import GuideNotifications from './GuideNotifications';
import ScheduleMeetings from './ScheduleMeetings';
import ReviewEvaluation from './ReviewEvaluation';
import GroupView from './GroupView';

// Icons
import {
  FaBell,
  FaUsers,
  FaClipboardList,
  FaCalendarAlt,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function GuideDashboard() {
  const [selectedMenu, setSelectedMenu] = useState('Notifications');
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fake guideId for testing
    const guideId = 'mockGuide123';
    localStorage.setItem('userId', guideId);

    // Simulated group data for frontend only
    const mockGroups = [
      { group_id: 1 },
      { group_id: 2 },
      { group_id: 3 },
    ];

    setAssignedGroups(mockGroups);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const renderComponent = () => {
    if (selectedMenu === 'Notifications') {
      return <GuideNotifications guideId="mockGuide123" />;
    }

    const [section, groupId] = selectedMenu.split(':');

    switch (section) {
      case 'Meetings':
        return <ScheduleMeetings groupId={groupId} />;
      case 'Reviews':
        return <ReviewEvaluation groupId={groupId} />;
      case 'StudentDetails':
        return <GroupView groupId={groupId} />;
      default:
        return <div>Select a section from the menu.</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Guide Portal</h2>
        <nav className="menu">
          <div
            className={`menu-item ${selectedMenu === 'Notifications' ? 'active' : ''}`}
            onClick={() => setSelectedMenu('Notifications')}
          >
            <FaBell /> Notifications
          </div>

          {assignedGroups.map((group) => {
            const groupId = group.group_id;
            const expanded = expandedGroups[groupId];

            return (
              <div key={groupId}>
                <div
                  className={`menu-item ${expanded ? 'active' : ''}`}
                  onClick={() => toggleGroup(groupId)}
                >
                  <FaUsers /> Group {groupId}
                </div>

                {expanded && (
                  <>
                    <div
                      className={`menu-item sub-item ${selectedMenu === `Meetings:${groupId}` ? 'active' : ''}`}
                      onClick={() => setSelectedMenu(`Meetings:${groupId}`)}
                    >
                      <FaCalendarAlt /> Schedule Meetings
                    </div>
                    <div
                      className={`menu-item sub-item ${selectedMenu === `Reviews:${groupId}` ? 'active' : ''}`}
                      onClick={() => setSelectedMenu(`Reviews:${groupId}`)}
                    >
                      <FaClipboardList /> Reviews
                    </div>
                    <div
                      className={`menu-item sub-item ${selectedMenu === `StudentDetails:${groupId}` ? 'active' : ''}`}
                      onClick={() => setSelectedMenu(`StudentDetails:${groupId}`)}
                    >
                      <FaFileAlt /> Student Work
                    </div>
                  </>
                )}
              </div>
            );
          })}

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
