
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ show, onLogout }) {
  const navigate = useNavigate();
  const [openDashboard, setOpenDashboard] = useState(false);

  const toggleDashboard = () => {
    setOpenDashboard(!openDashboard);
  };

  return (
    <aside className={`sidebar ${show ? "show" : ""}`}>
      <h2>STC Admin</h2>
      <ul>
        <li onClick={toggleDashboard}>👤 Student Details ▾</li>

        {openDashboard && (
          <ul className="submenu">
            <li><Link to="/admin/challan" style={{ color: "black", textDecoration: "none" }}>🧾 Challan</Link></li>
            <li><Link to="/admin/idcard" style={{ color: "black", textDecoration: "none" }}>🆔 ID Card</Link></li>
          </ul>
        )}

        <li><Link to="/admin/project-details"style={{color: "black", textDecoration: "none" }}>📝 Project Details</Link></li>
        
        <li><Link to="/admin/certificate"style={{color: "black", textDecoration: "none" }}>📄 CERTIFICATES</Link></li>
        
        <li>
          <button 
            onClick={() => {
              onLogout();
              navigate('/login');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'black',
              cursor: 'pointer',
              padding: '8px 16px',
              textAlign: 'left',
              width: '100%',
              fontSize: '16px'
            }}
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
