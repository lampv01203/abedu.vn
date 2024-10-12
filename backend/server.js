const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const workScheduleRoutes = require('./routes/workSchedule');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const departmentRoutes = require('./routes/departments');
const levelRoutes = require('./routes/level');
const classRoutes = require('./routes/class');
const session = require('express-session');


dotenv.config(); // Load biến môi trường từ file .env

const app = express();
app.use(cors());
app.use(express.json()); // Phân tích dữ liệu JSON từ body của request

app.use(session({
  secret: '$2a$10$mxcTqGR.pbKoaoabKQju/OL7JRLW.4S8mIGMUla43iEVtuS.hhSLO', // Khóa bí mật để mã hóa session
  resave: false, // Không lưu lại session nếu không thay đổi
  saveUninitialized: true, // Lưu session chưa được khởi tạo
  cookie: { secure: false } // Bật cookie an toàn, false nếu không dùng https
}));

// Sử dụng route đăng nhập
app.use('/api', loginRoutes);
app.use('/api', workScheduleRoutes); // Kết nối route
app.use('/api', studentsRoutes); // Kết nối route
app.use('/api', teachersRoutes); // Kết nối route
app.use('/api', departmentRoutes); // Kết nối route chi nhánh
app.use('/api', levelRoutes); // Kết nối route level
app.use('/api', classRoutes); // Kết nối route


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
