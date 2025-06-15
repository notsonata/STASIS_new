import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentSchedule.module.css'; // Updated import
import Sidebar from './StudentSidebar';

const StudentSchedule = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('weekly');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('fall2024');
  const [showClassModal, setShowClassModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

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
        alert("Grades page here");
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
    <div className={styles.scheduleContainer}>
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
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Class Schedule</h1>
          <p className={styles.dashboardSubtitle}>View and manage your current class schedule</p>
        </div>

        {/* Schedule Content */}
        <div className={styles.scheduleContent}>
          {/* Header */}
          <div className={styles.scheduleHeader}>
            <h2 className={styles.scheduleTitle}>Your Schedule</h2>
            <div className={styles.scheduleActions}>
              <div className={styles.scheduleViewToggle}>
                <button 
                  className={`${styles.scheduleViewButton} ${viewMode === 'weekly' ? styles.scheduleViewButtonActive : ''}`}
                  onClick={() => setViewMode('weekly')}
                >
                  Weekly View
                </button>
                <button 
                  className={`${styles.scheduleViewButton} ${viewMode === 'list' ? styles.scheduleViewButtonActive : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List View
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.scheduleFilters}>
            <div className={styles.scheduleFilterItem}>
              <label className={styles.formLabel}>Course</label>
              <select 
                className={styles.formSelect}
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className={styles.scheduleFilterItem}>
              <label className={styles.formLabel}>Term</label>
              <select 
                className={styles.formSelect}
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="fall2024">Fall 2024</option>
                <option value="spring2025">Spring 2025</option>
                <option value="summer2025">Summer 2025</option>
              </select>
            </div>
          </div>

          {/* Schedule View - Weekly */}
          {viewMode === 'weekly' && (
            <div className={styles.weeklyCalendar}>
              {/* Week Navigation */}
              <div className={styles.weekNavigation}>
                <span className={styles.currentWeek}>{getFormattedWeekRange()}</span>
                <div className={styles.weekNavigationButtons}>
                  <button className={styles.navButton} onClick={goToPrevWeek}>Previous</button>
                  <button className={styles.navButton} onClick={goToCurrentWeek}>Today</button>
                  <button className={styles.navButton} onClick={goToNextWeek}>Next</button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className={styles.calendarGrid}>
                {/* Time Column */}
                <div className={styles.timeColumn}>
                  <div className={styles.dayHeader}></div>
                  {timeSlots.map((time, index) => (
                    <div key={index} className={styles.timeSlot}>
                      {time}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className={styles.dayColumn}>
                    <div className={styles.dayHeader}>
                      <div className={styles.dayName}>
                        {day.toLocaleString('default', { weekday: 'short' })}
                      </div>
                      <div className={styles.dayDate}>
                        {day.getDate()}
                      </div>
                    </div>
                    {timeSlots.map((_, timeIndex) => (
                      <div key={timeIndex} className={styles.classSlot}>
                        {filteredSchedule
                          .filter(item => item.day === dayIndex)
                          .map(classItem => {
                            const startSlot = timeToPosition(classItem.startTime);
                            if (startSlot === timeIndex) {
                              return (
                                <div 
                                  key={classItem.id}
                                  className={`${styles.classItem} ${styles[`classItem${classItem.type}`]}`}
                                  style={getClassItemStyle(classItem)}
                                  onClick={() => showClassDetails(classItem)}
                                >
                                  <div className={styles.classTitle}>{classItem.course}</div>
                                  <div className={styles.classInfo}>{classItem.location}</div>
                                </div>
                              );
                            }
                            return null;
                          })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule View - List */}
          {viewMode === 'list' && (
            <div className={styles.scheduleList}>
              {Object.entries(groupedSchedule).map(([day, classes]) => {
                if (classes.length === 0) return null;
                
                return (
                  <div key={day} className={styles.scheduleListDay}>
                    <h3 className={styles.scheduleListDayHeader}>{day}</h3>
                    <div className={styles.scheduleListItems}>
                      {classes.map(classItem => (
                        <div 
                          key={classItem.id} 
                          className={styles.scheduleListItem}
                          onClick={() => showClassDetails(classItem)}
                        >
                          <div className={styles.scheduleListTime}>
                            <div className={styles.scheduleListStartTime}>
                              {formatTime(classItem.startTime)}
                            </div>
                            <div className={styles.scheduleListEndTime}>
                              {formatTime(classItem.endTime)}
                            </div>
                          </div>
                          <div className={styles.scheduleListDetails}>
                            <div className={styles.scheduleListCourse}>{classItem.course}</div>
                            <div className={styles.scheduleListInfo}>
                              {classItem.instructor} • {classItem.section}
                            </div>
                            <div className={styles.scheduleListLocation}>{classItem.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* If no classes */}
              {Object.values(groupedSchedule).every(classes => classes.length === 0) && (
                <div className={styles.emptySchedule}>
                  <p className={styles.emptyScheduleText}>No classes found for the selected filters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Class Details Modal */}
      {showClassModal && selectedClass && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{selectedClass.course}</h2>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.classDetailGrid}>
                <div className={styles.classDetailItem}>
                  <div className={styles.classDetailLabel}>Instructor</div>
                  <div className={styles.classDetailValue}>{selectedClass.instructor}</div>
                </div>
                
                <div className={styles.classDetailItem}>
                  <div className={styles.classDetailLabel}>Section</div>
                  <div className={styles.classDetailValue}>{selectedClass.section}</div>
                </div>
                
                <div className={styles.classDetailItem}>
                  <div className={styles.classDetailLabel}>Schedule</div>
                  <div className={styles.classDetailValue}>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedClass.day]},
                    {' ' + formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                  </div>
                </div>
                
                <div className={styles.classDetailItem}>
                  <div className={styles.classDetailLabel}>Location</div>
                  <div className={styles.classDetailValue}>{selectedClass.location}</div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={closeClassModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;