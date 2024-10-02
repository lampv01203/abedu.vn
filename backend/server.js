const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const workScheduleRoutes = require('./routes/workSchedule');
const studentsRoutes = require('./routes/students');

dotenv.config(); // Load biến môi trường từ file .env

const app = express();
app.use(cors());
app.use(express.json()); // Phân tích dữ liệu JSON từ body của request

// Sử dụng route đăng nhập
app.use('/api', loginRoutes);
app.use('/api', workScheduleRoutes); // Kết nối route
app.use('/api', studentsRoutes); // Kết nối route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
