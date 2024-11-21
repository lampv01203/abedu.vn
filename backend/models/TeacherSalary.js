// backend/models/TeacherSalary.js
const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");

const TeacherSalary = db.define("teacher_salary", {
    salary_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Tự động tăng
    },
    teacher_id: { type: DataTypes.INTEGER },
    salary_month: { type: DataTypes.DATE },
    basic_salary: { type: DataTypes.DECIMAL(10, 2) },
    teaching_salary: { type: DataTypes.DECIMAL(10, 2) },
    allowance: { type: DataTypes.DECIMAL(10, 2) },
    deductions: { type: DataTypes.DECIMAL(10, 2) },
    revenue: { type: DataTypes.DECIMAL(10, 2) },
    campaign: { type: DataTypes.DECIMAL(10, 2) },
    social_insurance: { type: DataTypes.DECIMAL(10, 2) },
    total_salary: { type: DataTypes.DECIMAL(10, 2) },
    note: { type: DataTypes.TEXT},
    paid_flg: { type: DataTypes.TINYINT},
    del_flg: { type: DataTypes.TINYINT},
  },
  {
    tableName: "teacher_salary", // Tên table trong database
    timestamps: true, // Không tự động thêm createdAt, updatedAt
  }
);

// Export model
module.exports = TeacherSalary;
