import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gửi yêu cầu xác thực token lên backend
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
      } else {
        try {
          const response = await axios.post("/api/checkAuth", { token });
          setIsAuthenticated(response.status === 200); // Token hợp lệ
        } catch (error) {
          console.error("Error verifying token:", error);
          setIsAuthenticated(false); // Lỗi khi xác thực
        } finally {
          setLoading(false); // Kết thúc việc kiểm tra
        }
      }
    };
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;