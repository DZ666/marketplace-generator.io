'use client';

import React from 'react';
import AuthGuard from '../../components/AuthGuard';
import { useAuth } from '../../hooks/useAuth';

const AdminPanel = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <AuthGuard>
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px' 
        }}>
          <h1>Admin Panel</h1>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        <p>Welcome to the admin panel, {user?.name || 'User'}!</p>
        <p>Your email: {user?.email}</p>
      </div>
    </AuthGuard>
  );
};

export default AdminPanel;