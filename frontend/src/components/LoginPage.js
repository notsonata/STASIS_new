import React from 'react';
import styles from './LoginPage.module.css';
import { FaGraduationCap, FaUserTie, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Ensure you have logo.png in frontend/src/assets/images/
const logo = require('../assets/images/logo.png');

const LoginPage = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Update the handler to use navigate
  const handleRoleSelection = (role) => {
    console.log(`Navigating to ${role} login view`);
    if (role === 'student') {
      navigate('/login/student'); // Navigate to student route
    } else if (role === 'faculty') {
      navigate('/login/faculty'); // Navigate to faculty route
    }
  };

  return (
    <div className={styles.loginPage}>
      {/* Left Side - Image Section */}
      <div className={styles.loginImageSection}>
        <div className={styles.loginLogo}>
          <img src={logo} alt="Academy Logo" />
        </div>
        <div className={styles.loginImageText}>
          <h2>Science and Technology Academy</h2>
          <p>Helping students step towards brighter tomorrow.</p>
        </div>
      </div>

      {/* Right Side - Form/Selection Section */}
      <div className={styles.loginFormSection}>
        <h1>Hi!</h1>
        <p className={styles.continueAsLabel}>Continue as</p>

        {/* Role Selection: Student */}
        <button
          className={styles.roleButton}
          onClick={() => handleRoleSelection('student')}
          aria-label="Continue as Student"
        >
          <div className={styles.roleButtonContent}>
            <span className={styles.roleButtonIcon}><FaGraduationCap /></span>
            <span className={styles.roleButtonText}>Student</span>
          </div>
          <span className={styles.roleButtonArrow}><FaChevronRight /></span>
        </button>

        {/* Role Selection: Faculty */}
        <button
          className={styles.roleButton}
          onClick={() => handleRoleSelection('faculty')}
          aria-label="Continue as Faculty"
        >
          <div className={styles.roleButtonContent}>
            <span className={styles.roleButtonIcon}><FaUserTie /></span>
            <span className={styles.roleButtonText}>Faculty</span>
          </div>
          <span className={styles.roleButtonArrow}><FaChevronRight /></span>
        </button>

        {/* Footer Links */}
        <div className={styles.loginFooter}>
          {/* Replace # with actual links eventually */}
          <a href="#">Privacy Policy</a>
          <a href="#">About Us</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;