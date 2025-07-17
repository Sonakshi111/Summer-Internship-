
import React from 'react';
import StudentDashboard from './pages/StudentDashboard';

const dummyStudent = {
  name: "Neha Kumari",
  uniqueId: "LU123456",
  dob: "01/01/2002",
  phone: "9876543210",
  email: "neha@example.com",
  fatherName: "Mr. Kumar",
  college: "University of Lucknow",
  course: "B.Tech",
  branch: "CSE AI",
  address: "Lucknow, UP, India",
  feeReceiptNumber: "F123456",
  duration: "6 weeks",
  startDate: "01/06/2025",
  endDate: "15/07/2025",
  projectName: " Online Student Registration Portal",
  batchCode: " BATCH23",
  trainingSlot: " 10 AM - 12 PM"
};

const DashboardPage: React.FC = () => {
  return <StudentDashboard student={dummyStudent} />;
};

export default DashboardPage;
