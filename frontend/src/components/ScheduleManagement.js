import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ScheduleManagement.module.css';
import Sidebar from './Sidebar';

const ScheduleManagement = () => {
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    course: '',
    section: '',
    instructor: '',
    room: '',
    day: '',
    timeFrom: '',
    timeTo: ''
  });

  // Sample schedule data
  const [scheduleList, setScheduleList] = useState([
    {
      id: 'SCH001',
      course: 'Computer Programming I',
      section: 'CS-101-A',
      instructor: 'Emily Thompson',
      room: 'Room 204',
      day: 'Monday',
      timeFrom: '08:00',
      timeTo: '10:00',
      status: 'Active'
    },
    {
      id: 'SCH002',
      course: 'Database Management',
      section: 'IT-201-B',
      instructor: 'James Chen',
      room: 'Lab 301',
      day: 'Tuesday',
      timeFrom: '10:00',
      timeTo: '12:00',
      status: 'Active'
    },
    {
      id: 'SCH003',
      course: 'Business Ethics',
      section: 'BA-105-A',
      instructor: 'Sarah Martinez',
      room: 'Room 105',
      day: 'Wednesday',
      timeFrom: '14:00',
      timeTo: '16:00',
      status: 'Active'
    },
    {
      id: 'SCH004',
      course: 'Engineering Mathematics',
      section: 'ENG-102-C',
      instructor: 'Michael Roberts',
      room: 'Room 307',
      day: 'Thursday',
      timeFrom: '09:00',
      timeTo: '11:00',
      status: 'Active'
    },
    {
      id: 'SCH005',
      course: 'General Psychology',
      section: 'PSY-101-A',
      instructor: 'Rachel Williams',
      room: 'Room 201',
      day: 'Friday',
      timeFrom: '13:00',
      timeTo: '15:00',
      status: 'Cancelled'
    },
    {
      id: 'SCH006',
      course: 'Data Structures',
      section: 'CS-201-B',
      instructor: 'Emily Thompson',
      room: 'Lab 205',
      day: 'Monday',
      timeFrom: '15:00',
      timeTo: '17:00',
      status: 'Active'
    },
    {
      id: 'SCH007',
      course: 'Network Administration',
      section: 'IT-301-A',
      instructor: 'James Chen',
      room: 'Lab 302',
      day: 'Wednesday',
      timeFrom: '08:00',
      timeTo: '10:00',
      status: 'Completed'
    },
    {
      id: 'SCH008',
      course: 'Financial Accounting',
      section: 'BA-201-C',
      instructor: 'Sarah Martinez',
      room: 'Room 106',
      day: 'Friday',
      timeFrom: '10:00',
      timeTo: '12:00',
      status: 'Active'
    }
  ]);

  const [selectedDay, setSelectedDay] = useState('All Days');
  const [searchTerm, setSearchTerm] = useState('');

  // Course options
  const courseOptions = [
    'Computer Programming I',
    'Computer Programming II',
    'Database Management',
    'Data Structures',
    'Network Administration',
    'Web Development',
    'Software Engineering',
    'Business Ethics',
    'Financial Accounting',
    'Marketing Management',
    'Engineering Mathematics',
    'Physics I',
    'Chemistry Lab',
    'General Psychology',
    'Research Methods'
  ];

  // Instructor options
  const instructorOptions = [
    'Emily Thompson',
    'James Chen',
    'Sarah Martinez',
    'Michael Roberts',
    'Rachel Williams',
    'David Johnson',
    'Lisa Anderson',
    'Mark Wilson',
    'Jennifer Brown',
    'Robert Garcia'
  ];

  // Room options
  const roomOptions = [
    'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
    'Room 201', 'Room 202', 'Room 203', 'Room 204', 'Room 205',
    'Room 301', 'Room 302', 'Room 303', 'Room 304', 'Room 305',
    'Lab 101', 'Lab 102', 'Lab 201', 'Lab 202', 'Lab 301', 'Lab 302',
    'Auditorium A', 'Auditorium B', 'Conference Room'
  ];

  // Day options
  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  // Statistics calculations
  const totalSchedules = scheduleList.length;
  const activeSchedules = scheduleList.filter(s => s.status === 'Active').length;
  const completedSchedules = scheduleList.filter(s => s.status === 'Completed').length;
  const cancelledSchedules = scheduleList.filter(s => s.status === 'Cancelled').length;

  // Filter schedules based on search and day
  const filteredSchedules = scheduleList.filter(schedule => {
    const matchesSearch = schedule.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'All Days' || schedule.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  // Add Schedule Modal functions
  const showAddScheduleForm = () => {
    setShowAddScheduleModal(true);
  };

  const closeAddScheduleModal = () => {
    setShowAddScheduleModal(false);
    setScheduleForm({
      course: '',
      section: '',
      instructor: '',
      room: '',
      day: '',
      timeFrom: '',
      timeTo: ''
    });
  };

  // Edit Schedule Modal functions
  const showEditScheduleForm = (schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      course: schedule.course,
      section: schedule.section,
      instructor: schedule.instructor,
      room: schedule.room,
      day: schedule.day,
      timeFrom: schedule.timeFrom,
      timeTo: schedule.timeTo
    });
    setShowEditScheduleModal(true);
  };

  const closeEditScheduleModal = () => {
    setShowEditScheduleModal(false);
    setEditingSchedule(null);
    setScheduleForm({
      course: '',
      section: '',
      instructor: '',
      room: '',
      day: '',
      timeFrom: '',
      timeTo: ''
    });
  };

  const handleScheduleFormChange = (field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSchedule = () => {
    // Validate required fields
    if (!scheduleForm.course || !scheduleForm.section || !scheduleForm.instructor || 
        !scheduleForm.room || !scheduleForm.day || !scheduleForm.timeFrom || !scheduleForm.timeTo) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate time
    if (scheduleForm.timeFrom >= scheduleForm.timeTo) {
      alert('End time must be after start time');
      return;
    }
    
    // Generate new schedule ID
    const newId = `SCH${String(scheduleList.length + 1).padStart(3, '0')}`;
    
    // Create new schedule object
    const newSchedule = {
      id: newId,
      course: scheduleForm.course,
      section: scheduleForm.section,
      instructor: scheduleForm.instructor,
      room: scheduleForm.room,
      day: scheduleForm.day,
      timeFrom: scheduleForm.timeFrom,
      timeTo: scheduleForm.timeTo,
      status: 'Active'
    };
    
    // Add to schedule list
    setScheduleList(prev => [...prev, newSchedule]);
    
    alert('Schedule added successfully!');
    closeAddScheduleModal();
  };

  const handleEditSchedule = () => {
    // Validate required fields
    if (!scheduleForm.course || !scheduleForm.section || !scheduleForm.instructor || 
        !scheduleForm.room || !scheduleForm.day || !scheduleForm.timeFrom || !scheduleForm.timeTo) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate time
    if (scheduleForm.timeFrom >= scheduleForm.timeTo) {
      alert('End time must be after start time');
      return;
    }
    
    // Create updated schedule object
    const updatedSchedule = {
      ...editingSchedule,
      course: scheduleForm.course,
      section: scheduleForm.section,
      instructor: scheduleForm.instructor,
      room: scheduleForm.room,
      day: scheduleForm.day,
      timeFrom: scheduleForm.timeFrom,
      timeTo: scheduleForm.timeTo
    };
    
    // Update schedule list
    setScheduleList(prev => 
      prev.map(schedule => 
        schedule.id === editingSchedule.id ? updatedSchedule : schedule
      )
    );
    
    alert('Schedule updated successfully!');
    closeEditScheduleModal();
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setScheduleList(prev => prev.filter(schedule => schedule.id !== scheduleId));
      alert('Schedule deleted successfully!');
    }
  };

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Navigation
  const navigate = useNavigate();
  const showSection = (section) => {
    switch(section){
      case 'Dashboard':
        navigate('/admin-dashboard');
        break;
      case 'Students':
        navigate('/student-management');
        break;
      case 'Faculty':
        navigate('/faculty-management');
        break;
      case 'Curriculum':
        navigate('/curriculum-management');
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
  
  return (
    <div className={styles.dashboardContainer}>      
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.breadcrumb}>
            <span 
              className={styles.breadcrumbLink} 
              onClick={() => navigate('/admin-dashboard')}
            >
              Dashboard
            </span>
            <span className={styles.breadcrumbSeparator}> / </span>
            <span className={styles.breadcrumbCurrent}>Schedule Management</span>
          </div>
          
          {/* Header */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Schedule Management</h1>
            <button 
              onClick={showAddScheduleForm}
              className={styles.addScheduleBtn}
            >
              + Add New Schedule
            </button>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Schedules</div>
              <div className={styles.statValue}>{totalSchedules}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Active</div>
              <div className={styles.statValue}>{activeSchedules}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Completed</div>
              <div className={styles.statValue}>{completedSchedules}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Cancelled</div>
              <div className={styles.statValue}>{cancelledSchedules}</div>
            </div>
          </div>

          {/* Schedule List */}
          <div className={styles.scheduleListContainer}>
            <div className={styles.listHeader}>
              <div className={styles.listControls}>
                <h2 className={styles.listTitle}>Schedule List</h2>
                <div className={styles.controls}>
                  <select 
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option>All Days</option>
                    {dayOptions.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>Schedule ID</th>
                    <th>Course & Section</th>
                    <th>Instructor</th>
                    <th>Room</th>
                    <th>Day & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>
                        <div className={styles.scheduleInfo}>
                          <div className={styles.scheduleCourse}>{schedule.course}</div>
                          <div className={styles.scheduleSection}>{schedule.section}</div>
                        </div>
                      </td>
                      <td>{schedule.instructor}</td>
                      <td>{schedule.room}</td>
                      <td>
                        <div className={styles.timeInfo}>
                          <div className={styles.timePeriod}>
                            {formatTime(schedule.timeFrom)} - {formatTime(schedule.timeTo)}
                          </div>
                          <div className={styles.dayInfo}>{schedule.day}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${
                          schedule.status === 'Active' ? styles.statusActive : 
                          schedule.status === 'Completed' ? styles.statusCompleted : 
                          styles.statusCancelled
                        }`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className={styles.actionButtons}>
                        <button 
                          className={styles.btnEdit}
                          onClick={() => showEditScheduleForm(schedule)}
                        >
                        </button>
                        <button 
                          className={styles.btnDelete}
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.tableFooter}>
              <div className={styles.tableInfo}>
                Showing 1 to {filteredSchedules.length} of {totalSchedules} entries
              </div>
              <div className={styles.pagination}>
                <button className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>Previous</button>
                <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Schedule</h2>
            </div>
            
            {/* Modal Content */}
            <div className={styles.modalContent}>
              <div className={styles.formGrid}>
                {/* Course */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Course *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.course}
                    onChange={(e) => handleScheduleFormChange('course', e.target.value)}
                  >
                    <option value="">Select course</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                {/* Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Section *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g., CS-101-A"
                    value={scheduleForm.section}
                    onChange={(e) => handleScheduleFormChange('section', e.target.value)}
                  />
                </div>
                
                {/* Instructor */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Instructor *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.instructor}
                    onChange={(e) => handleScheduleFormChange('instructor', e.target.value)}
                  >
                    <option value="">Select instructor</option>
                    {instructorOptions.map((instructor) => (
                      <option key={instructor} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
                
                {/* Room */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.room}
                    onChange={(e) => handleScheduleFormChange('room', e.target.value)}
                  >
                    <option value="">Select room</option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                
                {/* Day */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Day *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.day}
                    onChange={(e) => handleScheduleFormChange('day', e.target.value)}
                  >
                    <option value="">Select day</option>
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                {/* Time Period */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time Period *</label>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      className={styles.formInput}
                      value={scheduleForm.timeFrom}
                      onChange={(e) => handleScheduleFormChange('timeFrom', e.target.value)}
                    />
                    <input
                      type="time"
                      className={styles.formInput}
                      value={scheduleForm.timeTo}
                      onChange={(e) => handleScheduleFormChange('timeTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={closeAddScheduleModal}
              >
                Cancel
              </button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleAddSchedule}
              >
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditScheduleModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Schedule</h2>
            </div>
            
            {/* Modal Content */}
            <div className={styles.modalContent}>
              <div className={styles.formGrid}>
                {/* Course */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Course *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.course}
                    onChange={(e) => handleScheduleFormChange('course', e.target.value)}
                  >
                    <option value="">Select course</option>
                    {courseOptions.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                {/* Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Section *</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="e.g., CS-101-A"
                    value={scheduleForm.section}
                    onChange={(e) => handleScheduleFormChange('section', e.target.value)}
                  />
                </div>
                
                {/* Instructor */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Instructor *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.instructor}
                    onChange={(e) => handleScheduleFormChange('instructor', e.target.value)}
                  >
                    <option value="">Select instructor</option>
                    {instructorOptions.map((instructor) => (
                      <option key={instructor} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
                
                {/* Room */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Room *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.room}
                    onChange={(e) => handleScheduleFormChange('room', e.target.value)}
                  >
                    <option value="">Select room</option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>
                
                {/* Day */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Day *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.day}
                    onChange={(e) => handleScheduleFormChange('day', e.target.value)}
                  >
                    <option value="">Select day</option>
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                {/* Time Period */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time Period *</label>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      className={styles.formInput}
                      value={scheduleForm.timeFrom}
                      onChange={(e) => handleScheduleFormChange('timeFrom', e.target.value)}
                    />
                    <input
                      type="time"
                      className={styles.formInput}
                      value={scheduleForm.timeTo}
                      onChange={(e) => handleScheduleFormChange('timeTo', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={closeEditScheduleModal}
              >
                Cancel
              </button>
              <button 
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleEditSchedule}
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;