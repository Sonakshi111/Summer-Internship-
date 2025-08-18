import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

interface StudentData {
  UID: string;
  ReceiptNo: string;
  Name: string;
  FathersName: string;
  College: string;
  Mobile: string;
  Address: string;
  Course: string;
  Year: string;
  Branch: string;
  Duration: string;
  Trade: string;
  Slot: string;
  Project: string;
  PhotoURL: string;
}

const StudentDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // First check if we have student data from navigation state
        if (location.state?.student) {
          setStudent(location.state.student);
          setLoading(false);
          return;
        }

        // If not, try to fetch from the backend
        const uid = new URLSearchParams(window.location.search).get('uid');
        if (!uid) {
          setError('No student UID provided');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/student/info/${uid}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setStudent(data.studentInfo);
        } else {
          setError(data.message || 'Failed to fetch student details');
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Failed to load student details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [location.state]);

  if (loading) {
    return <div className="loading">Loading student details...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!student) {
    return <div className="error">No student data available</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('uniqueId');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Student Dashboard</h1>
      </div>

      <div className="profileBar">
        <div className="profileImageWrapper">
          <img
            src="default-avatar.png"
            alt="Profile"
            className="profileImage"
          />
        </div>
        <div className="studentName">Hi 👋<br />{student?.Name}</div>
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="cardContainer">
        <div className="card">
          <h2>Personal Details</h2>
          <p>Unique ID: {student?.UID}</p>
          <p>Name: {student?.Name}</p>
          <p>Father's Name: {student?.FathersName}</p>
          <p>Mobile: {student?.Mobile}</p>
          <p>Address: {student?.Address}</p>
          <p>Photo: {student?.PhotoURL ? (
            <img src={student?.PhotoURL} alt="Student" style={{maxWidth: '100px'}} />
          ) : 'No photo available'}</p>
        </div>

        <div className="card">
          <h2>Education Details</h2>
          <p>College: {student?.College}</p>
          <p>Course: {student?.Course}</p>
          <p>Branch: {student?.Branch}</p>
          <p>Year: {student?.Year}</p>
          <p>Receipt No: {student?.ReceiptNo}</p>
        </div>

        <div className="card">
          <h2>Training Details</h2>
          <p>Project: {student?.Project}</p>
          <p>Trade: {student?.Trade}</p>
          <p>Slot: {student?.Slot}</p>
          <p>Duration: {student?.Duration}</p>
          <p>Mobile: {student?.Mobile}</p>
          <p>Address: {student?.Address}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
