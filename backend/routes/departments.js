const express = require('express');
const router = express.Router();
const Department = require('../models/Department'); // Import mô hình Department
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

// Route để lấy danh sách các chi nhánh
router.get('/departments', checkAuth, async (req, res) => {
  try {
    const user = req.session.user;

    // Tạo điều kiện tìm kiếm theo department_id nếu user.department_id không phải là 1
    const whereClause =
      user.department_id !== 1 ? { department_id: user.department_id } : {};
    // Lấy danh sách các department với điều kiện department_id <> 1
    const departments = await Department.findAll({
      where: whereClause,
    });
    
    res.json(departments);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chi nhánh', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
