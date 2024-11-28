const pool = require("../config/db");

const findUserByUserId = async (userId) => {
  const query = `
    SELECT 
      users.*, 
      d.department_code 
    FROM 
      users
    LEFT JOIN 
      department d ON users.department_id = d.department_id 
    WHERE user_id = ?
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows[0]; // Trả về người dùng đầu tiên nếu có
};

const registUser = async (
  user_id,
  full_name,
  role,
  email,
  phone,
  department_id,
  hashedPassword
) => {
  const query = `
    INSERT INTO users (user_id, full_name, role, email, phone, department_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
   await pool.query(query, [
    user_id,
    full_name,
    role,
    email,
    phone,
    department_id,
    hashedPassword,
  ]);
};

const changePass = async (newHashedPassword, user_id) => {
  const query = `
    UPDATE users SET password = ? WHERE user_id = ?
  `;
  await pool.query(query, [newHashedPassword, user_id]);
};

module.exports = { findUserByUserId, registUser, changePass };
