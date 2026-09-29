const app = require('./app');
const config = require('./config/config');
const { pool } = require('./db/pool');

const startServer = async () => {
  try {
    // Test database connection
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    app.listen(config.port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();
