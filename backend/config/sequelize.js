const { Sequelize } = require('sequelize');

// Tạo kết nối đến cơ sở dữ liệu
const db = new Sequelize('lampeW7mXD_db', 'root', '123456798', {
  host: 'localhost',
  dialect: 'mysql', // Chọn dialect phù hợp, ví dụ: 'mysql', 'postgres', 'sqlite'
});

module.exports = db;
