const express = require("express");
const router = express.Router();
const Level = require('../models/Level'); // Import mô hình level
const db = require("../config/db");
const checkAuth = require("./auth"); // Import hàm checkAuth từ auth.js

router.get("/getLevels", checkAuth, async (req, res) => {
  try {
    // Lấy thông tin user từ session
    const user = req.session.user;
    // Kiểm tra department_id
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    let query = `
        SELECT *
        FROM level
        WHERE del_flg = 0
      `;
    const [levels] = await db.query(query);
    res.json(levels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route thêm cấp độ mới (chỉ dành cho user có department_id = 1)
router.post("/addLevel", checkAuth, async (req, res) => {
  try {
    const { level_code, description, session_number, course_fees, note } =
      req.body;
    const user = req.session.user;
    // Kiểm tra department_id
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Kiểm tra các trường bắt buộc
    if (!level_code || !description) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Thực hiện câu lệnh SQL để thêm cấp độ
    const query = `
      INSERT INTO level (level_code, description, session_number, course_fees, note)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      level_code,
      description,
      session_number || null,
      course_fees || null,
      note || null,
    ];

    const [result] = await db.query(query, params);

    res.status(201).json({
      message: "Cấp độ đã được thêm thành công",
      level_id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi thêm cấp độ:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi thêm cấp độ" });
  }
});

// API để lấy thông tin cấp độ theo ID
router.get("/getLevel/:id", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    // Kiểm tra department_id
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const level = await Level.findByPk(req.params.id); // Giả định bạn đang sử dụng Sequelize
    if (!level) return res.status(404).send("Cấp độ không tồn tại.");
    res.json(level);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cấp độ", error);
    res.status(500).send("Lỗi server.");
  }
});

// API để cập nhật thông tin cấp độ
router.put("/updateLevel/:id", checkAuth, async (req, res) => {
  try {
    const user = req.session.user;
    // Kiểm tra department_id
    if (user.department_id !== 1) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    const levelData = req.body;  // Nhận object level từ frontend
    // const level = await db.query(query, params);
    const level = await Level.findByPk(req.params.id); // Giả định bạn đang sử dụng Sequelize
    if (!level) return res.status(404).send("Cấp độ không tồn tại.");

    const isUpdated = await Level.updateByPk(levelData);

    if (!isUpdated) {
      return res.status(404).json({ message: "Cấp độ không tồn tại hoặc cập nhật thất bại" });
    }

    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật cấp độ", error);
    res.status(500).send("Lỗi server.");
  }
});

module.exports = router;
