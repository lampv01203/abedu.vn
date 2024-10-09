const express = require("express");
const router = express.Router();
const Level = require("../models/Level"); // Import Sequelize model
const checkAuth = require("./auth"); // Import middleware checkAuth

// API lấy danh sách cấp độ
router.get("/getLevels", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const levels = await Level.findAll({ where: { del_flg: false } }); // Lấy danh sách các cấp độ không bị xóa
    res.json(levels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API thêm cấp độ mới
router.post("/addLevel", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { level_code, description, session_number, course_fees, note } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!level_code || !description) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra xem cấp độ đã tồn tại hay chưa
    const existingLevel = await Level.findOne({
      where: { level_code },
    });

    if (existingLevel) {
      return res.status(400).json({
        message: `Cấp độ ${level_code} đã được đăng ký`,
      });
    }
    const newLevel = await Level.create({
      level_code,
      description,
      session_number,
      course_fees,
      note,
    });

    res.status(201).json({
      message: "Cấp độ đã được thêm thành công",
      level_id: newLevel.level_id,
    });
  } catch (error) {
    console.error("Lỗi khi thêm cấp độ:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thêm cấp độ" });
  }
});

// API lấy thông tin cấp độ theo ID
router.get("/getLevel/:id", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const level = await Level.findByPk(req.params.id);
    if (!level) {
      return res.status(404).json({ message: "Cấp độ không tồn tại" });
    }
    res.json(level);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cấp độ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// API cập nhật cấp độ
router.put("/updateLevel/:id", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const { level_code, description, session_number, course_fees, note } = req.body;

    const level = await Level.findByPk(req.params.id);
    if (!level) {
      return res.status(404).json({ message: "Cấp độ không tồn tại" });
    }

    await level.update({
      level_code,
      description,
      session_number,
      course_fees,
      note,
    });

    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật cấp độ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});
// Route để xóa cấp độ học
router.delete("/deleteLevel/:id", checkAuth, async (req, res) => {
  try {
    const level = await Level.findByPk(req.params.id);

    if (!level)
      return res.status(404).json({ message: "Cấp độ học không tồn tại" });

    // Đánh dấu cấp độ học là đã xóa
    await level.update({ del_flg: 1 }); // Đánh dấu trường del_flg là 1

    res.status(200).json({ message: "Cấp độ học đã bị xóa" });
  } catch (error) {
    console.error("Lỗi khi xóa cấp độ học", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;