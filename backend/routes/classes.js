// backend/routes/classes.js
const express = require("express");
const router = express.Router();
const Classes = require('../models/Classes');
const Teacher = require('../models/Teacher');
const Level = require('../models/Level');
const Department = require('../models/Department');
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js

// Route để lấy danh sách các lớp học
router.get("/getClasses", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;

    // Lọc theo department_id nếu không phải là admin
    const condition =
      user.department_id !== 1 ? { department_id: user.department_id } : {};

    const classes = await Classes.findAll({
      where: {
        del_flg: 0,
        ...condition, // Thêm điều kiện vào truy vấn
      },
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
        {
          model: Level,
          attributes: ["level_code"], // Lấy level_code từ bảng Level
        },
      ],
    });

    res.json(classes);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để lấy thông tin lớp học theo ID
router.get("/getClass/:id", checkAuth, async (req, res) => {
  try {
    const classInfo = await Classes.findOne({
      where: {
        class_id: req.params.id,
        del_flg: 0, // Lọc chỉ lấy lớp chưa bị xóa
      },
      include: [
        {
          model: Department,
          attributes: ["department_code"], // Chỉ lấy department_code
        },
        {
          model: Level,
          attributes: ["level_code"], // Lấy level_code từ bảng Level
        },
        {
          model: Teacher,
          attributes: ["full_name"], // Lấy full_name từ bảng Teacher
        },
      ],
    });

    if (!classInfo)
      return res.status(404).json({ message: "Lớp học không tồn tại" });

    res.json(classInfo);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để thêm lớp học mới
router.post("/addClass", checkAuth, async (req, res) => {
  try {
    const newClass = await Classes.create(req.body); // Tạo lớp mới từ body của yêu cầu

    res.status(201).json({
      message: "Lớp học đã được thêm thành công",
      class_id: newClass.class_id,
    });
  } catch (error) {
    console.error("Lỗi khi thêm lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để cập nhật thông tin lớp học
router.put("/updateClass/:id", checkAuth, async (req, res) => {
  try {
    const classInfo = await Classes.findByPk(req.params.id);

    if (!classInfo)
      return res.status(404).json({ message: "Lớp học không tồn tại" });

    await classInfo.update(req.body); // Cập nhật thông tin lớp học

    res.status(200).json({ message: "Cập nhật lớp học thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Route để xóa lớp học
router.delete("/deleteClass/:id", checkAuth, async (req, res) => {
  try {
    const classInfo = await Classes.findByPk(req.params.id);

    if (!classInfo)
      return res.status(404).json({ message: "Lớp học không tồn tại" });

    // Đánh dấu lớp học là đã xóa
    await classInfo.update({ del_flg: 1 });

    res.status(200).json({ message: "Lớp học đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa lớp học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
