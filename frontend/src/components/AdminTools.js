import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminTools.module.css';
import Sidebar from './Sidebar';

const AdminTools = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for logs
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // State for users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Navigation
  const showSection = (section) => {
    switch(section){
      case 'Dashboard':
        navigate('/admin-dashboard');
        break;
      case 'Curriculum':
        navigate('/curriculum-management');
        break;
      case 'Students':
        navigate('/student-management');
        break;
      case 'Schedule':
        navigate('/schedule-management');
        break;
      case 'Faculty':
        navigate('/faculty-management');
        break;
      case 'Courses':
        navigate('/course-management');
        break;
      case 'Settings':
        navigate('/settings');
        break;
      default:
        // No action for unknown sections
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadLogs();
    loadUsers();
  }, []);

  // Filter logs when search term or filter type changes
  useEffect(() => {
    filterLogs();
  }, [searchTerm, filterType, logs]);

  // Filter users when search term changes
  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/admin/logs');
      // const data = await response.json();
      // setLogs(data);
      setLogs([]); // Empty for now - will be populated by API
    } catch (error) {
      console.error('Error loading logs:', error);
    }
    setIsLoading(false);
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data);
      setUsers([]); // Empty for now - will be populated by API
    } catch (error) {
      console.error('Error loading users:', error);
    }
    setIsLoading(false);
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const exportLogs = () => {
    console.log('Exporting logs...');
    // Implement CSV export functionality
  };

  const resetUserPassword = (userId) => {
    if (window.confirm('Are you sure you want to reset this user\'s password? They will receive an email with a temporary password.')) {
      console.log('Resetting password for user:', userId);
      // Implement password reset functionality
    }
  };

  const toggleUserStatus = (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user account?`)) {
      console.log(`${action} user:`, userId);
      // Implement user status toggle functionality
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  // Pagination
  const getCurrentPageData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  // Settings sections configuration
  const toolSections = [
    { id: 'logs', label: 'System Logs', icon: '📋' },
    { id: 'users', label: 'User Management', icon: '👥' }
  ];

  // Render Logs Section
  const renderLogsSection = () => (
    <div className={styles.adminSectionContent}>
      <div className={styles.adminControls}>
        <div className={styles.adminSearchGroup}>
          <input
            type="text"
            className={styles.adminSearchInput}
            placeholder="Search logs by user, action, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={styles.adminFilterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="error">Error</option>
          </select>
        </div>
        <button className={`${styles.adminBtn} ${styles.adminBtnSecondary}`} onClick={exportLogs}>
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className={styles.adminLoading}>Loading logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div className={styles.adminEmptyState}>
          <div className={styles.adminEmptyIcon}>📋</div>
          <h3>No logs found</h3>
          <p>No system logs match your current search criteria.</p>
        </div>
      ) : (
        <>
          <div className={styles.adminTableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Type</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData(filteredLogs).map((log, index) => (
                  <tr key={index}>
                    <td className={styles.adminTableTimestamp}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className={styles.adminTableUser}>{log.user}</td>
                    <td className={styles.adminTableAction}>{log.action}</td>
                    <td>
                      <span className={`${styles.adminBadge} ${styles[`adminBadge${log.type.charAt(0).toUpperCase() + log.type.slice(1)}`]}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className={styles.adminTableIp}>{log.ipAddress}</td>
                    <td className={styles.adminTableDetails}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getTotalPages(filteredLogs) > 1 && (
            <div className={styles.adminPagination}>
              <button
                className={styles.adminPaginationBtn}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={styles.adminPaginationInfo}>
                Page {currentPage} of {getTotalPages(filteredLogs)}
              </span>
              <button
                className={styles.adminPaginationBtn}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages(filteredLogs)))}
                disabled={currentPage === getTotalPages(filteredLogs)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render Users Section
  const renderUsersSection = () => (
    <div className={styles.adminSectionContent}>
      <div className={styles.adminControls}>
        <div className={styles.adminSearchGroup}>
          <input
            type="text"
            className={styles.adminSearchInput}
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.adminLoading}>Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className={styles.adminEmptyState}>
          <div className={styles.adminEmptyIcon}>👥</div>
          <h3>No users found</h3>
          <p>No users match your current search criteria.</p>
        </div>
      ) : (
        <>
          <div className={styles.adminTableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData(filteredUsers).map((user) => (
                  <tr key={user.id}>
                    <td className={styles.adminTableId}>{user.id}</td>
                    <td className={styles.adminTableName}>{user.name}</td>
                    <td className={styles.adminTableEmail}>{user.email}</td>
                    <td>
                      <span className={`${styles.adminBadge} ${styles[`adminBadgeRole${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.adminBadge} ${styles[`adminBadgeStatus${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className={styles.adminTableTimestamp}>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className={styles.adminTableActions}>
                      <button
                        className={`${styles.adminActionBtn} ${styles.adminActionBtnView}`}
                        onClick={() => viewUserDetails(user)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className={`${styles.adminActionBtn} ${styles.adminActionBtnReset}`}
                        onClick={() => resetUserPassword(user.id)}
                        title="Reset Password"
                      >
                        🔑
                      </button>
                      <button
                        className={`${styles.adminActionBtn} ${user.status === 'active' ? styles.adminActionBtnDeactivate : styles.adminActionBtnActivate}`}
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? '🚫' : '✅'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getTotalPages(filteredUsers) > 1 && (
            <div className={styles.adminPagination}>
              <button
                className={styles.adminPaginationBtn}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className={styles.adminPaginationInfo}>
                Page {currentPage} of {getTotalPages(filteredUsers)}
              </span>
              <button
                className={styles.adminPaginationBtn}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages(filteredUsers)))}
                disabled={currentPage === getTotalPages(filteredUsers)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Get current section data
  const getCurrentSectionData = () => {
    switch(activeSection) {
      case 'logs':
        return {
          title: 'System Logs',
          description: 'View and monitor all system activities and user actions',
          content: renderLogsSection()
        };
      case 'users':
        return {
          title: 'User Management',
          description: 'Manage user accounts, credentials, and access permissions',
          content: renderUsersSection()
        };
      default:
        return {
          title: 'Admin Tools',
          description: 'System administration and monitoring tools',
          content: <div>Select a tool to get started</div>
        };
    }
  };

  const currentSection = getCurrentSectionData();

  return (
    <div className={styles.adminContainer}>
      <Sidebar 
        onNavigate={showSection}
        userInfo={{ name: "David Anderson", role: "Schedule Admin" }}
        sections={[
          {
            items: [{ id: 'Dashboard', label: 'Dashboard', icon: '📊' }]
          },
          {
            label: 'Management',
            items: [
              { id: 'Students', label: 'Students', icon: '👥' },
              { id: 'Curriculum', label: 'Curriculum', icon: '📚' },
              { id: 'Schedule', label: 'Schedule', icon: '📅' },
              { id: 'Faculty', label: 'Faculty', icon: '👨‍🏫' },
              { id: 'Courses', label: 'Courses', icon: '📖' }
            ]
          },
          {
            label: 'System',
            items: [
              { id: 'Settings', label: 'Settings', icon: '⚙️' },
              { id: 'AdminTools', label: 'Admin Tools', icon: '🔧'}
            ]
          }
        ]}
      />
      
      <div className={styles.adminMainContent}>
        <div className={styles.adminHeader}>
          <h1 className={styles.adminTitle}>Admin Tools</h1>
          <p className={styles.adminSubtitle}>System administration and monitoring</p>
        </div>

        <div className={styles.adminContentWrapper}>
          <div className={styles.adminNavSection}>
            <div className={styles.adminNavHeader}>
              <h2 className={styles.adminNavTitle}>Tools</h2>
            </div>
            <div className={styles.adminNavList}>
              {toolSections.map((section) => (
                <div
                  key={section.id}
                  className={`${styles.adminNavItem} ${activeSection === section.id ? styles.adminNavItemActive : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className={styles.adminNavIcon}>{section.icon}</span>
                  {section.label}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.adminMainSection}>
            <div className={styles.adminSectionHeader}>
              <h2 className={styles.adminSectionTitle}>{currentSection.title}</h2>
              <p className={styles.adminSectionDesc}>{currentSection.description}</p>
            </div>
            
            {currentSection.content}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className={styles.adminModalOverlay} onClick={closeUserModal}>
          <div className={styles.adminModalContent} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">User Details</h3>
              <button className="admin-modal-close" onClick={closeUserModal}>×</button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-user-details">
                <div className="admin-user-avatar">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="admin-user-info">
                  <h4>{selectedUser.name}</h4>
                  <p className="admin-user-email">{selectedUser.email}</p>
                  <p className="admin-user-role">{selectedUser.role}</p>
                </div>
              </div>
              
              <div className="admin-user-meta">
                <div className="admin-meta-item">
                  <label>User ID:</label>
                  <span>{selectedUser.id}</span>
                </div>
                <div className="admin-meta-item">
                  <label>Status:</label>
                  <span className={`admin-badge admin-badge-status-${selectedUser.status}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className="admin-meta-item">
                  <label>Created:</label>
                  <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="admin-meta-item">
                  <label>Last Login:</label>
                  <span>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</span>
                </div>
                <div className="admin-meta-item">
                  <label>Department:</label>
                  <span>{selectedUser.department || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTools;