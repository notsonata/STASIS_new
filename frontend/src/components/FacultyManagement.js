import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacultyManagement.css';
import Sidebar from './Sidebar';

const FacultyManagement = () => {
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showEditFacultyModal, setShowEditFacultyModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    employmentStatus: ''
  });

  // Sample faculty data
  const [facultyList, setFacultyList] = useState([
    {
      id: 'FAC001',
      name: 'Emily Thompson',
      position: 'Associate Professor',
      department: 'Computer Science',
      email: 'emily.thompson@university.edu',
      status: 'Full-time'
    },
    {
      id: 'FAC002',
      name: 'James Chen',
      position: 'Professor',
      department: 'Information Technology',
      email: 'james.chen@university.edu',
      status: 'Full-time'
    },
    {
      id: 'FAC003',
      name: 'Sarah Martinez',
      position: 'Assistant Professor',
      department: 'Business Administration',
      email: 'sarah.martinez@university.edu',
      status: 'Part-time'
    },
    {
      id: 'FAC004',
      name: 'Michael Roberts',
      position: 'Professor',
      department: 'Engineering',
      email: 'michael.roberts@university.edu',
      status: 'Full-time'
    },
    {
      id: 'FAC005',
      name: 'Rachel Williams',
      position: 'Associate Professor',
      department: 'Psychology',
      email: 'rachel.williams@university.edu',
      status: 'Part-time'
    }
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [searchTerm, setSearchTerm] = useState('');

  // Department options for faculty
  const departmentOptions = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Psychology',
    'Business Administration',
    'Engineering',
    'Information Technology'
  ];

  // Position options for faculty
  const positionOptions = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Instructor',
    'Department Head',
    'Dean'
  ];

  // Employment status options
  const employmentStatusOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Adjunct'
  ];

  // Statistics calculations
  const totalFaculty = facultyList.length;
  const fullTimeFaculty = facultyList.filter(f => f.status === 'Full-time').length;
  const partTimeFaculty = facultyList.filter(f => f.status === 'Part-time').length;
  const departments = [...new Set(facultyList.map(f => f.department))].length;

  // Filter faculty based on search and department
  const filteredFaculty = facultyList.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Add Faculty Modal functions
  const showAddFacultyForm = () => {
    setShowAddFacultyModal(true);
  };

  const closeAddFacultyModal = () => {
    setShowAddFacultyModal(false);
    setFacultyForm({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      employmentStatus: ''
    });
  };

  // Edit Faculty Modal functions
  const showEditFacultyForm = (faculty) => {
    setEditingFaculty(faculty);
    // Split the name into first and last name
    const nameParts = faculty.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setFacultyForm({
      firstName: firstName,
      lastName: lastName,
      email: faculty.email,
      department: faculty.department,
      position: faculty.position,
      employmentStatus: faculty.status
    });
    setShowEditFacultyModal(true);
  };

  const closeEditFacultyModal = () => {
    setShowEditFacultyModal(false);
    setEditingFaculty(null);
    setFacultyForm({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      employmentStatus: ''
    });
  };

  const handleFacultyFormChange = (field, value) => {
    setFacultyForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFaculty = () => {
    // Validate required fields
    if (!facultyForm.firstName || !facultyForm.lastName || !facultyForm.email || !facultyForm.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Generate new faculty ID
    const newId = `FAC${String(facultyList.length + 1).padStart(3, '0')}`;
    
    // Create new faculty object
    const newFaculty = {
      id: newId,
      name: `${facultyForm.firstName} ${facultyForm.lastName}`,
      position: facultyForm.position || 'Assistant Professor',
      department: facultyForm.department,
      email: facultyForm.email,
      status: facultyForm.employmentStatus || 'Full-time'
    };
    
    // Add to faculty list
    setFacultyList(prev => [...prev, newFaculty]);
    
    alert('Faculty added successfully!');
    closeAddFacultyModal();
  };

  const handleEditFaculty = () => {
    // Validate required fields
    if (!facultyForm.firstName || !facultyForm.lastName || !facultyForm.email || !facultyForm.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create updated faculty object
    const updatedFaculty = {
      ...editingFaculty,
      name: `${facultyForm.firstName} ${facultyForm.lastName}`,
      position: facultyForm.position || 'Assistant Professor',
      department: facultyForm.department,
      email: facultyForm.email,
      status: facultyForm.employmentStatus || 'Full-time'
    };
    
    // Update faculty list
    setFacultyList(prev => 
      prev.map(faculty => 
        faculty.id === editingFaculty.id ? updatedFaculty : faculty
      )
    );
    
    alert('Faculty updated successfully!');
    closeEditFacultyModal();
  };

  const handleDeleteFaculty = (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFacultyList(prev => prev.filter(faculty => faculty.id !== facultyId));
      alert('Faculty deleted successfully!');
    }
  };

  // Navigation
  const navigate = useNavigate();
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
        break;      case 'Schedule':
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
  return (
    <div className="dashboard-container">      {/* Sidebar */}
      <Sidebar 
        onNavigate={showSection}
        userInfo={{ name: "David Anderson", role: "Faculty Admin" }}
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
      <div className="main-content">
        <div className="content-wrapper">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span 
              className="breadcrumb-link" 
              onClick={() => navigate('/admin-dashboard')}
            >
              Dashboard
            </span>
            <span className="breadcrumb-separator"> / </span>
            <span className="breadcrumb-current">Faculty Management</span>
          </div>
          
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Faculty Management</h1>
            <button 
              onClick={showAddFacultyForm}
              className="add-faculty-btn"
            >
              + Add New Faculty
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Faculty</div>
              <div className="stat-value">{totalFaculty}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Full-time</div>
              <div className="stat-value">{fullTimeFaculty}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Part-time</div>
              <div className="stat-value">{partTimeFaculty}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Departments</div>
              <div className="stat-value">{departments}</div>
            </div>
          </div>

          {/* Faculty List */}
          <div className="faculty-list-container">
            <div className="list-header">
              <div className="list-controls">
                <h2 className="list-title">Faculty List</h2>
                <div className="controls">
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="select-input"
                  >
                    <option>All Departments</option>
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="faculty-table">
                <thead>
                  <tr>
                    <th>Faculty ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((faculty, index) => (
                    <tr key={faculty.id}>
                      <td>{faculty.id}</td>
                      <td>
                        <div className="faculty-info">
                          <div className="faculty-name">{faculty.name}</div>
                          <div className="faculty-position">{faculty.position}</div>
                        </div>
                      </td>
                      <td>{faculty.department}</td>
                      <td>{faculty.email}</td>
                      <td>
                        <span className={`status-badge ${faculty.status === 'Full-time' ? 'status-fulltime' : 'status-parttime'}`}>
                          {faculty.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => showEditFacultyForm(faculty)}
                        >
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteFaculty(faculty.id)}
                        >
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="table-info">
                Showing 1 to {filteredFaculty.length} of {totalFaculty} entries
              </div>
              <div className="pagination">
                <button className="page-btn disabled">Previous</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Faculty Modal */}
      {showAddFacultyModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">Add New Faculty</h2>
            </div>
            
            {/* Modal Content */}
            <div className="modal-content">
              <div className="form-grid">
                {/* First Name */}
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter First Name"
                    value={facultyForm.firstName}
                    onChange={(e) => handleFacultyFormChange('firstName', e.target.value)}
                  />
                </div>
                
                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Last Name"
                    value={facultyForm.lastName}
                    onChange={(e) => handleFacultyFormChange('lastName', e.target.value)}
                  />
                </div>
                
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter Email Address"
                    value={facultyForm.email}
                    onChange={(e) => handleFacultyFormChange('email', e.target.value)}
                  />
                </div>
                
                {/* Department */}
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-input"
                    value={facultyForm.department}
                    onChange={(e) => handleFacultyFormChange('department', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Position */}
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <select
                    className="form-input"
                    value={facultyForm.position}
                    onChange={(e) => handleFacultyFormChange('position', e.target.value)}
                  >
                    <option value="">Select position</option>
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                
                {/* Employment Status */}
                <div className="form-group">
                  <label className="form-label">Employment Status</label>
                  <select
                    className="form-input"
                    value={facultyForm.employmentStatus}
                    onChange={(e) => handleFacultyFormChange('employmentStatus', e.target.value)}
                  >
                    <option value="">Select status</option>
                    {employmentStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={closeAddFacultyModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddFaculty}
              >
                Add Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {showEditFacultyModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">Edit Faculty</h2>
            </div>
            
            {/* Modal Content */}
            <div className="modal-content">
              <div className="form-grid">
                {/* First Name */}
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter First Name"
                    value={facultyForm.firstName}
                    onChange={(e) => handleFacultyFormChange('firstName', e.target.value)}
                  />
                </div>
                
                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Last Name"
                    value={facultyForm.lastName}
                    onChange={(e) => handleFacultyFormChange('lastName', e.target.value)}
                  />
                </div>
                
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter Email Address"
                    value={facultyForm.email}
                    onChange={(e) => handleFacultyFormChange('email', e.target.value)}
                  />
                </div>
                
                {/* Department */}
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    className="form-input"
                    value={facultyForm.department}
                    onChange={(e) => handleFacultyFormChange('department', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                {/* Position */}
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <select
                    className="form-input"
                    value={facultyForm.position}
                    onChange={(e) => handleFacultyFormChange('position', e.target.value)}
                  >
                    <option value="">Select position</option>
                    {positionOptions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                
                {/* Employment Status */}
                <div className="form-group">
                  <label className="form-label">Employment Status</label>
                  <select
                    className="form-input"
                    value={facultyForm.employmentStatus}
                    onChange={(e) => handleFacultyFormChange('employmentStatus', e.target.value)}
                  >
                    <option value="">Select status</option>
                    {employmentStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={closeEditFacultyModal}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleEditFaculty}
              >
                Update Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyManagement;