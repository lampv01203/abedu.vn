// backend/routes/teachers.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

router.get('/getTeachers', checkAuth, async (req, res) => {
  try {
    // Lấy thông tin user từ session
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    let query = `
        SELECT 
          t.teacher_id,
          t.full_name, 
          t.birthday, 
          t.phone, 
          t.facebook, 
          d.department_code,
          t.address,
          t.note 
        FROM teacher t
        LEFT JOIN department d
        ON t.department_id = d.department_id
      `;
    let params = [];
    if (user.department_id !== 1) {
      query += ' WHERE t.department_id = ?';
      params.push(user.department_id);
    }

    query += ' ORDER BY full_name'; // Thêm điều kiện sắp xếp theo full_name

    const [teachers] = await db.query(query, params);
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Thêm giáo viên
router.post('/addTeacher', checkAuth, async (req, res) => {
  const { full_name, birthday, phone, facebook, address, department_id, note } = req.body;

  try {
    const query = 'INSERT INTO teacher (full_name, birthday, phone, facebook, address, department_id, note) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.query(query, [full_name, birthday, phone, facebook, address, department_id, note]);

    res.status(201).json({ message: 'Thêm giáo viên thành công' });
  } catch (error) {
    console.error('Lỗi khi thêm giáo viên', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
