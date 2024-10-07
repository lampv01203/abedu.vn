const pool = require("../config/db");

const findUserByUserId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
    userId,
  ]);
  return rows[0]; // Trả về người dùng đầu tiên nếu có
};

module.exports = { findUserByUserId };
