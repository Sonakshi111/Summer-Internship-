import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import SummerInternshipPortal from './component/SummerInternshipPortal';
import StudentDashboard from './component/StudentDashboard';
import AdminDashboard from './component/AdminDashboard';
import BatchAllotmentForm from './component/BatchAllotmentForm';
import ChallanPage from './component/ChallanPage';

import SelectedStudentsList from './component/SelectedStudentsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SummerInternshipPortal onStudentAdd={() => {}} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/batch-allotment" element={<BatchAllotmentForm />} />
        <Route path="/challan-page" element={<ChallanPage />} />
        <Route path="/summer-internship-portal" element={<SummerInternshipPortal onStudentAdd={() => {}} />} />
        <Route path="/selected-students-list" element={<SelectedStudentsList />} />
      </Routes>
    </Router>
  );
}

export default App;