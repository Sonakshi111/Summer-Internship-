import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './AdminDashboardStyle.css';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCards from './StatsCards';
import ActivityTable from './ActivityTable';
import Challan from './Challan';
import IDGenerator from './IDGenerator';
import Certificate from './Certificate';

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="app-wrapper container">
      <button className="menu-toggle" onClick={() => setShowSidebar(!showSidebar)}>
        ☰ Menu
      </button>
      <Sidebar show={showSidebar} onLogout={logout} />
      <main className="main-content">
        <Header user={user} onLogout={logout} />
        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={
          <>
            <StatsCards />
            <ActivityTable />
          </>
        } />
        <Route path="dashboard" element={
          <>
            <StatsCards />
            <ActivityTable />
          </>
        } />
        <Route path="challan" element={<Challan />} />
        <Route path="idcard" element={<IDGenerator />} />
        <Route path="certificate" element={<Certificate />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminDashboard;
