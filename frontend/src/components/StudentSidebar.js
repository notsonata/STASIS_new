import React from 'react';
import styles from './StudentSidebar.module.css';

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

const StudentSidebar = ({ onNavigate }) => {
  // Automatically determine active page from URL instead of using prop
  const activePage = getActivePageFromURL();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>S</div>
      </div>
      <div className={styles.sidebarContent}>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Main</div>
          <div className={styles.navItems}>
            <div
              className={`${styles.navItem} ${activePage === 'StudentDashboard' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Dashboard')}
            >
              📊 Dashboard
            </div>
          </div>
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>Academic</div>
          <div className={styles.navItems}>
            <div
              className={`${styles.navItem} ${activePage === 'StudentSchedule' ? styles.activePage : ''}`}
              onClick={() => onNavigate('StudentSchedule')}
            >
              📅 Schedule
            </div>
            <div
              className={`${styles.navItem} ${activePage === 'Enrollment' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Enrollment')}
            >
              📝 Enrollment
            </div>
            <div
              className={`${styles.navItem} ${activePage === 'StudentGrades' ? styles.activePage : ''}`}
              onClick={() => onNavigate('StudentGrades')}
            >
              📈 Grades
            </div>
            <div
              className={`${styles.navItem} ${activePage === 'StudentCurriculum' ? styles.activePage : ''}`}
              onClick={() => onNavigate('StudentCurriculum')}
            >
              📚 Curriculum
            </div>
          </div>
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>System</div>
          <div className={styles.navItems}>
            <div
              className={`${styles.navItem} ${activePage === 'StudentSettings' ? styles.activePage : ''}`}
              onClick={() => onNavigate('StudentSettings')}
            >
              ⚙️ Settings
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sidebarFooter}>
        <button className={styles.logoutButton} onClick={() => {
          if (window.confirm('Are you sure you want to log out?')) {
            window.location.href = '/';
          }
        }}>
          🚪 Log Out
        </button>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>JS</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>John Smith</div>
            <div className={styles.userRole}>Student</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;