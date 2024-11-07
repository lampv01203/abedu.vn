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

module.exports = { findUserByUserId };
