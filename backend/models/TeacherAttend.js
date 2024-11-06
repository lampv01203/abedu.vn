// backend/models/StudentAttend.js
const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");

const TeacherAttend = db.define("teacher_attend", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Tự động tăng
    },
    class_id: { type: DataTypes.INTEGER },
    teacher_id: { type: DataTypes.INTEGER },
    schedule_id: { type: DataTypes.INTEGER },
    attend_date: { type: DataTypes.DATE },
    session_salary: { type: DataTypes.DECIMAL(10, 2) },
  },
  {
    tableName: "teacher_attend", // Tên table trong database
    timestamps: false, // Không tự động thêm createdAt, updatedAt
  }
);

// Export model
module.exports = TeacherAttend;
