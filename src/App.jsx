// App.js
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SummerInternshipPortal from './component/SummerInternshipPortal';
import SelectedStudentsList from './component/SelectedStudentsList';
import Login from './component/Login';

function App() {
  const [students, setStudents] = useState([]);

  const addStudent = (student) => {
    setStudents(prev => [...prev, student]);
  };

  const handleLogin = (credentials) => {
    console.log('User  logged in with:', credentials);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<SummerInternshipPortal onStudentAdd={addStudent} />} 
        />
        <Route 
          path="/selected-students-list" 
          element={<SelectedStudentsList students={students} />} 
        />
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
      </Routes>
    </Router>
  );
}
export default App;