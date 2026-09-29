const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('./pool');

const runMigration = async () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Split on semicolons and run each statement individually
  // (mysql2 does not support multi-statement by default)
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  let conn;
  try {
    conn = await pool.getConnection();
    for (const stmt of statements) {
      await conn.execute(stmt);
    }
  } catch (error) {
    process.exit(1);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
};

runMigration();
