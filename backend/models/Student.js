// backend/models/Student.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Department = require("./Department"); // Import model Department

const Student = sequelize.define("Student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATE,
  },
  phone: {
    type: DataTypes.STRING,
  },
  facebook: {
    type: DataTypes.STRING,
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Department,
      key: 'department_id',
    },
  },
  note: {
    type: DataTypes.STRING,
  },
  del_flg: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Giả sử 0 có nghĩa là không bị xóa
  },
}, {
  tableName: "students", // Tên table trong database
  timestamps: false,  // Không tự động thêm createdAt, updatedAt
});

// Thiết lập mối quan hệ
Student.belongsTo(Department, { foreignKey: 'department_id' }); // Mối quan hệ 1-n giữa Student và Department

// Export model
module.exports = Student;
