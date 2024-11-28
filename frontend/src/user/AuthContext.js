import { createContext, useReducer, useEffect } from "react";
const AuthContext = createContext();
import axios from 'axios'; // Import axios đã được cấu hình từ App.js
import { useLocation } from 'react-router-dom';

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const location = useLocation(); // Lấy thông tin location (pathname) hiện tại

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "AUTH_ERROR" });
      } else {
        try {
          // Xác thực token với API
          const response = await axios.post("/api/checkAuth", { token });
          if (response.status === 200) {
            dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
          } else {
            dispatch({ type: "AUTH_ERROR" });
          }
        } catch (error) {
          dispatch({ type: "AUTH_ERROR" });
        }
      }
    };
    checkAuth();
  }, [location.pathname]); // Sử dụng pathname làm dependency để checkAuth được gọi lại khi thay đổi route

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export AuthContext và AuthProvider
export { AuthContext, AuthProvider };