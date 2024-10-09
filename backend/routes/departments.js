const express = require('express');
const router = express.Router();
const Department = require('../models/Department'); // Import mô hình Department
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

// Route để lấy danh sách các chi nhánh
router.get('/departments', checkAuth, async (req, res) => {
  try {
    // Lấy danh sách các department với điều kiện department_id <> 1
    const departments = await Department.findAll({
      where: {
        department_id: { [Op.ne]: 1 } // Sử dụng Op.ne để lọc
      }
    });
    
    res.json(departments);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chi nhánh', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
