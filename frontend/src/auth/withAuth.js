import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Đảm bảo import đúng AuthContext
import "../css/index.css"; // Import Bootstrap CSS

const withAuth = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default withAuth;
