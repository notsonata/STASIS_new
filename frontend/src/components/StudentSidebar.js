import React from 'react';
import './StudentSidebar.module.css';

// Utility function to get active page from current URL
const getActivePageFromURL = () => {
  const path = window.location.pathname;
  
  if (path === '/student-dashboard' || path === '/') {
    return 'StudentDashboard';
  } else if (path === '/student-schedule') {
    return 'StudentSchedule';
  } else if (path === '/enrollment') {
    return 'Enrollment';
  } else if (path === '/student-grades') {
    return 'StudentGrades';
  } else if (path === '/student-curriculum') {
    return 'StudentCurriculum';
  } else if (path === '/student-settings') {
    return 'StudentSettings';
  }
  
  // Return empty string if no match so nothing is highlighted
  return '';
};

const StudentSidebar = ({ onNavigate, userInfo }) => {
  // Automatically determine active page from URL instead of using prop
  const activePage = getActivePageFromURL();
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userInfo?.name) return 'S';
    const names = userInfo.name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0][0] || 'S';
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">S</div>
      </div>
      <div className="sidebar-content">
        <div className="nav-section">
          <div className="nav-label">Main</div>
          <div className="nav-items">
            <div
              className={`nav-item${activePage === 'StudentDashboard' ? ' active-page' : ''}`}
              onClick={() => onNavigate('StudentDashboard')}
            >
              📊 Dashboard
            </div>
          </div>
        </div>
        <div className="nav-section">
          <div className="nav-label">Academic</div>
          <div className="nav-items">
            <div
              className={`nav-item${activePage === 'StudentSchedule' ? ' active-page' : ''}`}
              onClick={() => onNavigate('StudentSchedule')}
            >
              📅 Schedule
            </div>
            <div
              className={`nav-item${activePage === 'Enrollment' ? ' active-page' : ''}`}
              onClick={() => onNavigate('Enrollment')}
            >
              📝 Enrollment
            </div>
            <div
              className={`nav-item${activePage === 'StudentGrades' ? ' active-page' : ''}`}
              onClick={() => onNavigate('StudentGrades')}
            >
              📈 Grades
            </div>
            <div
              className={`nav-item${activePage === 'StudentCurriculum' ? ' active-page' : ''}`}
              onClick={() => onNavigate('StudentCurriculum')}
            >
              📚 Curriculum
            </div>
          </div>
        </div>
        <div className="nav-section">
          <div className="nav-label">System</div>
          <div className="nav-items">
            <div
              className={`nav-item${activePage === 'StudentSettings' ? ' active-page' : ''}`}
              onClick={() => onNavigate('StudentSettings')}
            >
              ⚙️ Settings
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={() => {
          if (window.confirm('Are you sure you want to log out?')) {
            window.location.href = '/';
          }
        }}>
          🚪 Log Out
        </button>
        <div className="user-profile">
          <div className="user-avatar">{getUserInitials()}</div>
          <div className="user-info">
            <div className="user-name">{userInfo?.name || 'Student'}</div>
            <div className="user-role">{userInfo?.role || 'Student'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;