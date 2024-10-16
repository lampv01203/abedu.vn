const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByUserId } = require("../models/User");
const secretKey =
  "$2a$10$mxcTqGR.pbKoaoabKQju/OL7JRLW.4S8mIGMUla43iEVtuS.hhSLO"; // Khóa bí mật để mã hóa và giải mã token

const router = express.Router();

// Định nghĩa API đăng nhập
router.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Tìm người dùng qua userId
    const user = await findUserByUserId(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    // Kiểm tra mật khẩu
    // Mã hóa mật khẩu
    // const salt = await bcrypt.genSalt(10); // Tạo salt
    // const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // console.log(`Sai mật khẩu: ${hashedPassword} -- ${user.password}`); // Log khi mật khẩu sai
      return res.status(400).json({ success: false, message: "Sai mật khẩu" });
    }

    // Lưu toàn bộ thông tin user vào session
    req.session.user = {
      user_id: user.user_id,
      full_name: user.full_name,
      role: user.role,
      email: user.email,
      phone: user.phone,
      department_id: user.department_id,
    };
    console.log("login: ", req.session.user);
    // Tạo token JWT
    const token = jwt.sign({ id: user.userId }, secretKey, { expiresIn: "1h" });

    // Phản hồi với token
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Định nghĩa API logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Lỗi khi đăng xuất" });
    }
    res.json({ success: true, message: "Đăng xuất thành công" });
  });
});

router.post("/checkAuth", (req, res) => {
  if (req.session.user) {
    // Nếu xác thực thành công
    res.status(200).json({ message: "authorized", user: req.session.user });
  } else {
    // Nếu chưa đăng nhập, trả về lỗi hoặc chuyển hướng về trang đăng nhập
    res.status(401).json({ message: "Unauthorized, please login." });
  }
});

module.exports = router;
