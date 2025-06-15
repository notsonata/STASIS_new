import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentSchedule.module.css';
import StudentSidebar from './StudentSidebar';

const StudentSchedule = () => {
  const navigate = useNavigate();
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
      room: 'Room 305',
      day: 'Monday',
      timeFrom: '10:30',
      timeTo: '12:00',
      status: 'Active'
    },
    {
      id: 'SCH003',
      course: 'Business Ethics',
      section: 'BA-105-A',
      instructor: 'Sarah Martinez',
      room: 'Room 106',
      day: 'Tuesday',
      timeFrom: '08:00',
      timeTo: '09:30',
      status: 'Active'
    },
    {
      id: 'SCH004',
      course: 'Engineering Mathematics',
      section: 'ENG-102-C',
      instructor: 'Michael Roberts',
      room: 'Room 204',
      day: 'Wednesday',
      timeFrom: '10:00',
      timeTo: '11:30',
      status: 'Active'
    },
    {
      id: 'SCH005',
      course: 'General Psychology',
      section: 'PSY-101-A',
      instructor: 'Rachel Williams',
      room: 'Room 305',
      day: 'Thursday',
      timeFrom: '09:00',
      timeTo: '10:30',
      status: 'Active'
    }
  ]);

  const [selectedDay, setSelectedDay] = useState('All Days');
  const [searchTerm, setSearchTerm] = useState('');

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Statistics calculations
  const totalSchedules = scheduleList.length;
  const activeSchedules = scheduleList.filter(s => s.status === 'Active').length;
  const completedSchedules = scheduleList.filter(s => s.status === 'Completed').length;
  const cancelledSchedules = scheduleList.filter(s => s.status === 'Cancelled').length;

  // Filter schedules based on search and day
  const filteredSchedules = scheduleList.filter(schedule => {
    const matchesSearch = searchTerm === '' || 
                          schedule.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'All Days' || schedule.day === selectedDay;
    return matchesSearch && matchesDay;
  });

  return (
    <div className={styles['dashboard-container']}>
      <StudentSidebar onNavigate={(page) => navigate(`/student-${page.toLowerCase()}`)} />
      <div className={styles['main-content']}>
        <div className={styles['content-wrapper']}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <span 
              className={styles['breadcrumb-link']} 
              onClick={() => navigate('/student-dashboard')}
            >
              Dashboard
            </span>
            <span className={styles['breadcrumb-separator']}>/</span>
            <span className={styles['breadcrumb-current']}>Schedule</span>
          </div>
          
          {/* Page Header */}
          <div className={styles['page-header']}>
            <h1 className={styles['page-title']}>Class Schedule</h1>
          </div>
          
          {/* Stats Grid */}
          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <div className={styles['stat-label']}>Total Classes</div>
              <div className={styles['stat-value']}>{totalSchedules}</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-label']}>Active</div>
              <div className={styles['stat-value']}>{activeSchedules}</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-label']}>Completed</div>
              <div className={styles['stat-value']}>{completedSchedules}</div>
            </div>
            <div className={styles['stat-card']}>
              <div className={styles['stat-label']}>Cancelled</div>
              <div className={styles['stat-value']}>{cancelledSchedules}</div>
            </div>
          </div>
          
          {/* Schedule List Container */}
          <div className={styles['schedule-list-container']}>
            <div className={styles['list-header']}>
              <div className={styles['list-controls']}>
                <h2 className={styles['list-title']}>Schedule List</h2>
                <div className={styles.controls}>
                  <select 
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className={styles['select-input']}
                  >
                    <option>All Days</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles['search-input']}
                  />
                </div>
              </div>
            </div>
            
            {/* Schedule Table */}
            <div className={styles['table-container']}>
              <table className={styles['schedule-table']}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course/Section</th>
                    <th>Time/Day</th>
                    <th>Instructor</th>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.id}</td>
                      <td>
                        <div className={styles['schedule-info']}>
                          <div className={styles['schedule-course']}>{schedule.course}</div>
                          <div className={styles['schedule-section']}>{schedule.section}</div>
                        </div>
                      </td>
                      <td>
                        <div className={styles['time-info']}>
                          <div className={styles['time-period']}>
                            {formatTime(schedule.timeFrom)} - {formatTime(schedule.timeTo)}
                          </div>
                          <div className={styles['day-info']}>{schedule.day}</div>
                        </div>
                      </td>
                      <td>{schedule.instructor}</td>
                      <td>{schedule.room}</td>
                      <td>
                        <span className={`${styles['status-badge']} ${styles[`status-${schedule.status.toLowerCase()}`]}`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles['action-buttons']}>
                          <button 
                            className={styles['btn-edit']} 
                            title="Edit"
                            onClick={() => {
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
                            }}
                          />
                          <button 
                            className={styles['btn-delete']} 
                            title="Delete"
                            onClick={() => {
                              /* Delete logic here */
                              if(window.confirm('Are you sure you want to delete this schedule?')) {
                                /* Delete implementation */
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer with Pagination */}
            <div className={styles['table-footer']}>
              <div className={styles['table-info']}>
                Showing {filteredSchedules.length} of {scheduleList.length} schedules
              </div>
              <div className={styles.pagination}>
                <button className={`${styles['page-btn']} ${styles.disabled}`} disabled>Previous</button>
                <button className={`${styles['page-btn']} ${styles.active}`}>1</button>
                <button className={styles['page-btn']}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;