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
    const fetchStudentData = async () => {
      const uniqueId = localStorage.getItem('uniqueId');
      if (!uniqueId) {
        navigate('/login');  // Redirect if not logged in
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/dashboard/student/${uniqueId}`);
        const data = await res.json();

        if (res.ok && data) {
          setStudentData(data);
        } else {
          setStudentData(null);  // No data found, show form
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  // 👉 If student data not found, show form
  return studentData ? (
    <StudentDashboard student={studentData} />
  ) : (
    <BatchAllotmentForm />
  );
};

export default Dashboard;
