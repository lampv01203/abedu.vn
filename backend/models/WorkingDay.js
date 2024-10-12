// backend/models/WorkingDay.js
const { DataTypes } = require('sequelize');
const db = require('../config/sequelize');

const WorkingDay = db.define("working_day", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Tự động tăng
  },
  day_of_week: {
    type: DataTypes.STRING(50), // Kích thước tối đa 50 ký tự
    allowNull: false, // Không cho phép giá trị null
  },
}, {
    tableName: "working_day", // Tên table trong database
    timestamps: false,  // Không tự động thêm createdAt, updatedAt
  });

// Export model
module.exports = WorkingDay;
