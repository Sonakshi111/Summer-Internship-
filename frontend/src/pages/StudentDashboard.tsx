import React from 'react';
import './StudentDashboard.css';
import { useNavigate } from 'react-router-dom';

// ✅ TypeScript Interface
export interface StudentData {
  name: string;
  uniqueId: string;
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

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('uniqueId');
    navigate('/login');
  };

  return (
    <div className='container'>
      {/* Header */}
      <div className='header'>
        <h2>Student Dashboard</h2>
      </div>

      {/* Profile Bar */}
      <div className='profileBar'>
        <div className='profileImageWrapper'>
          <img src='' alt="Profile" className="profileImage" />
        </div>
        <h1 className='studentName'>
          <span style={{ fontSize: '2rem' }}>Hello 👋</span><br />{student.name}
        </h1>
        <button className='logoutButton' onClick={handleLogout}>Logout</button>
      </div>

      {/* Details Section */}
      <div className='cardContainer'>
        {/* Personal Details */}
        <div className='card'>
          <h3>Personal Details</h3>
          <p><strong>DOB:</strong> {student.dob}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Father's Name:</strong> {student.fatherName}</p>
          <p><strong>College:</strong> {student.college}</p>
          <p><strong>Course:</strong> {student.course}</p>
          <p><strong>Branch:</strong> {student.branch}</p>
          <p><strong>Address:</strong> {student.address}</p>
        </div>

        {/* Internship Details */}
        <div className='card'>
          <h3>Internship Details</h3>
          <p><strong>Unique ID:</strong> {student.uniqueId}</p>
          <p><strong>Fee Receipt Number:</strong> {student.feeReceiptNumber}</p>
          <p><strong>Duration:</strong> {student.duration}</p>
          <p><strong>Start Date:</strong> {student.startDate}</p>
          <p><strong>End Date:</strong> {student.endDate}</p>
          <p><strong>Project Name:</strong> {student.projectName}</p>
          <p><strong>Batch Code:</strong> {student.batchCode}</p>
          <p><strong>Training Slot:</strong> {student.trainingSlot}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
