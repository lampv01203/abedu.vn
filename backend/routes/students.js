// backend/routes/students.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

router.get('/getStudents', checkAuth, async (req, res) => {
  try {
    // Lấy thông tin user từ session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let query = `
      SELECT 
        s.student_id,
        s.full_name, 
        s.birthday, 
        s.phone, 
        s.facebook, 
        d.department_code,
        s.note 
      FROM students s
      LEFT JOIN department d
      ON s.department_id = d.department_id
    `;
    let params = [];

    if (user.department_id !== 1) {
      query += ' WHERE s.department_id = ?';
      params.push(user.department_id);
    }

    query += ' ORDER BY full_name'; // Thêm điều kiện sắp xếp theo full_name

    const [students] = await db.query(query, params);
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route để thêm sinh viên
router.post('/addStudents', checkAuth, async (req, res) => {
  const { full_name, birthday, phone, facebook, department_id, note } = req.body;

  const query = `
    INSERT INTO students (full_name, birthday, phone, facebook, department_id, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const params = [full_name, birthday, phone, facebook, department_id, note];

  try {
    const [result] = await db.query(query, params);
    res.status(201).json({ success: true, message: 'Thêm sinh viên thành công', student_id: result.insertId });
  } catch (error) {
    console.error('Lỗi khi thêm sinh viên:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thêm sinh viên' });
  }
});

module.exports = router;
