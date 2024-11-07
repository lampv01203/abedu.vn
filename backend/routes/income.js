const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Giả sử bạn có file db.js để kết nối database
const checkAuth = require('./auth'); // Import hàm checkAuth từ auth.js

// API lấy dữ liệu bảng lương
router.get("/salaries", checkAuth, async (req, res) => {
  try {
    const query = `
      SELECT 
        ts.salary_id AS id,
        t.full_name AS teacher_name,
        ts.teaching_salary,
        ts.basic_salary,
        ts.revenue,
        ts.allowance,
        ts.campaign,
        ts.deductions,
        ts.social_insurance,
        ts.total_salary
      FROM teacher_salary ts
      LEFT JOIN teacher t ON ts.teacher_id = t.teacher_id
      WHERE ts.del_flg = 0
      ORDER BY ts.salary_id;
    `;

    const [salaries] = await db.execute(query);
    res.json(salaries);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lương nhân viên:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
