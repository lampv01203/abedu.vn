const { Sequelize, DataTypes, Model } = require('sequelize');
const db = require('../config/sequelize');
const Department = require('./Department');

const Teacher = db.define('Teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    references: {
        model: Department,
        key: ['department_id']
    }
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  birthday: {
    type: DataTypes.STRING(50), // Có thể sử dụng DATE nếu muốn quản lý theo dạng ngày
  },
  phone: {
    type: DataTypes.STRING(50),
  },
  facebook: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  del_flg: {
    type: DataTypes.TINYINT,
    defaultValue: 0, // 0: không xóa, 1: đã xóa
  },
}, {
  tableName: 'teacher',
  timestamps: false, // Nếu bạn không cần trường createdAt, updatedAt
});

// Khai báo mối quan hệ
Teacher.belongsTo(Department, { foreignKey: 'department_id' });

module.exports = Teacher;
