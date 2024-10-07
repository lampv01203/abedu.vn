import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const WithAdmin = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default WithAdmin;
