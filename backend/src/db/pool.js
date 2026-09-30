const mysql = require('mysql2/promise');
const config = require('../config/config');

const pool = mysql.createPool({
  host:               config.db.host,
  port:               config.db.port,
  database:           config.db.name,
  user:               config.db.user,
  password:           config.db.password,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
});

const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

const getConnection = () => pool.getConnection();

module.exports = { query, getConnection, pool };
