// backend/routes/teachers.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const Teacher = require("../models/Teacher"); // Import mô hình Teacher
const Department = require("../models/Department"); // Import mô hình Department
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js

router.get("/getTeachers", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    const query = {
      del_flg: 0, // Lọc chỉ lấy giáo viên chưa bị xóa
    };

    // Nếu department_id của user khác 1, thêm điều kiện lọc department_id
    if (user.department_id !== 1) {
      query.department_id = user.department_id;
    }

    // Lấy danh sách giáo viên với LEFT JOIN Department để lấy department_code
    const teachers = await Teacher.findAll({
      where: query,
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
      ],
    });

    res.json(teachers);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giáo viên", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Thêm giáo viên
router.post("/addTeacher", checkAuth, async (req, res) => {
  try {
    const { full_name, birthday, phone } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!full_name) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra trùng lặp
    const existingTeacher = await Teacher.findOne({
      where: {
        full_name,
        birthday,
        phone,
        del_flg: 0, // Kiểm tra chỉ với những giáo viên chưa bị xóa
      },
    });

    if (existingTeacher) {
      return res
        .status(400)
        .json({ message: `Giáo viên ${full_name} đã được đăng ký` });
    }

    const newTeacher = await Teacher.create(req.body);
    res.status(201).json({
      message: "Giáo viên đã được thêm thành công",
      teacher_id: newTeacher.teacher_id,
    });
  } catch (error) {
    console.error("Lỗi khi thêm giáo viên:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thêm giáo viên" });
  }
});
// Route để lấy thông tin giáo viên theo ID
router.get("/getTeacher/:id", checkAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: {
        teacher_id: req.params.id,
        del_flg: 0, // Lọc chỉ lấy giáo viên chưa bị xóa
      },
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
      ],
    });

    if (!teacher)
      return res.status(404).json({ message: "Giáo viên không tồn tại" });

    res.json(teacher);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin giáo viên", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// Route để cập nhật thông tin giáo viên
router.put("/updateTeacher/:id", checkAuth, async (req, res) => {
  try {
    const { full_name, birthday, phone } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!full_name || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const existingTeacher = await Teacher.findOne({
      where: {
        [Op.and]: [
          { del_flg: 0 }, // Kiểm tra giáo viên chưa bị xóa
          { teacher_id: { [Op.ne]: req.params.id } }, // Giáo viên không phải là giáo viên đang cập nhật
          { [Op.or]: [{ full_name }, { birthday }, { phone }] }, // Kiểm tra trùng lặp
        ],
      },
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: `Giáo viên ${full_name} đã bị cập trùng thông tin với giáo viên khác`,
      });
    }

    await Teacher.update(req.body, {
      where: {
        teacher_id: req.params.id,
        del_flg: 0, // Chỉ cập nhật giáo viên chưa bị xóa
      },
    });

    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật giáo viên", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để xóa giáo viên
router.delete("/deleteTeacher/:id", checkAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher)
      return res.status(404).json({ message: "Giáo viên không tồn tại" });

    // Đánh dấu giáo viên là đã xóa
    await teacher.update({ del_flg: 1 }); // Đánh dấu trường del_flg là 1

    res.status(200).json({ message: "Giáo viên đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa giáo viên", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});
module.exports = router;
