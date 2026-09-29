const TaskModel = require('../models/task.model');

const TaskService = {
  async getAllTasks(userId, filters) {
    return TaskModel.findAllByUser(userId, filters);
  },

  async getTaskById(id, userId) {
    const task = await TaskModel.findByIdAndUser(id, userId);
    if (!task) {
      const error = new Error('Task not found.');
      error.statusCode = 404;
      throw error;
    }
    return task;
  },

  async createTask(userId, data) {
    const { title, description, status = 'TODO', priority = 'MEDIUM', due_date } = data;
    return TaskModel.create({ title: title.trim(), description, status, priority, due_date, userId });
  },

  async updateTask(id, userId, data) {
    // First verify task belongs to user
    const existing = await TaskModel.findByIdAndUser(id, userId);
    if (!existing) {
      const error = new Error('Task not found.');
      error.statusCode = 404;
      throw error;
    }

    const { title, description, status, priority, due_date } = data;
    const updated = await TaskModel.update(id, userId, {
      title: (title || existing.title).trim(),
      description: description !== undefined ? description : existing.description,
      status: status || existing.status,
      priority: priority || existing.priority,
      due_date: due_date !== undefined ? due_date : existing.due_date,
    });

    return updated;
  },

  async deleteTask(id, userId) {
    const task = await TaskModel.findByIdAndUser(id, userId);
    if (!task) {
      const error = new Error('Task not found.');
      error.statusCode = 404;
      throw error;
    }
    await TaskModel.delete(id, userId);
    return { message: 'Task deleted successfully.' };
  },

  async getStats(userId) {
    return TaskModel.getStats(userId);
  },
};

module.exports = TaskService;
