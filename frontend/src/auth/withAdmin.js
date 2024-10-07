import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
const withAdmin = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.department_id !== 1) {
    return <Navigate to="/" />;
  }

  return children;
};

export default withAdmin;
