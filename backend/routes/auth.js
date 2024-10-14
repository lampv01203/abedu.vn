// backend/auth.js
const checkAuth = (req, res, next) => {
  if (req.session.user) {
    // Nếu đã đăng nhập, tiếp tục xử lý
    next();
  } else {
    // Nếu chưa đăng nhập, trả về lỗi hoặc chuyển hướng về trang đăng nhập
    res.status(401).json({ message: "Unauthorized, please login." });
  }
};

module.exports = checkAuth;
