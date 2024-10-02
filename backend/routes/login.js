const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByUserId } = require('../models/User');

const router = express.Router();

// Định nghĩa API đăng nhập
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Tìm người dùng qua userId
    const user = await findUserByUserId(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại' });
    }

    // Kiểm tra mật khẩu
    // Mã hóa mật khẩu
    // const salt = await bcrypt.genSalt(10); // Tạo salt
    // const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Sai mật khẩu: ${hashedPassword} -- ${user.password}`); // Log khi mật khẩu sai
      return res.status(400).json({ success: false, message: 'Sai mật khẩu' });
    }

    // Tạo token JWT
    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Phản hồi với token
    res.json({ success: true, message: 'Đăng nhập thành công', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
