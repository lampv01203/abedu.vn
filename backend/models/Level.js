const db = require("../config/db");

const Level = {
  findByPk: async (level_id) => {
    const [rows] = await db.query("SELECT * FROM level WHERE level_id = ?", [
      level_id,
    ]);
    return rows[0]; // Trả về người dùng đầu tiên nếu có
  },
  updateByPk: async (levelData) => {
    try {
      const query = `
        UPDATE level 
        SET 
          level_code = ?, 
          description = ?, 
          session_number = ?, 
          course_fees = ?, 
          note = ?
        WHERE level_id = ?
      `;
      const updateParams = [
        levelData.level_code, 
        levelData.description, 
        levelData.session_number, 
        levelData.course_fees, 
        levelData.note, 
        levelData.level_id
      ];
      const [result] = await db.query(query, updateParams);
      return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
    } catch (error) {
      console.error("Lỗi khi cập nhật cấp độ", error);
      res.status(500).send("Lỗi server.");
    }
  },
};

module.exports = Level;
