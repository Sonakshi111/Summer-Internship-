import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import SummerInternshipPortal from './component/SummerInternshipPortal';
import StudentDashboard from './component/StudentDashboard';
import AdminDashboard from './component/AdminDashboard';
import BatchAllotmentForm from './component/BatchAllotmentForm';
import ChallanPage from './component/ChallanPage';
import SelectedStudentsList from './component/SelectedStudentsList';
import Certificate from './component/Certificate';
import ProjectDetails from './component/ProjectDetails';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SummerInternshipPortal onStudentAdd={() => {}} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/batch-allotment" element={<BatchAllotmentForm />} />
          <Route path="/challan-page" element={<ChallanPage />} />
          <Route path="/summer-internship-portal" element={<SummerInternshipPortal onStudentAdd={() => {}} />} />
          <Route path="/selected-students-list" element={<SelectedStudentsList />} />
          <Route path="/certificate" element={<Certificate/>} />
          <Route path="/admin/project-details" element={<ProjectDetails/>} />
        </Routes>
      </Router>
  );
}

export default App;