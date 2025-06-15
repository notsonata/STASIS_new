import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css'; // Use the existing module CSS
import Sidebar from './StudentSidebar';

const StudentSchedule = () => {
  const navigate = useNavigate(); // Define navigate
  const [currentWeek, setCurrentWeek] = useState(new Date()); // Define currentWeek state
  const [selectedCourse, setSelectedCourse] = useState('all'); // Define selectedCourse state
  const [selectedClass, setSelectedClass] = useState(null); // Define selectedClass state
  const [showClassModal, setShowClassModal] = useState(false); // Define showClassModal state

  // Sample grades data
  const [gradesList, setGradesList] = useState([
    {
      id: 'GRD001',
      course: 'Computer Programming I',
      section: 'CS-101-A',
      instructor: 'Emily Thompson',
      creditUnits: 3,
      midtermGrade: 85,
      finalGrade: 88,
      overallGrade: 86.5,
      letterGrade: 'B+',
      remarks: 'Passed',
      semester: 'Fall 2024',
      status: 'Completed'
    },
    {
      id: 'GRD002',
      course: 'Database Management',
      section: 'IT-201-B',
      instructor: 'James Chen',
      creditUnits: 3,
      midtermGrade: 92,
      finalGrade: 90,
      overallGrade: 91,
      letterGrade: 'A-',
      remarks: 'Passed',
      semester: 'Fall 2024',
      status: 'Completed'
    },
    {
      id: 'GRD003',
      course: 'Business Ethics',
      section: 'BA-105-A',
      instructor: 'Sarah Martinez',
      creditUnits: 2,
      midtermGrade: 78,
      finalGrade: 82,
      overallGrade: 80,
      letterGrade: 'B-',
      remarks: 'Passed',
      semester: 'Fall 2024',
      status: 'Completed'
    },
    {
      id: 'GRD004',
      course: 'Engineering Mathematics',
      section: 'ENG-102-C',
      instructor: 'Michael Roberts',
      creditUnits: 4,
      midtermGrade: 95,
      finalGrade: 93,
      overallGrade: 94,
      letterGrade: 'A',
      remarks: 'Passed',
      semester: 'Fall 2024',
      status: 'Completed'
    },
    {
      id: 'GRD005',
      course: 'General Psychology',
      section: 'PSY-101-A',
      instructor: 'Rachel Williams',
      creditUnits: 3,
      midtermGrade: 72,
      finalGrade: 75,
      overallGrade: 73.5,
      letterGrade: 'C+',
      remarks: 'Passed',
      semester: 'Fall 2024',
      status: 'Completed'
    },
    {
      id: 'GRD006',
      course: 'Data Structures',
      section: 'CS-201-B',
      instructor: 'Emily Thompson',
      creditUnits: 3,
      midtermGrade: 88,
      finalGrade: null,
      overallGrade: null,
      letterGrade: 'INC',
      remarks: 'In Progress',
      semester: 'Spring 2025',
      status: 'Ongoing'
    },
    {
      id: 'GRD007',
      course: 'Network Administration',
      section: 'IT-301-A',
      instructor: 'James Chen',
      creditUnits: 3,
      midtermGrade: 85,
      finalGrade: null,
      overallGrade: null,
      letterGrade: 'INC',
      remarks: 'In Progress',
      semester: 'Spring 2025',
      status: 'Ongoing'
    },
    {
      id: 'GRD008',
      course: 'Financial Accounting',
      section: 'BA-201-C',
      instructor: 'Sarah Martinez',
      creditUnits: 3,
      midtermGrade: 90,
      finalGrade: null,
      overallGrade: null,
      letterGrade: 'INC',
      remarks: 'In Progress',
      semester: 'Spring 2025',
      status: 'Ongoing'
    }
  ]);

  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [searchTerm, setSearchTerm] = useState('');

  // Semester options
  const semesterOptions = ['Fall 2024', 'Spring 2025'];

  // Statistics calculations
  const completedCourses = gradesList.filter(g => g.status === 'Completed');
  const ongoingCourses = gradesList.filter(g => g.status === 'Ongoing');
  
  // Calculate GPA for completed courses only
  const totalGradePoints = completedCourses.reduce((sum, grade) => {
    return sum + (grade.overallGrade * grade.creditUnits);
  }, 0);
  const totalCreditUnits = completedCourses.reduce((sum, grade) => sum + grade.creditUnits, 0);
  const currentGPA = totalCreditUnits > 0 ? (totalGradePoints / totalCreditUnits / 100 * 4).toFixed(2) : '0.00';
  
  const totalUnitsEarned = completedCourses.reduce((sum, grade) => sum + grade.creditUnits, 0);
  const totalUnitsEnrolled = gradesList.reduce((sum, grade) => sum + grade.creditUnits, 0);

  // Determine enrollment status (sample logic - you can modify this based on your requirements)
  const enrollmentStatus = totalUnitsEnrolled >= 18 ? 'Regular' : 'Irregular';

  // Filter grades based on search and semester
  const filteredGrades = gradesList.filter(grade => {
    const matchesSearch = grade.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'All Semesters' || grade.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  // Get letter grade color class
  const getGradeColor = (letterGrade) => {
    if (letterGrade === 'A' || letterGrade === 'A+') return styles.gradeA;
    if (letterGrade === 'A-' || letterGrade === 'B+') return styles.gradeBPlus;
    if (letterGrade === 'B' || letterGrade === 'B-') return styles.gradeB;
    if (letterGrade === 'C+' || letterGrade === 'C') return styles.gradeC;
    if (letterGrade === 'C-' || letterGrade === 'D') return styles.gradeD;
    if (letterGrade === 'F') return styles.gradeF;
    return styles.gradeInc;
  };

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
        navigate('/student-curriculum');
        break;
      case 'StudentGrades':
        navigate('/student-grades');
        break;
      case 'StudentSettings':
        alert("Settings page here");
        break;
      default:
        // No action for unknown sections
    }
  };

  // Get formatted week range for display
  const getFormattedWeekRange = () => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    } else {
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
  };

  // Navigate to previous week
  const goToPrevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Return today
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Generate days of the week
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Sample schedule data
  const scheduleData = [
    {
      id: 1,
      course: 'Computer Science 101',
      day: 1, // Monday
      startTime: '09:00',
      endTime: '11:00',
      location: 'Room 301',
      instructor: 'Dr. Smith',
      type: 'CS',
      section: 'Section A'
    },
    {
      id: 2,
      course: 'Mathematics 202',
      day: 1, // Monday
      startTime: '13:00',
      endTime: '15:00',
      location: 'Room 201',
      instructor: 'Dr. Johnson',
      type: 'Math',
      section: 'Section B'
    },
    {
      id: 3,
      course: 'Physics 101',
      day: 3, // Wednesday
      startTime: '10:00',
      endTime: '12:00',
      location: 'Lab 102',
      instructor: 'Prof. Williams',
      type: 'Physics',
      section: 'Section A'
    },
    {
      id: 4,
      course: 'English 101',
      day: 4, // Thursday
      startTime: '14:00',
      endTime: '16:00',
      location: 'Room 105',
      instructor: 'Prof. Davis',
      type: 'English',
      section: 'Section C'
    },
    {
      id: 5,
      course: 'Computer Science 102',
      day: 5, // Friday
      startTime: '09:00',
      endTime: '11:00',
      location: 'Room 301',
      instructor: 'Dr. Smith',
      type: 'CS',
      section: 'Section A'
    }
  ];

  // Filter schedule based on selected course
  const filteredSchedule = selectedCourse === 'all' 
    ? scheduleData 
    : scheduleData.filter(item => item.course.includes(selectedCourse));

  // Time slots for the weekly view
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Convert time string to hour number for positioning
  const timeToPosition = (timeString) => {
    const hour = parseInt(timeString.split(':')[0]);
    return hour - 8; // 8AM is our first slot
  };

  // Calculate class item position and height
  const getClassItemStyle = (classItem) => {
    const startPos = timeToPosition(classItem.startTime);
    const endPos = timeToPosition(classItem.endTime);
    const duration = endPos - startPos;
    
    return {
      top: `${startPos * 60}px`,
      height: `${duration * 60}px`
    };
  };

  // Format time for display
  const formatTime = (timeString) => {
    const hour = parseInt(timeString.split(':')[0]);
    const minute = timeString.split(':')[1];
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour}:${minute} ${period}`;
  };

  // Group schedule by day for list view
  const scheduleByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const grouped = {};
    
    days.forEach(day => {
      grouped[day] = [];
    });
    
    filteredSchedule.forEach(item => {
      const day = days[item.day];
      grouped[day].push(item);
    });
    
    return grouped;
  };

  // Show class details modal
  const showClassDetails = (classItem) => {
    setSelectedClass(classItem);
    setShowClassModal(true);
  };

  // Close class details modal
  const closeClassModal = () => {
    setShowClassModal(false);
    setSelectedClass(null);
  };

  const weekDays = getWeekDays();
  const groupedSchedule = scheduleByDay();

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
              { id: 'StudentSettings', label: 'Settings', icon: '⚙️'}
            ]
          }
        ]}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.breadcrumb}>
            <span 
              className={styles.breadcrumbLink} 
              onClick={() => navigate('/student-dashboard')}
            >
              Dashboard
            </span>
            <span className={styles.breadcrumbSeparator}> / </span>
            <span className={styles.breadcrumbCurrent}>My Schedule</span>
          </div>
          
          {/* Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>My Schedule</h1>
          </div>

          {/* Schedule Controls */}
          <div className={styles.scheduleControls}>
            <div className={styles.weekNavigator}>
              <button onClick={goToPrevWeek} className={styles.navButton}>
                &lt; Prev
              </button>
              <div className={styles.currentWeek}>
                {getFormattedWeekRange()}
              </div>
              <button onClick={goToNextWeek} className={styles.navButton}>
                Next &gt;
              </button>
            </div>

            <div className={styles.courseFilter}>
              <select 
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Courses</option>
                {Array.from(new Set(scheduleData.map(item => item.course))).map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Weekly Schedule View */}
          <div className={styles.scheduleContainer}>
            <div className={styles.timeSlots}>
              {timeSlots.map((slot, index) => (
                <div key={index} className={styles.timeSlot}>
                  {slot}
                </div>
              ))}
            </div>

            <div className={styles.daysContainer}>
              {weekDays.map((day, index) => (
                <div key={index} className={styles.dayColumn}>
                  <div className={styles.dayHeader}>{day.toLocaleString('default', { weekday: 'short' })}</div>
                  <div className={styles.dayContent}>
                    {groupedSchedule[day].map((classItem) => (
                      <div 
                        key={classItem.id} 
                        className={styles.classItem} 
                        style={getClassItemStyle(classItem)}
                        onClick={() => showClassDetails(classItem)}
                      >
                        <div className={styles.classTime}>
                          {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                        </div>
                        <div className={styles.classDetails}>
                          <div className={styles.classCourse}>{classItem.course}</div>
                          <div className={styles.classSection}>{classItem.section}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Details Modal */}
          {showClassModal && selectedClass && (
            <div className={styles.classModal}>
              <div className={styles.modalContent}>
                <span className={styles.closeModal} onClick={closeClassModal}>&times;</span>
                <h2 className={styles.modalTitle}>{selectedClass.course} - {selectedClass.section}</h2>
                <div className={styles.modalDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Instructor:</span>
                    <span className={styles.detailValue}>{selectedClass.instructor}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Time:</span>
                    <span className={styles.detailValue}>{formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Location:</span>
                    <span className={styles.detailValue}>{selectedClass.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Type:</span>
                    <span className={styles.detailValue}>{selectedClass.type}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule; // Export with correct name