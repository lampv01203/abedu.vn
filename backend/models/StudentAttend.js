// backend/models/StudentAttend.js
const { DataTypes } = require("sequelize");
const db = require("../config/sequelize");

const StudentAttend = db.define("student_attend", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Tự động tăng
    },
    class_id: { type: DataTypes.INTEGER },
    student_id: { type: DataTypes.INTEGER },
    schedule_id: { type: DataTypes.INTEGER },
    attend_date: { type: DataTypes.DATE },
    attend_flg: { type: DataTypes.BOOLEAN },
  },
  {
    tableName: "student_attend", // Tên table trong database
    timestamps: false, // Không tự động thêm createdAt, updatedAt
  }
);

// Export model
module.exports = StudentAttend;
