import React from 'react';
import styles from './StudentSidebar.module.css';

// Updated function with consistent route naming
const getActivePageFromURL = () => {
  const path = window.location.pathname;
  
  if (path === '/student-dashboard' || path === '/') {
    return 'Dashboard';
  } else if (path === '/student-schedule') {
    return 'Schedule';
  } else if (path === '/student-enrollment') {
    return 'Enrollment';
  } else if (path === '/student-grades') {
    return 'Grades';
  } else if (path === '/student-curriculum') {
    return 'Curriculum';
  } else if (path === '/student-settings') {
    return 'Settings';
  }
  
  return '';
};

const StudentSidebar = ({ onNavigate }) => {
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
              className={`${styles.navItem} ${activePage === 'Dashboard' ? styles.activePage : ''}`}
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
              className={`${styles.navItem} ${activePage === 'Schedule' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Schedule')}
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
              className={`${styles.navItem} ${activePage === 'Grades' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Grades')}
            >
              📈 Grades
            </div>
            <div
              className={`${styles.navItem} ${activePage === 'Curriculum' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Curriculum')}
            >
              📚 Curriculum
            </div>
          </div>
        </div>
        <div className={styles.navSection}>
          <div className={styles.navLabel}>System</div>
          <div className={styles.navItems}>
            <div
              className={`${styles.navItem} ${activePage === 'Settings' ? styles.activePage : ''}`}
              onClick={() => onNavigate('Settings')}
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