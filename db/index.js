// db/index.js
const mysql = require('mysql2/promise');

// 改成你自己的数据库信息
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // 你的MySQL用户名
  password: 'root',   // 你的MySQL密码
  database: 'keeppunch',    // 你建的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    conn.release();
  } catch (e) {
    console.error('❌ 数据库连接失败：', e.message);
  }
})();

module.exports = pool;