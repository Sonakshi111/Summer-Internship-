import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

export default function Login({ students = [] }) {  // default to empty array
  const [credentials, setCredentials] = useState({
    uid: "",
    password: "",
    loginType: "student" // Default to student
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.uid.trim() || !credentials.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: credentials.uid,
          password: credentials.password,
          loginType: credentials.loginType
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to appropriate dashboard based on login type
        if (data.loginType === 'admin') {
          navigate('/admin-dashboard');
        } else {
          try {
            // Fetch complete student data
            const studentResponse = await fetch(`${API_BASE_URL}/api/students?id=${data.uid}`);
            if (!studentResponse.ok) {
              throw new Error('Failed to fetch student data');
            }
            const studentData = await studentResponse.json();
            
            // Navigate to challanPage.tsx with student data
            navigate('/challan-page', {
              state: {
                student: studentData.data[0] || {}
              }
            });
          } catch (error) {
            setError('Failed to fetch student data. Please try again.');
            console.error('Error fetching student data:', error);
          }
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      console.error('Login error:', error);
    }
  };

  return (
    <main className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin} noValidate>
        <div className="login-type">
          <label>
            <input
              type="radio"
              name="loginType"
              value="student"
              checked={credentials.loginType === 'student'}
              onChange={handleChange}
            />
            Student
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              value="admin"
              checked={credentials.loginType === 'admin'}
              onChange={handleChange}
            />
            Admin
          </label>
        </div>

        <label htmlFor="uid">Unique ID:</label>
        <input
          id="uid"
          name="uid"
          type="text"
          placeholder="Enter your Unique ID"
          value={credentials.uid}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">LOGIN</button>
      </form>
    </main>
  );
}