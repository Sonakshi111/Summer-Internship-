import React, { useEffect, useState } from 'react';
import './StudentDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ TypeScript Interface
export interface StudentData {
  uniqueId: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  fatherName: string;
  college: string;
  course: string;
  branch: string;
  address: string;
  feeReceiptNumber: string;
  duration: string;
  startDate: string;
  endDate: string;
  projectName: string;
  batchCode: string;
  trainingSlot: string;
}

// ✅ Accept props
interface StudentDashboardProps {
  student: StudentData;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student: initialStudent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use the student data passed via location state
    if (location.state && location.state.student) {
      setStudent(location.state.student);
      setLoading(false);
    } else {
      setError('Student data not found');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('uniqueId');
    navigate('/login');
  };

  if (!student) {
    return <div>Loading student data...</div>;
  }

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
        <div className="studentName">Hi 👋<br />{student?.name}</div>
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="cardContainer">
        <div className="card">
          <h2>Personal Details</h2>
          <p>Unique ID: {student?.uniqueId}</p>
          <p>Name: {student?.name}</p>
          <p>Father's Name: {student?.fatherName}</p>
          <p>Phone: {student?.phone}</p>
          <p>Email: {student?.email}</p>
          <p>Address: {student?.address}</p>
        </div>

        <div className="card">
          <h2>Education Details</h2>
          <p>College: {student?.college}</p>
          <p>Course: {student?.course}</p>
          <p>Branch: {student?.branch}</p>
          <p>Duration: {student?.duration}</p>
        </div>

        <div className="card">
          <h2>Training Details</h2>
          <p>Project Name: {student?.projectName}</p>
          <p>Batch Code: {student?.batchCode}</p>
          <p>Training Slot: {student?.trainingSlot}</p>
          <p>Start Date: {student?.startDate}</p>
          <p>End Date: {student?.endDate}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
