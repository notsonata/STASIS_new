import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // Use the existing module CSS
import Sidebar from './StudentSidebar';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setStudentDashboardData] = useState({
    recentActivities: []
  });

  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showGraduationModal, setShowGraduationModal] = useState(false);
  
  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: '',
    semester: '',
    academicYear: '',
    courses: []
  });

  const [graduationForm, setGraduationForm] = useState({
    studentId: '',
    program: '',
    expectedGraduation: '',
    applicationDate: ''
  });

  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  // Generate calendar days for the selected month/year
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calendarYear, calendarMonth, 0).getDate();

    // Previous month's ending days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isSelected: day === selectedDate && calendarMonth === today.getMonth() && calendarYear === today.getFullYear(),
        isToday: day === today.getDate() && calendarMonth === today.getMonth() && calendarYear === today.getFullYear()
      });
    }

    return days;
  };

  // Calendar navigation handlers
  const goToPrevMonth = () => {
    setCalendarMonth(prev => {
      if (prev === 0) {
        setCalendarYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    setCalendarMonth(prev => {
      if (prev === 11) {
        setCalendarYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
    setSelectedDate(1);
  };

  // Enrollment Modal functions
  const showEnrollmentForm = () => {
    setShowEnrollmentModal(true);
  };

  const closeEnrollmentModal = () => {
    setShowEnrollmentModal(false);
    setEnrollmentForm({
      studentId: '',
      semester: '',
      academicYear: '',
      courses: []
    });
  };

  const handleEnrollmentFormChange = (field, value) => {
    setEnrollmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnrollment = () => {
    // Validate required fields
    if (!enrollmentForm.studentId || !enrollmentForm.semester || !enrollmentForm.academicYear) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Processing enrollment:', enrollmentForm);
    alert('Enrollment processed successfully!');
    closeEnrollmentModal();
  };

  // Graduation Modal functions
  const showGraduationForm = () => {
    setShowGraduationModal(true);
  };

  const closeGraduationModal = () => {
    setShowGraduationModal(false);
    setGraduationForm({
      studentId: '',
      program: '',
      expectedGraduation: '',
      applicationDate: ''
    });
  };

  const handleGraduationFormChange = (field, value) => {
    setGraduationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGraduation = () => {
    // Validate required fields
    if (!graduationForm.studentId || !graduationForm.program || !graduationForm.expectedGraduation) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Processing graduation application:', graduationForm);
    alert('Graduation application submitted successfully!');
    closeGraduationModal();
  };

  // Add these missing data arrays
  const scheduleData = [
    {
      id: 1,
      time: "8:00 AM",
      subject: "Mathematics",
      room: "Room 101",
      type: "blue"
    },
    {
      id: 2,
      time: "10:00 AM",
      subject: "Physics",
      room: "Lab 201",
      type: "green"
    },
    {
      id: 3,
      time: "2:00 PM",
      subject: "Chemistry",
      room: "Lab 301",
      type: "blue"
    }
  ];

  const semesterOptions = [
    "1st Semester",
    "2nd Semester", 
    "Summer"
  ];

  const academicYearOptions = [
    "2024-2025",
    "2025-2026",
    "2026-2027"
  ];

  const programs = [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Technology",
    "Bachelor of Engineering",
    "Bachelor of Science in Mathematics",
    "Bachelor of Arts",
    "Master of Science in Computer Science",
    "Master of Business Administration"
  ];

  // Navigation
  const showSection = (section) => {
    switch(section){
      case 'Dashboard':
        navigate('/student-dashboard');
        break;
      case 'StudentSchedule':
        navigate('/student-schedule');
        break;
      case 'Enrollment':
        alert("Enrollment page here");
        break;
      case 'StudentCurriculum':
        alert("Curriculum page here");
        break;
      case 'StudentGrades':
        navigate('/student-grades');
        break;
      case 'Settings':
        navigate('/settings');
        break;
      default:
        // No action for unknown sections
    }
  };

  const calendarDays = generateCalendarDays();
  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar 
        onNavigate={showSection}
        userInfo={{ name: "John Smith", role: "Student" }}
        sections={[
          {
            items: [{ id: 'Dashboard', label: 'Dashboard', icon: '📊' }]
          },
          {
            label: 'Management',
            items: [
              { id: 'StudentSchedule', label: 'Schedule', icon: '📅' },
              { id: 'Enrollment', label: 'Enrollment', icon: '📝' },
              { id: 'StudentCurriculum', label: 'Curriculum', icon: '📚' },
              { id: 'StudentGrades', label: 'Grades', icon: '📈' }
            ]
          },
          {
            label: 'System',
            items: [
              { id: 'Settings', label: 'Settings', icon: '⚙️'}
            ]
          }
        ]}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardWelcomeTitle}>Welcome back, Student</h1>
        </div>

        {/* Content Wrapper */}
        <div className={styles.dashboardContentWrapper}>
          {/* Main Left Section */}
          <div className={styles.dashboardMainSection}>
            <div className={styles.dashboardMainGrid}>
              {/* Quick Actions */}
              <div className={styles.dashboardSectionCard}>
                <div className={styles.dashboardSectionHeader}>
                  <h2 className={styles.dashboardSectionTitle}>Quick Actions</h2>
                </div>
                <div className={styles.dashboardActionsGrid}>
                  <div className={styles.dashboardActionBtn} onClick={showEnrollmentForm}>
                    <div className={styles.dashboardActionTitle}>Enrollment for Next Sem</div>
                    <div className={styles.dashboardActionDesc}>Process student enrollment</div>
                  </div>
                  <div className={styles.dashboardActionBtn} onClick={showGraduationForm}>
                    <div className={styles.dashboardActionTitle}>Application for Graduation</div>
                    <div className={styles.dashboardActionDesc}>Submit graduation application</div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className={styles.dashboardSectionCard}>
                <div className={styles.dashboardSectionHeader}>
                  <h2 className={styles.dashboardSectionTitle}>Recent Activities</h2>
                </div>
                <div className={styles.dashboardActivityList}>
                  {dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className={styles.dashboardActivityItem}>
                      <div className={styles.dashboardActivityContent}>
                        <div className={styles.dashboardActivityMessage}>{activity.message}</div>
                        <div className={styles.dashboardActivityTime}>{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={styles.dashboardRightSidebar}>
            {/* Calendar */}
            <div className={styles.dashboardCalendarSection}>
              <div className={styles.dashboardCalendarHeaderSection}>
                <h2 className={styles.dashboardCalendarTitle}>Calendar</h2>
              </div>
              <div className={styles.dashboardCalendarContent}>
                <div className={styles.dashboardCalendarMonth} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.dashboardCalendarNavBtn}`} 
                    onClick={goToPrevMonth}
                  >&lt;</button>
                  <span>
                    {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    className={`${styles.btn} ${styles.btnSecondary} ${styles.dashboardCalendarNavBtn}`} 
                    onClick={goToNextMonth}
                  >&gt;</button>
                </div>
                <div className={styles.dashboardCalendarGrid}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className={styles.dashboardCalendarDayHeader}>{day}</div>
                  ))}
                  {calendarDays.map((dayObj, index) => {
                    let dayClasses = [styles.dashboardCalendarDay];
                    if (dayObj.isCurrentMonth) dayClasses.push(styles.dashboardCalendarDayCurrentMonth);
                    if (dayObj.isSelected) dayClasses.push(styles.dashboardCalendarDaySelected);
                    if (dayObj.isToday && !dayObj.isSelected) dayClasses.push(styles.dashboardCalendarDayToday);
                    return (
                      <div
                        key={index}
                        className={dayClasses.join(' ')}
                        onClick={() => dayObj.isCurrentMonth && setSelectedDate(dayObj.day)}
                      >
                        {dayObj.day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className={styles.dashboardSectionCard}>
              <div className={styles.dashboardScheduleHeaderSection}>
                <h2 className={styles.dashboardScheduleTitle}>Upcoming Schedule</h2>
              </div>
              <div className={styles.dashboardScheduleContent}>
                {scheduleData.map((item) => (
                  <div 
                    key={item.id} 
                    className={`${styles.dashboardScheduleItem} ${item.type === 'blue' ? styles.dashboardScheduleItemBlue : item.type === 'green' ? styles.dashboardScheduleItemGreen : ''}`}
                  >
                    <div className={styles.dashboardScheduleTime}>{item.time}</div>
                    <div className={styles.dashboardScheduleSubject}>{item.subject}</div>
                    <div className={styles.dashboardScheduleRoom}>{item.room}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Enrollment for Next Semester</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Student ID *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter Student ID"
                    value={enrollmentForm.studentId}
                    onChange={(e) => handleEnrollmentFormChange('studentId', e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Semester *</label>
                  <select
                    className={styles.formInput}
                    value={enrollmentForm.semester}
                    onChange={(e) => handleEnrollmentFormChange('semester', e.target.value)}
                  >
                    <option value="">Select Semester</option>
                    {semesterOptions.map((semester) => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Academic Year *</label>
                  <select
                    className={styles.formInput}
                    value={enrollmentForm.academicYear}
                    onChange={(e) => handleEnrollmentFormChange('academicYear', e.target.value)}
                  >
                    <option value="">Select Academic Year</option>
                    {academicYearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeEnrollmentModal}>
                Cancel
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleEnrollment}>
                Process Enrollment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Graduation Modal */}
      {showGraduationModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Application for Graduation</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Student ID *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter Student ID"
                    value={graduationForm.studentId}
                    onChange={(e) => handleGraduationFormChange('studentId', e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Program *</label>
                  <select
                    className={styles.formInput}
                    value={graduationForm.program}
                    onChange={(e) => handleGraduationFormChange('program', e.target.value)}
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Expected Graduation *</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={graduationForm.expectedGraduation}
                    onChange={(e) => handleGraduationFormChange('expectedGraduation', e.target.value)}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Application Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={graduationForm.applicationDate}
                    onChange={(e) => handleGraduationFormChange('applicationDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeGraduationModal}>
                Cancel
              </button>
              <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleGraduation}>
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;