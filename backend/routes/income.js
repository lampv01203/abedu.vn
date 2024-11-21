const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Giả sử bạn có file db.js để kết nối database
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js
const TeacherSalary = require("../models/TeacherSalary");

// API lấy dữ liệu bảng lương
router.get("/salaries", checkAuth, async (req, res) => {
  try {
    const paramDate = req.query.date; // Ngày được truyền từ client (ví dụ: '2024-10-09')
    const paramdepartmentId = req.query.departmentId; // Department được truyền từ client
    const salaries = await TeacherSalary.sequelize.query(`
      SELECT 
        ts.salary_id,
        t.teacher_id,
        t.full_name AS teacher_name,
        ts.salary_month,
        ts.basic_salary,
        SUM(ta.session_salary) AS teaching_salary,
        ts.allowance,
        ts.deductions,
        ts.revenue,
        ts.campaign,
        ts.revenue,
        ts.social_insurance,
        ts.total_salary,
        ts.note,
        ts.paid_flg
      FROM
        teacher t 
      LEFT JOIN 
        teacher_salary ts ON t.teacher_id = ts.teacher_id AND DATE_FORMAT(ts.salary_month, '%Y-%m') = :paramDate
      LEFT JOIN
        teacher_attend ta ON t.teacher_id = ta.teacher_id AND ta.paid_flg = 0
      WHERE 
        t.del_flg = 0
      AND (:paramdepartmentId = 1 OR t.department_id = :paramdepartmentId)
      GROUP BY 
        ts.salary_id,
        t.teacher_id,
        t.full_name,
        ts.salary_month,
        ts.basic_salary,
        ts.allowance,
        ts.deductions,
        ts.revenue,
        ts.campaign,
        ts.revenue,
        ts.social_insurance,
        ts.total_salary,
        ts.note,
        ts.paid_flg
      ORDER BY ts.salary_id;
      `,
      {
        replacements: {
          paramDate,
          paramdepartmentId,
        },
        type: TeacherSalary.sequelize.QueryTypes.SELECT,
      }
    );
    res.json(salaries);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu lương nhân viên:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// Route to update an existing class
router.post("/updateSalaries", checkAuth, async (req, res) => {
  const paramDate = req.query.date; // Ngày được truyền từ client (ví dụ: '2024-10-09')
  // Extract salary details from the request body
  const {
    salary_id,
    teacher_id,
    basic_salary = 0,
    revenue = 0,
    allowance = 0,
    campaign = 0,
    deductions = 0,
    social_insurance = 0,
    teaching_salary = 0,
  } = req.body;

  // // Manually calculate total_salary
  // const total_salary =
  //   parseFloat(basic_salary) +
  //   parseFloat(revenue) +
  //   parseFloat(allowance) +
  //   parseFloat(campaign) +
  //   parseFloat(deductions) +
  //   parseFloat(social_insurance) +
  //   parseFloat(teaching_salary);
  try {
    await TeacherSalary.upsert({
      salary_id: salary_id,
      teacher_id: teacher_id,
      salary_month: paramDate,
      basic_salary: basic_salary,
      teaching_salary: teaching_salary,
      revenue: revenue,
      allowance: allowance,
      campaign: campaign,
      deductions: deductions,
      social_insurance: social_insurance,
    });

    res.status(200).json({ message: "Cập nhập lương giáo viên thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhập lương giáo viên", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});


module.exports = router;
