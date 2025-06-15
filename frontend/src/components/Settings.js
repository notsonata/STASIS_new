import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import Sidebar from './Sidebar';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Profile Settings State
  const [profileSettings, setProfileSettings] = useState({
    firstName: 'David',
    lastName: 'Anderson',
    email: 'david.anderson@school.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    position: 'Schedule Admin',
    bio: 'Experienced administrator with 10+ years in educational technology and student information systems.',
    officeLocation: 'Admin Building, Room 201',
    workingHours: '8:00 AM - 5:00 PM'
  });

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: '30'
  });

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
      case 'AdminTools':
        navigate('/admin-tools');
        break;
      default:
        // No action for unknown sections
    }
  };

  // Handle form changes
  const handleProfileChange = (field, value) => {
    setProfileSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleAccountChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Save functions
  const saveSettings = () => {
    // Here you would typically send to API
    console.log('Saving settings for section:', activeSection);
    console.log('Profile:', profileSettings);
    console.log('Account:', accountSettings);
    
    alert('Settings saved successfully!');
    setHasUnsavedChanges(false);
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all changes? This action cannot be undone.')) {
      // Reset to default values based on active section
      switch(activeSection) {
        case 'profile':
          setProfileSettings({
            firstName: 'David',
            lastName: 'Anderson',
            email: 'david.anderson@school.edu',
            phone: '+1 (555) 123-4567',
            department: 'Computer Science',
            position: 'Schedule Admin',
            bio: 'Experienced administrator with 10+ years in educational technology and student information systems.',
            officeLocation: 'Admin Building, Room 201',
            workingHours: '8:00 AM - 5:00 PM'
          });
          break;
        case 'account':
          setAccountSettings({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            twoFactorEnabled: true,
            loginNotifications: true,
            sessionTimeout: '30'
          });
          break;
          default:
            // No action for unknown sections
      }
      setHasUnsavedChanges(false);
      alert('Settings reset to defaults');
    }
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')) {
      console.log('Account deletion requested');
      alert('Account deletion request has been submitted. You will receive an email confirmation shortly.');
    }
  };

  // Settings sections configuration (system preferences removed)
  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account & Security', icon: '🔒' }
  ];

  // Render different sections
  const renderProfileSection = () => (
    <div className={styles.settingsSectionContent}>
      <div className={styles.settingsProfilePhotoSection}>
        <div className={styles.settingsProfilePhoto}>
          {profileSettings.firstName.charAt(0)}{profileSettings.lastName.charAt(0)}
        </div>
        <div className={styles.settingsProfilePhotoInfo}>
          <h3 className={styles.settingsProfilePhotoTitle}>Profile Photo</h3>
          <p className={styles.settingsProfilePhotoDesc}>
            Update your profile photo to help colleagues recognize you
          </p>
          <div className={styles.settingsProfilePhotoActions}>
            <button className={`${styles.settingsBtn} ${styles.settingsBtnPrimary} ${styles.settingsBtnSmall}`}>
              Upload Photo
            </button>
            <button className={`${styles.settingsBtn} ${styles.settingsBtnSecondary} ${styles.settingsBtnSmall}`}>
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className={styles.settingsFormRow}>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>First Name *</label>
          <input
            type="text"
            className={styles.settingsFormInput}
            value={profileSettings.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            placeholder="Enter your first name"
          />
        </div>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Last Name *</label>
          <input
            type="text"
            className={styles.settingsFormInput}
            value={profileSettings.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className={styles.settingsFormGroup}>
        <label className={styles.settingsFormLabel}>Email Address *</label>
        <input
          type="email"
          className={styles.settingsFormInput}
          value={profileSettings.email}
          onChange={(e) => handleProfileChange('email', e.target.value)}
          placeholder="Enter your email address"
        />
      </div>

      <div className={styles.settingsFormRow}>   
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Phone Number</label>
          <input
            type="tel"
            className={styles.settingsFormInput}
            value={profileSettings.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Department</label>
          <select
            className={styles.settingsFormSelect}
            value={profileSettings.department}
            onChange={(e) => handleProfileChange('department', e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Engineering">Engineering</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Administration">Administration</option>
          </select>
        </div>
      </div>

      <div className={styles.settingsFormRow}>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Position</label>
          <input
            type="text"
            className={styles.settingsFormInput}
            value={profileSettings.position}
            onChange={(e) => handleProfileChange('position', e.target.value)}
            placeholder="Enter your position"
          />
        </div>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Office Location</label>
          <input
            type="text"
            className={styles.settingsFormInput}
            value={profileSettings.officeLocation}
            onChange={(e) => handleProfileChange('officeLocation', e.target.value)}
            placeholder="Enter your office location"
          />
        </div>
      </div>

      <div className={styles.settingsFormGroup}>
        <label className={styles.settingsFormLabel}>Working Hours</label>
        <input
          type="text"
          className={styles.settingsFormInput}
          value={profileSettings.workingHours}
          onChange={(e) => handleProfileChange('workingHours', e.target.value)}
          placeholder="e.g., 9:00 AM - 5:00 PM"
        />
      </div>

      <div className={styles.settingsFormGroup}>
        <label className={styles.settingsFormLabel}>Bio</label>
        <div className={styles.settingsFormSublabel}>
          Tell others about yourself and your role in the organization
        </div>
        <textarea
          className={styles.settingsFormTextarea}
          value={profileSettings.bio}
          onChange={(e) => handleProfileChange('bio', e.target.value)}
          placeholder="Write a brief bio about yourself..."
        />
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className={styles.settingsSectionContent}>
      <div className={styles.settingsInfoBox}>
        <h4 className={styles.settingsInfoBoxTitle}>Password Security</h4>
        <p className={styles.settingsInfoBoxDesc}>
          Use a strong password that's at least 8 characters long and includes numbers, letters, and special characters.
        </p>
      </div>

      <div className={styles.settingsFormGroup}>
        <label className={styles.settingsFormLabel}>Current Password</label>
        <input
          type="password"
          className={styles.settingsFormInput}
          value={accountSettings.currentPassword}
          onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
          placeholder="Enter your current password"
        />
      </div>

      <div className={styles.settingsFormRow}>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>New Password</label>
          <input
            type="password"
            className={styles.settingsFormInput}
            value={accountSettings.newPassword}
            onChange={(e) => handleAccountChange('newPassword', e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <div className={styles.settingsFormGroup}>
          <label className={styles.settingsFormLabel}>Confirm New Password</label>
          <input
            type="password"
            className={styles.settingsFormInput}
            value={accountSettings.confirmPassword}
            onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <hr className={styles.settingsDivider} />

      <div className={styles.settingsFormGroup}>
        <div className={styles.settingsFormCheckboxGroup}>
          <input
            type="checkbox"
            className={styles.settingsFormCheckbox}
            checked={accountSettings.twoFactorEnabled}
            onChange={(e) => handleAccountChange('twoFactorEnabled', e.target.checked)}
            id="twoFactor"
          />
          <label htmlFor="twoFactor" className={styles.settingsFormCheckboxLabel}>
            Enable Two-Factor Authentication
            <div className={styles.settingsFormCheckboxDesc}>
              Add an extra layer of security to your account with 2FA
            </div>
          </label>
        </div>
      </div>

      <div className={styles.settingsFormGroup}>
        <div className={styles.settingsFormCheckboxGroup}>
          <input
            type="checkbox"
            className={styles.settingsFormCheckbox}
            checked={accountSettings.loginNotifications}
            onChange={(e) => handleAccountChange('loginNotifications', e.target.checked)}
            id="loginNotifications"
          />
          <label htmlFor="loginNotifications" className={styles.settingsFormCheckboxLabel}>
            Login Notifications
            <div className={styles.settingsFormCheckboxDesc}>
              Get notified when someone logs into your account
            </div>
          </label>
        </div>
      </div>

      <div className={styles.settingsFormGroup}>
        <label className={styles.settingsFormLabel}>Session Timeout</label>
        <div className={styles.settingsFormSublabel}>
          Automatically log out after period of inactivity
        </div>
        <select
          className={styles.settingsFormSelect}
          value={accountSettings.sessionTimeout}
          onChange={(e) => handleAccountChange('sessionTimeout', e.target.value)}
        >
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="240">4 hours</option>
          <option value="480">8 hours</option>
        </select>
      </div>

      <div className={styles.settingsDangerZone}>
        <h4 className={styles.settingsDangerTitle}>Danger Zone</h4>
        <p className={styles.settingsDangerDesc}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className={`${styles.settingsBtn} ${styles.settingsBtnDanger}`} onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );

  // Get current section data
  const getCurrentSectionData = () => {
    switch(activeSection) {
      case 'profile':
        return {
          title: 'Profile Settings',
          description: 'Manage your personal information and profile details',
          content: renderProfileSection()
        };
      case 'account':
        return {
          title: 'Account & Security',
          description: 'Manage your account security and authentication settings',
          content: renderAccountSection()
        };
      default:
        return {
          title: 'Settings',
          description: 'Configure your preferences',
          content: <div>Select a section to configure</div>
        };
    }
  };

  const currentSection = getCurrentSectionData();

  return (
    <div className={styles.settingsContainer}>
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
              { id: 'Settings', label: 'Settings', icon: '⚙️'},
              { id: 'AdminTools', label: 'Admin Tools', icon: '🔧'}
            ]
          }
        ]}
      />
      
      <div className={styles.settingsMainContent}>
        <div className={styles.settingsHeader}>
          <h1 className={styles.settingsTitle}>Settings</h1>
          <p className={styles.settingsSubtitle}>Manage your account and system preferences</p>
        </div>

        <div className={styles.settingsContentWrapper}>
          <div className={styles.settingsNavSection}>
            <div className={styles.settingsNavHeader}>
              <h2 className={styles.settingsNavTitle}>Configuration</h2>
            </div>
            <div className={styles.settingsNavList}>
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  className={`${styles.settingsNavItem} ${activeSection === section.id ? styles.settingsNavItemActive : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className={styles.settingsNavIcon}>{section.icon}</span>
                  {section.label}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.settingsMainSection}>
            <div className={styles.settingsSectionHeader}>
              <h2 className={styles.settingsSectionTitle}>{currentSection.title}</h2>
              <p className={styles.settingsSectionDesc}>{currentSection.description}</p>
            </div>
            
            {currentSection.content}

            <div className={styles.settingsActionButtons}>
              <button 
                className={`${styles.settingsBtn} ${styles.settingsBtnSecondary}`}
                onClick={resetSettings}
              >
                Reset Changes
              </button>
              <button 
                className={`${styles.settingsBtn} ${styles.settingsBtnPrimary}`}
                onClick={saveSettings}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;