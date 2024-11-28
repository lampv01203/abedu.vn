const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUserByUserId, registUser, changePass } = require("../models/User");
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

router.post("/changePass", async (req, res) => {
  const { user_id, curr_password, new_password } = req.body;

  // Validate input
  if (!user_id || !curr_password || !new_password) {
    return res.status(400).json({
      success: false,
      message: "Hãy điền thông tin bắt buộc: Mật khẩu hiện tại, Mật khẩu mới.",
    });
  }

  try {
    // Tìm người dùng qua userId
    const user = await findUserByUserId(user_id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại." });
    }

    const hashedPassword = user.password;

    // Compare current password with the stored hashed password
    const isMatch = await bcrypt.compare(curr_password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(new_password, salt);

    // Update the password in the database
    await changePass(newHashedPassword, user_id);

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error in changePass:", error);
    return res.status(500).json({
      success: false,
      message: "Xảy ra lỗi khi đổi mật khẩu.",
    });
  }
});

router.put("/regisUser", async (req, res) => {
  const {
    user_id,
    full_name,
    role,
    email,
    phone,
    department_id,
    password,
    confirm_password,
  } = req.body;

  // Validate input
  if (
    !user_id ||
    !full_name ||
    !role ||
    !phone ||
    !department_id ||
    !password ||
    !confirm_password
  ) {
    return res.status(400).json({
      success: false,
      message: "Hãy điền thông tin bắt buộc.",
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({
      success: false,
      message: "Mật khẩu không đồng bộ.",
    });
  }

  try {
    // Check if the user ID already exists
    const existingUser = await findUserByUserId(user_id);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Tài khoản đã tồn tại",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    registUser(user_id, full_name, role, email, phone, department_id, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản mới thành công.",
    });
  } catch (error) {
    console.error("Xảy ra lỗi khi đăng ký tài khoản mới:", error);
    return res.status(500).json({
      success: false,
      message: "Xảy ra lỗi khi đăng ký tài khoản mới.",
    });
  }
});

module.exports = router;
