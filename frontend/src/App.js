import React from "react";
import AuthProvider from './auth/AuthContext.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; // Giả sử đường dẫn đúng đến Login component
import WithAuth from "./auth/withAuth.js";
import WithAdmin from "./auth/withAdmin.js";
import Top from "./components/Top"; // Giả sử đường dẫn đúng đến Top component
import WorkSchedule from "./components/WorkSchedule";
import StudentList from "./components/student/StudentList.js";
import AddStudent from "./components/student/AddStudent.js";
import TeacherList from "./components/teacher/TeacherList.js";
import AddTeacher from "./components/teacher/AddTeacher.js";
import LevelList from "./components/level/LevelList.js";
import AddLevel from "./components/level/AddLevel.js";
import EditLevel from "./components/level/EditLevel.js";

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<Login />} />
        {/* Route được bảo vệ, bọc với WithAuth */}
        <Route path="/" element={<WithAuth><Top /></WithAuth>}>
          <Route index element={<WorkSchedule />} />   {/* Sử dụng index cho trang mặc định */}
          <Route path="workschedule" element={<WorkSchedule />} />
          <Route path="studentlist" element={<StudentList />} />
          <Route path="addstudent" element={<AddStudent />} />
          <Route path="teacherlist" element={<TeacherList />} />
          <Route path="addteacher" element={<AddTeacher />} />

          {/* Route được bảo vệ thêm với WithAdmin */}
          <Route path="levellist" element={<WithAdmin><LevelList /></WithAdmin>} />
          <Route path="addlevel" element={<WithAdmin><AddLevel /></WithAdmin>} />
          <Route path="editLevel/:id" element={<WithAdmin><EditLevel /></WithAdmin>} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
