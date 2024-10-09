// backend/models/Class.js
const { DataTypes } = require('sequelize');
const db = require('../config/sequelize');

const Department = db.define("Department", {
  department_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Tự động tăng
  },
  department_code: {
    type: DataTypes.STRING(50), // Kích thước tối đa 50 ký tự
    allowNull: false, // Không cho phép giá trị null
  },
  address: {
    type: DataTypes.STRING(500), // Kích thước tối đa 500 ký tự
    allowNull: true, // Có thể cho phép giá trị null
  },
  note: {
    type: DataTypes.TEXT, // Có thể lưu trữ chuỗi dài
    allowNull: true, // Có thể cho phép giá trị null
  },
  del_flg: {
    type: DataTypes.TINYINT, // Kiểu dữ liệu tinyint
    defaultValue: 0, // Giá trị mặc định là 0 (không bị xóa)
  },
}, {
    tableName: "department", // Tên table trong database
    timestamps: false,  // Không tự động thêm createdAt, updatedAt
  });

// Export model
module.exports = Department;
