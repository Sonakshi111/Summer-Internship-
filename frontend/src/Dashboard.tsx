// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BatchAllotmentForm from './pages/BatchAllotmentForm';
// import StudentDashboard from './pages/StudentDashboard';

// interface StudentData {
//   name: string;
//   uniqueId: string;
//   dob: string;
//   phone: string;
//   email: string;
//   fatherName: string;
//   college: string;
//   course: string;
//   branch: string;
//   address: string;
//   feeReceiptNumber: string;
//   duration: string;
//   startDate: string;
//   endDate: string;
//   projectName: string;
//   batchCode: string;
//   trainingSlot: string;
// }

// const Dashboard: React.FC = () => {
//   const [studentData, setStudentData] = useState<StudentData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       const uniqueId = localStorage.getItem('uniqueId');
//       if (!uniqueId) {
//         navigate('/login');  // Redirect if not logged in
//         return;
//       }

//       try {
//         const res = await fetch(`http://localhost:8080/dashboard/student/${uniqueId}`);
//         const data = await res.json();

//         if (res.ok && data) {
//           setStudentData(data);
//         } else {
//           setStudentData(null);  // No data found, show form
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   },

//    [navigate]);

//   if (loading) return <div>Loading...</div>;

//   // 👉 If student data not found, show form
//   return studentData ? (
//     <StudentDashboard student={studentData} />
//   ) : (
//     <BatchAllotmentForm />
//   );
// };

// export default Dashboard;
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BatchAllotmentForm from './pages/BatchAllotmentForm';
// import StudentDashboard from './pages/StudentDashboard';

// interface StudentData {
//   name: string;
//   uniqueId: string;
//   dob: string;
//   phone: string;
//   email: string;
//   fatherName: string;
//   college: string;
//   course: string;
//   branch: string;
//   address: string;
//   feeReceiptNumber: string;
//   duration: string;
//   startDate: string;
//   endDate: string;
//   projectName: string;
//   batchCode: string;
//   trainingSlot: string;
// }

// const Dashboard: React.FC = () => {
//   const [studentData, setStudentData] = useState<StudentData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStudentData = async () => {
//       const uniqueId = localStorage.getItem('uniqueId');

//       // 👇 Removed login restriction, use default/fallback if needed
//       try {
//         const res = await fetch(`http://localhost:8080/dashboard/student/${uniqueId || 'default'}`);
//         const data = await res.json();

//         if (res.ok && data) {
//           setStudentData(data);
//         } else {
//           setStudentData(null);  // No data found, show form
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudentData();
//   }, [navigate]);

//   if (loading) return <div>Loading...</div>;

//   return studentData ? (
//     <StudentDashboard student={studentData} />
//   ) : (
//     <BatchAllotmentForm />
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BatchAllotmentForm from './pages/BatchAllotmentForm';
import StudentDashboard from './pages/StudentDashboard';

interface StudentData {
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

const Dashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Set dummy student directly
    const dummyStudent: StudentData = {
      name: 'Neha Kumari',
      uniqueId: 'STU123456',
      dob: '2003-05-12',
      phone: '9876543210',
      email: 'neha@example.com',
      fatherName: 'Rajesh Kumar',
      college: 'University of Lucknow',
      course: 'B.Tech',
      branch: 'AI & DS',
      address: '123, MG Road, Lucknow',
      feeReceiptNumber: 'FEE987654',
      duration: '6 months',
      startDate: '2025-01-01',
      endDate: '2025-06-30',
      projectName: 'AI Chatbot',
      batchCode: 'BATCH01',
      trainingSlot: 'Morning (9 AM - 11 AM)',
    };

    setStudentData(dummyStudent);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return studentData ? (
    <StudentDashboard student={studentData} />
  ) : (
    <BatchAllotmentForm />
  );
};

export default Dashboard;
