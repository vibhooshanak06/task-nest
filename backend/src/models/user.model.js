const db = require('../db/pool');

const UserModel = {
  async findByEmail(email) {
    const rows = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password }) {
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    // result is an OkPacket for INSERT — fetch the created row
    return this.findById(result.insertId);
  },

  async emailExists(email) {
    const rows = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  },
};

module.exports = UserModel;
