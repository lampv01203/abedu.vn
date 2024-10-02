const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Thay bằng username của bạn
  database: 'lampeW7mXD_db', // Thay bằng tên database của bạn
  password: '123456798', // Thay bằng password của bạn
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
