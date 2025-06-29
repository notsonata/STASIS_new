import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFacultyData } from '../hooks/useFacultyData';
import { useAdminData } from '../hooks/useAdminData';
import { loginUser } from '../services/api';

// Basic styling (can share CSS later)
const formStyle = {
    padding: '40px',
    maxWidth: '400px',
    margin: '50px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '90%', // Ensure it fits on smaller screens
};

const FacultyLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setFacultyInfo } = useFacultyData();
    const { setAdminInfo } = useAdminData();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            // First try FACULTY role
            let loginData = {
                username,
                password,
                role: 'FACULTY'
            };

            let response = await loginUser(loginData);

            // If faculty login fails, try ADMIN role
            if (!response.success) {
                loginData = {
                    username,
                    password,
                    role: 'ADMIN'
                };
                response = await loginUser(loginData);
            }

            setLoading(false);

            if (response.success) {
                console.log('Login Successful:', response);
                
                // Check user role and navigate accordingly
                if (response.role === 'ADMIN') {
                    // Store admin data in the admin hook
                    setAdminInfo({
                        userId: response.userId,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        username: response.username,
                        role: response.role
                    });
                    // Navigate to admin dashboard
                    navigate('/admin-dashboard');
                } else {
                    // Store faculty data in the faculty hook
                    setFacultyInfo({
                        facultyId: response.facultyId,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        email: response.email,
                        position: response.position,
                        program: response.program,
                        username: response.username,
                        userId: response.userId
                    });
                    // Navigate to faculty dashboard
                    navigate('/faculty-dashboard');
                }
            } else {
                setError(response.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setLoading(false);
            setError('An error occurred during login. Please try again.');
            console.error('Login request failed:', err);
        }
    };

    return (
         <div style={formStyle}>
            <h2>Faculty/Admin Login Portal</h2>
            <p>Enter your credentials below.</p>
            <form onSubmit={handleSubmit}>
                 <div style={{ marginBottom: '15px' }}>
                     <label htmlFor="faculty-username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                     <input
                        type="text"
                        id="faculty-username" // Changed ID
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                 <div style={{ marginBottom: '15px' }}>
                     <label htmlFor="faculty-password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                     <input
                        type="password"
                        id="faculty-password" // Changed ID
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                 {error && <p style={{ color: 'red' }}>{error}</p>}
                 <button type="submit" disabled={loading} style={{ padding: '10px 15px', cursor: 'pointer', width: '100%' }}>
                     {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/">Back to role selection</Link>
            </p>
        </div>
    );
};

export default FacultyLoginForm;