const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Kết nối cơ sở dữ liệu

const Level = sequelize.define("Level", {
  level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  level_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  session_number: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  course_fees: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  del_flg: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Cờ đánh dấu xóa
  },
}, {
  tableName: "level", // Tên table trong database
  timestamps: false,  // Không tự động thêm createdAt, updatedAt
});

module.exports = Level;