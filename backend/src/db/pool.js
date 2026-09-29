const mysql = require('mysql2/promise');
const config = require('../config/config');

const pool = mysql.createPool({
  uri: config.databaseUrl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

// Thin wrapper so models call query() the same way
const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const getConnection = () => pool.getConnection();

module.exports = { query, getConnection, pool };
