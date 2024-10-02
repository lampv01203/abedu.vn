import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Giả sử đường dẫn đúng đến Login component
import Top from './components/Top'; // Giả sử đường dẫn đúng đến Top component
import WorkSchedule from './components/WorkSchedule';
import StudentList from './components/StudentList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Top />} >
          <Route path="/" element={<WorkSchedule />} />
          <Route path="/workschedule" element={<WorkSchedule />} />
          <Route path="/studentlist" element={<StudentList />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
