import React from 'react';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin 🌟</p>
      <div style={{ marginTop: '20px' }}>
        <h2>Admin Features</h2>
        <ul>
          <li>Manage Student Registrations</li>
          <li>View Student Data</li>
          <li>System Settings</li>
        </ul>
      </div>
    </div>
  );
}
