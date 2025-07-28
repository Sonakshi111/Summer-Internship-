import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./SelectedStudentsList.css"

const SelectedStudentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/students');
        if (!response.ok) throw new Error('Failed to fetch student data');
        const data = await response.json();
        if (data.success) {
          // Format the data to match our component's expectations
          setStudentList(data.data.map((row) => ({
            uid: row[0],
            name: row[1],
            email: row[2],
            college: row[3],
            year: row[4]
          })));
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Only show search if multiple students are found
  const showSearch = studentList.length > 1;

  const filteredStudents = showSearch ? studentList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.uid.toLowerCase().includes(searchTerm.toLowerCase())
  ) : studentList;

  return (
    <div className="students-list-container">
      <nav className="students-list-nav">
        <Link to="/" className="back-button">← Back to Registration</Link>
        <h1>Selected Internship Candidates</h1>
      </nav>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {showSearch && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span>{filteredStudents.length} students found</span>
            </div>
          )}

          {filteredStudents.length > 0 ? (
            <table className="students-table">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.uid}>
                    <td>{student.uid}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.college}</td>
                    <td>{student.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <p>No students found matching your search</p>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default SelectedStudentsList;