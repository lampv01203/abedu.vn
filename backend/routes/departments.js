// backend/routes/departments.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

// Route để lấy danh sách các chi nhánh
router.get('/departments', checkAuth, async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM department WHERE department_id <> 1');
    res.json(departments);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chi nhánh', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
