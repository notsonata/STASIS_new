import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.baseURL + config.url);
    console.log('Request method:', config.method);
    console.log('Request data:', config.data);
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    
    // Don't redirect on auth errors during development
    if (error.response?.status === 401) {
      console.warn('Authentication error - token may be invalid');
    }
    
    return Promise.reject(error);
  }
);

// Course API endpoints
export const courseAPI = {
  // Get all courses
  getAllCourses: () => {
    console.log('Calling getAllCourses API...');
    return api.get('/courses');
  },
  
  // Get course by ID
  getCourseById: (id) => api.get(`/courses/${id}`),

  // Get courses by program
  getCoursesByProgram: (program) => {
    console.log('Calling getCoursesByProgram API for program:', program);
    return api.get(`/courses/program/${program}`);
  },
  
  // Create new course
  createCourse: (courseData) => {
    console.log('Calling createCourse API with data:', courseData);
    return api.post('/courses', courseData);
  },
  
  // Update course
  updateCourse: (id, courseData) => {
    console.log('Calling updateCourse API for ID:', id, 'with data:', courseData);
    return api.put(`/courses/${id}`, courseData);
  },
  
  // Delete course
  deleteCourse: (id) => {
    console.log('Calling deleteCourse API for ID:', id);
    return api.delete(`/courses/${id}`);
  },
};

// Course Sections API endpoints
export const courseSectionAPI = {
  // Get all sections
  getAllSections: () => {
    console.log('Calling getAllSections API...');
    return api.get('/course-sections');
  },
  
  // Get section by ID
  getSectionById: (id) => api.get(`/course-sections/${id}`),
  
  // Create new section
  createSection: (sectionData) => {
    console.log('Calling createSection API with data:', sectionData);
    return api.post('/course-sections', sectionData);
  },
  
  // Update section
  updateSection: (id, sectionData) => {
    console.log('Calling updateSection API for ID:', id, 'with data:', sectionData);
    return api.put(`/course-sections/${id}`, sectionData);
  },
  
  // Delete section
  deleteSection: (id) => {
    console.log('Calling deleteSection API for ID:', id);
    return api.delete(`/course-sections/${id}`);
  },
  
  // Get sections by status
  getSectionsByStatus: (status) => api.get(`/course-sections/status/${status}`),
  
  // Get sections by day
  getSectionsByDay: (day) => api.get(`/course-sections/day/${day}`),
  
  // Get sections by section name
  getSectionsBySectionName: (sectionName) => api.get(`/course-sections/section-name/${sectionName}`),
  
  // Get active sections
  getActiveSections: () => api.get('/course-sections/active'),
  
  // Update section status
  updateSectionStatus: (id, status) => api.put(`/course-sections/${id}/status?status=${encodeURIComponent(status)}`),
  
  // Validate section
  validateSection: (sectionData) => api.post('/course-sections/validate', sectionData),

  // Get sections by program ID
  getSectionsByProgram: (programId) => {
    console.log('Calling getSectionsByProgram API for program ID:', programId);
    return api.get(`/course-sections/program/${programId}`);
  },
};

// Enrolled Courses API endpoints
export const enrolledCourseAPI = {
  // Get all enrolled courses
  getAllEnrolledCourses: () => api.get('/enrolled-courses'),
  
  // Get enrolled course by ID
  getEnrolledCourseById: (id) => api.get(`/enrolled-courses/${id}`),
  
  // Get enrolled courses by semester enrollment
  getEnrolledCoursesBySemester: (semesterEnrollmentId) => 
    api.get(`/enrolled-courses/semester-enrollment/${semesterEnrollmentId}`),
  
  // Create enrollment
  createEnrollment: (enrollmentData) => api.post('/enrolled-courses', enrollmentData),
};

// Course Prerequisites API endpoints
export const coursePrerequisiteAPI = {
  // Get all prerequisites
  getAllPrerequisites: () => api.get('/course-prerequisites'),
  
  // Get prerequisites for a course
  getPrerequisitesByCourse: (courseId) => api.get(`/course-prerequisites/course/${courseId}`),
  
  // Get courses that have a specific prerequisite
  getCoursesByPrerequisite: (courseId) => api.get(`/course-prerequisites/prerequisite-for/${courseId}`),
  
  // Add prerequisite to course
  addPrerequisite: (courseId, prerequisiteId) => 
    api.post(`/course-prerequisites/course/${courseId}/prerequisite/${prerequisiteId}`),
  
  // Remove prerequisite from course
  removePrerequisite: (courseId, prerequisiteId) => 
    api.delete(`/course-prerequisites/course/${courseId}/prerequisite/${prerequisiteId}`),
  
  // Check if course has prerequisites
  hasPrerequisites: (courseId) => api.get(`/course-prerequisites/course/${courseId}/has-prerequisites`),
  
  // Check if course is prerequisite for others
  isPrerequisiteFor: (courseId) => api.get(`/course-prerequisites/course/${courseId}/is-prerequisite`),
};

// Program API endpoints
export const programAPI = {
  // Get all programs
  getAllPrograms: () => {
    console.log('Calling getAllPrograms API...');
    return api.get('/programs');
  },
  
  // Get program by ID
  getProgramById: (id) => {
    console.log('Calling getProgramById API for ID:', id);
    return api.get(`/programs/${id}`);
  },
  
  // Create new program
  createProgram: (programData) => {
    console.log('Calling createProgram API with data:', programData);
    return api.post('/programs', programData);
  },
  
  // Update program
  updateProgram: (id, programData) => {
    console.log('Calling updateProgram API for ID:', id, 'with data:', programData);
    return api.put(`/programs/${id}`, programData);
  },
  
  // Delete program
  deleteProgram: (id) => {
    console.log('Calling deleteProgram API for ID:', id);
    return api.delete(`/programs/${id}`);
  },
};

// Faculty API endpoints
export const facultyAPI = {
  // Get all faculty
  getAllFaculty: () => {
    console.log('Calling getAllFaculty API...');
    return api.get('/faculty');
  },
  
  // Get faculty by ID
  getFacultyById: (id) => api.get(`/faculty/${id}`),
  
  // Create new faculty
  createFaculty: (facultyData) => {
    console.log('Calling createFaculty API with data:', facultyData);
    return api.post('/faculty', facultyData);
  },
  
  // Update faculty
  updateFaculty: (id, facultyData) => {
    console.log('Calling updateFaculty API for ID:', id, 'with data:', facultyData);
    return api.put(`/faculty/${id}`, facultyData);
  },
  
  // Delete faculty
  deleteFaculty: (id) => {
    console.log('Calling deleteFaculty API for ID:', id);
    return api.delete(`/faculty/${id}`);
  },
  
  // Get faculty by program
  getFacultyByProgram: (programId) => api.get(`/faculty/program/${programId}`),
  
  // Get faculty by status
  getFacultyByStatus: (status) => api.get(`/faculty/status/${status}`),
  
  // Get faculty by position
  getFacultyByPosition: (position) => api.get(`/faculty/position/${position}`),
  
  // Search faculty
  searchFaculty: (searchTerm) => api.get(`/faculty/search?searchTerm=${encodeURIComponent(searchTerm)}`),
  
  // Get active faculty
  getActiveFaculty: () => api.get('/faculty/active'),
  
  // Update faculty status
  updateFacultyStatus: (id, status) => api.put(`/faculty/${id}/status?status=${encodeURIComponent(status)}`),
  
  // Get faculty by email
  getFacultyByEmail: (email) => api.get(`/faculty/email/${encodeURIComponent(email)}`),
  
  // Check if email exists
  checkEmailExists: (email) => api.get(`/faculty/email-exists/${encodeURIComponent(email)}`),
  
  // Validate faculty data
  validateFaculty: (facultyData) => api.post('/faculty/validate', facultyData),
};

// Student API endpoints
export const studentAPI = {
  // Get all students
  getAllStudents: () => {
    console.log('Calling getAllStudents API...');
    return api.get('/students');
  },
  
  // Get total student count
  getStudentCount: () => {
    return axios.get('/api/students/count');
  },
  
  // Get student by ID
  getStudentById: (id) => api.get(`/students/${id}`),
  
  // Create new student
  createStudent: (studentData) => {
    console.log('Calling createStudent API with data:', studentData);
    return api.post('/students', studentData);
  },
  
  // Update student
  updateStudent: (id, studentData) => {
    console.log('Calling updateStudent API for ID:', id, 'with data:', studentData);
    return api.put(`/students/${id}`, studentData);
  },
  
  // Delete student
  deleteStudent: (id) => {
    console.log('Calling deleteStudent API for ID:', id);
    return api.delete(`/students/${id}`);
  },
  
  // Promote student
  promoteStudent: (id) => {
    console.log('Calling promoteStudent API for ID:', id);
    return api.put(`/students/${id}/promote`);
  },
  
  // Get students by program
  getStudentsByProgram: (programId) => api.get(`/students/program/${programId}`),
  
  // Search students
  searchStudents: (searchTerm) => api.get(`/students/search?searchTerm=${encodeURIComponent(searchTerm)}`),
  
  // Validate student data
  validateStudent: (studentData) => api.post('/students/validate', studentData),
};

// Curriculum API endpoints
export const curriculumAPI = {
  // Get all curriculums
  getAllCurriculums: () => {
    console.log('Calling getAllCurriculums API...');
    return api.get('/curriculums');
  },
  
  // Get curriculum by ID
  getCurriculumById: (id) => {
    console.log('Calling getCurriculumById API for ID:', id);
    return api.get(`/curriculums/${id}`);
  },
  
  // Create new curriculum
  createCurriculum: (curriculumData) => {
    console.log('Calling createCurriculum API with data:', curriculumData);
    return api.post('/curriculums', curriculumData);
  },
  
  // Update curriculum
  updateCurriculum: (id, curriculumData) => {
    console.log('Calling updateCurriculum API for ID:', id, 'with data:', curriculumData);
    return api.put(`/curriculums/${id}`, curriculumData);
  },
  
  // Delete curriculum
  deleteCurriculum: (id) => {
    console.log('Calling deleteCurriculum API for ID:', id);
    return api.delete(`/curriculums/${id}`);
  },
  
  // Get curriculums by program
  getCurriculumsByProgram: (programId) => {
    console.log('Calling getCurriculumsByProgram API for program ID:', programId);
    return api.get(`/curriculums/program/${programId}`);
  },
  
  // Get active curriculums
  getActiveCurriculums: () => {
    console.log('Calling getActiveCurriculums API...');
    return api.get('/curriculums/active');
  },
  
  // Activate curriculum
  activateCurriculum: (id) => {
    console.log('Calling activateCurriculum API for ID:', id);
    return api.put(`/curriculums/${id}/activate`);
  },
  
  // Deactivate curriculum
  deactivateCurriculum: (id) => {
    console.log('Calling deactivateCurriculum API for ID:', id);
    return api.put(`/curriculums/${id}/deactivate`);
  },
  
  // Search curriculums
  searchCurriculums: (searchTerm) => {
    console.log('Calling searchCurriculums API with term:', searchTerm);
    return api.get(`/curriculums/search?name=${encodeURIComponent(searchTerm)}`);
  }
};

// User API endpoints
export const userAPI = {
  // Get all users
  getAllUsers: () => {
    console.log('Calling getAllUsers API...');
    return api.get('/users');
  },
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Update user
  updateUser: (id, userData) => {
    console.log('Calling updateUser API for ID:', id, 'with data:', userData);
    return api.put(`/users/${id}`, userData);
  },
  
  // Delete user
  deleteUser: (id) => {
    console.log('Calling deleteUser API for ID:', id);
    return api.delete(`/users/${id}`);
  },
  
  // Reset user password
  resetPassword: (id) => {
    console.log('Calling resetPassword API for ID:', id);
    return api.post(`/users/${id}/reset-password`);
  },
  
  // Update user status
  updateUserStatus: (id, status) => {
    console.log('Calling updateUserStatus API for ID:', id, 'with status:', status);
    return api.put(`/users/${id}/status?status=${encodeURIComponent(status)}`);
  },
};

// Authentication API endpoints
export const authAPI = {
  // Login user
  login: (loginData) => {
    console.log('Calling login API with data:', loginData);
    return api.post('/auth/login', loginData);
  },
  
  // Logout user
  logout: () => {
    console.log('Calling logout API...');
    return api.post('/auth/logout');
  },
  
  // Refresh token
  refreshToken: () => {
    console.log('Calling refresh token API...');
    return api.post('/auth/refresh');
  },
  
  // Verify token
  verifyToken: () => {
    console.log('Calling verify token API...');
    return api.get('/auth/verify');
  },
};

// Convenience function for login (used by components)
export const loginUser = async (loginData) => {
  try {
    console.log('Attempting login with data:', loginData);
    const response = await authAPI.login(loginData);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: 'Network error occurred during login'
    };
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    const response = await api.get('/courses');
    console.log('Connection test successful:', response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { 
      success: false, 
      error: error.message, 
      code: error.code,
      status: error.response?.status 
    };
  }
};

// Test all endpoints function
export const testAllEndpoints = async () => {
  const tests = [
    { name: 'Courses', test: () => api.get('/courses') },
    { name: 'Programs', test: () => api.get('/programs') },
    { name: 'Faculty', test: () => api.get('/faculty') },
  ];

  const results = {};
  
  for (const { name, test } of tests) {
    try {
      await test();
      results[name] = { success: true };
    } catch (error) {
      results[name] = { 
        success: false, 
        error: error.message,
        status: error.response?.status 
      };
    }
  }
  
  return results;
};

// Curriculum Detail API endpoints
export const curriculumDetailAPI = {
  // Get all curriculum details
  getAllCurriculumDetails: () => {
    console.log('Calling getAllCurriculumDetails API...');
    return api.get('/curriculum-details');
  },
  
  // Get curriculum detail by ID
  getCurriculumDetailById: (id) => api.get(`/curriculum-details/${id}`),
  
  // Create new curriculum detail
  createCurriculumDetail: (detailData) => {
    console.log('Calling createCurriculumDetail API with data:', detailData);
    return api.post('/curriculum-details', detailData);
  },
  
  // Update curriculum detail
  updateCurriculumDetail: (id, detailData) => {
    console.log('Calling updateCurriculumDetail API for ID:', id, 'with data:', detailData);
    return api.put(`/curriculum-details/${id}`, detailData);
  },
  
  // Delete curriculum detail
  deleteCurriculumDetail: (id) => {
    console.log('Calling deleteCurriculumDetail API for ID:', id);
    return api.delete(`/curriculum-details/${id}`);
  },
  
  // Get details by curriculum
  getDetailsByCurriculum: (curriculumId) => {
    console.log('Calling getDetailsByCurriculum API for curriculum ID:', curriculumId);
    return api.get(`/curriculum-details/curriculum/${curriculumId}`);
  },
  
  // Get details by year level
  getDetailsByYearLevel: (yearLevel) => api.get(`/curriculum-details/year/${yearLevel}`),
  
  // Get details by curriculum and year
  getDetailsByCurriculumAndYear: (curriculumId, yearLevel) => 
    api.get(`/curriculum-details/curriculum/${curriculumId}/year/${yearLevel}`)
};

export default api;
