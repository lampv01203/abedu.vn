import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './auth/AuthContext.js'; // Dùng named import
import WithAuth from "./auth/withAuth.js";
import WithAdmin from "./auth/withAdmin.js";
import Login from "./auth/Login.js"; // Giả sử đường dẫn đúng đến Login component
import Top from "./components/Top"; // Giả sử đường dẫn đúng đến Top component
import WorkSchedule from "./components/WorkSchedule";
import StudentList from "./components/student/StudentList.js";
import AddStudent from "./components/student/AddStudent.js";
import EditStudent from "./components/student/EditStudent.js";
import TeacherList from "./components/teacher/TeacherList.js";
import AddTeacher from "./components/teacher/AddTeacher.js";
import EditTeacher from "./components/teacher/EditTeacher.js";
import LevelList from "./components/level/LevelList.js";
import AddLevel from "./components/level/AddLevel.js";
import EditLevel from "./components/level/EditLevel.js";
import ClassList from "./components/class/ClassList.js";
import AddClass from "./components/class/AddClass.js";
import axios from "axios";

// Thiết lập axios với baseURL và tùy chọn withCredentials
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.withCredentials = true; 

// Thêm axios interceptor để thêm token vào header
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <Router>
        <AuthProvider>
        <Routes>
          {/* Route cho trang đăng nhập */}
          <Route path="/login" element={<Login />} />
          {/* Top là một route được bảo vệ */}
          <Route path="/" element={<WithAuth><Top /></WithAuth>}>
            <Route path="/"  element={<WithAuth><WorkSchedule /></WithAuth>} /> {/* Route mặc định cho Top */}
            <Route path="workschedule" element={<WithAuth><WorkSchedule /></WithAuth>} />
            {/* Student component */}
            <Route path="studentlist" element={<WithAuth><StudentList /></WithAuth>} />
            <Route path="addstudent" element={<WithAuth><AddStudent /></WithAuth>} />
            <Route path="editstudent/:id" element={<WithAuth><EditStudent /></WithAuth>} />
            {/* Teacher component */}
            <Route path="teacherlist" element={<WithAuth><TeacherList /></WithAuth>} />
            <Route path="addteacher" element={<WithAuth><AddTeacher /></WithAuth>} />
            <Route path="editteacher/:id" element={<WithAuth><EditTeacher /></WithAuth>} />
            {/* Class component */}
            <Route path="classList" element={<WithAuth><ClassList /></WithAuth>} />
            <Route path="addclass" element={<WithAuth><AddClass /></WithAuth>} />

            {/* Route được bảo vệ thêm với WithAdmin */}
            <Route path="levellist" element={<WithAdmin><LevelList /></WithAdmin>} />
            <Route path="addlevel" element={<WithAdmin><AddLevel /></WithAdmin>} />
            <Route path="editLevel/:id" element={<WithAdmin><EditLevel /></WithAdmin>} />
          </Route>
        </Routes>
    </AuthProvider>
      </Router>
  );
};


export default App;
