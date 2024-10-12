// backend/models/Class.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Level = require("./Level");
const Department = require("./Department");

const Class = sequelize.define('Class', {
  class_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  class_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  del_flg: {
    type: DataTypes.TINYINT,
    defaultValue: 0, // 0 cho chưa xóa, 1 cho đã xóa
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  graduated_flg: {
    type: DataTypes.TINYINT,
    defaultValue: 0, // 0 cho chưa xóa, 1 cho đã xóa
  },
}, {
  tableName: 'class',
  timestamps: false,
});

// Thiết lập mối quan hệ
Class.belongsTo(Department, { foreignKey: 'department_id' }); 
// Thiết lập mối quan hệ
Class.belongsTo(Level, { foreignKey: 'Level_id' }); 
module.exports = Class;
