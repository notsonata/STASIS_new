import React from 'react';
import styles from './Sidebar.module.css'; // Import the CSS module

// Utility function to get active page from current URL
const getActivePageFromURL = () => {
  const path = window.location.pathname;
  
  if (path === '/admin-dashboard' || path === '/') {
    return 'Dashboard';
  } else if (path === '/student-management') {
    return 'Students';
  } else if (path === '/curriculum-management') {
    return 'Curriculum';
  } else if (path === '/schedule-management') {
    return 'Schedule';
  } else if (path === '/faculty-management') {
    return 'Faculty';
  } else if (path === '/course-management') {
    return 'Courses';
  } else if (path === '/settings') {
    return 'Settings';
  } else if (path === '/admin-tools') {
    return 'AdminTools';
  }
  
  // Return empty string if no match so nothing is highlighted
  return '';
};

const Sidebar = ({ onNavigate, userInfo = {}, sections = [] }) => {
  // Automatically determine active page from URL instead of using prop
  const activePage = getActivePageFromURL();
  
  // If userInfo is not provided, use defaults
  const name = userInfo.name || "John Stasis";
  const role = userInfo.role || "Admin";
  const initials = name ? name.split(' ').map(n => n[0]).join('') : "DA";
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>S</div>
      </div>
      <div className={styles.sidebarContent}>
        {sections && sections.length > 0 ? (
          // Render sections from props
          sections.map((section, index) => (
            <div key={index} className={styles.navSection}>
              {section.label && <div className={styles.navLabel}>{section.label}</div>}
              <div className={styles.navItems}>
                {section.items && section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.navItem} ${activePage === item.id ? styles.activePage : ''}`}
                    onClick={() => onNavigate(item.id)}
                  >
                    {item.icon} {item.label}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Default sections if none provided
          <>
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
              <div className={styles.navLabel}>Management</div>
              <div className={styles.navItems}>
                <div
                  className={`${styles.navItem} ${activePage === 'Students' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('Students')}
                >
                  👥 Students
                </div>
                <div
                  className={`${styles.navItem} ${activePage === 'Curriculum' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('Curriculum')}
                >
                  📚 Curriculum
                </div>
                <div
                  className={`${styles.navItem} ${activePage === 'Schedule' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('Schedule')}
                >
                  📅 Schedule
                </div>
                <div
                  className={`${styles.navItem} ${activePage === 'Faculty' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('Faculty')}
                >
                  👨‍🏫 Faculty
                </div>
                <div
                  className={`${styles.navItem} ${activePage === 'Courses' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('Courses')}
                >
                  📖 Courses
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
                <div
                  className={`${styles.navItem} ${activePage === 'AdminTools' ? styles.activePage : ''}`}
                  onClick={() => onNavigate('AdminTools')}
                >
                  🔧 Admin Tools
                </div>
              </div>
            </div>
          </>
        )}
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
          <div className={styles.userAvatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <div className={styles.userRole}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;