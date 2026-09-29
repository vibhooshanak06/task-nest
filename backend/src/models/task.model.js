const db = require('../db/pool');

const TASK_COLS = `
  id, title, description, status, priority,
  DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
  user_id, created_at, updated_at
`;

const TaskModel = {
  async findAllByUser(userId, filters = {}) {
    let sql = `SELECT ${TASK_COLS} FROM tasks WHERE user_id = ?`;
    const params = [userId];

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.priority) {
      sql += ' AND priority = ?';
      params.push(filters.priority);
    }

    sql += ' ORDER BY created_at DESC';
    return db.query(sql, params);
  },

  async findByIdAndUser(id, userId) {
    const rows = await db.query(
      `SELECT ${TASK_COLS} FROM tasks WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  },

  async create({ title, description, status, priority, due_date, userId }) {
    const result = await db.query(
      `INSERT INTO tasks (title, description, status, priority, due_date, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || null, status, priority, due_date || null, userId]
    );
    return this.findByIdAndUser(result.insertId, userId);
  },

  async update(id, userId, { title, description, status, priority, due_date }) {
    await db.query(
      `UPDATE tasks
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, description || null, status, priority, due_date || null, id, userId]
    );
    return this.findByIdAndUser(id, userId);
  },

  async delete(id, userId) {
    const result = await db.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async getStats(userId) {
    const rows = await db.query(
      `SELECT
         COUNT(*)                                        AS total,
         SUM(status = 'TODO')                           AS todo,
         SUM(status = 'IN_PROGRESS')                    AS in_progress,
         SUM(status = 'COMPLETED')                      AS completed
       FROM tasks
       WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  },
};

module.exports = TaskModel;
