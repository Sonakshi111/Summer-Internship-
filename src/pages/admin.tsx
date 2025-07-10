import React from "react";
import "./Admin.css"; // 👈 Your custom CSS if you're not using Tailwind

const Admin: React.FC = () => {
  const isAdmin = true;

  const handleLogout = () => {
    alert("Logged out");
    // TODO: Add navigation to login if routing is setup
  };

  if (!isAdmin) {
    return (
      <div className="unauthorized">
        Unauthorized Access
      </div>
    );
  }

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <main className="admin-main">
        <h2>Welcome, Admin!</h2>
        <div className="admin-cards">
          <div className="admin-card">
            <h3>User Management</h3>
            <p>View, edit or delete user accounts.</p>
          </div>
          <div className="admin-card">
            <h3>Reports</h3>
            <p>Generate and download user activity reports.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
