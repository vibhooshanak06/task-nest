const TaskService = require('../services/task.service');

const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const tasks = await TaskService.getAllTasks(req.user.id, filters);

    res.json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id, req.user.id);
    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await TaskService.createTask(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.user.id, req.body);
    res.json({
      success: true,
      message: 'Task updated successfully.',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await TaskService.deleteTask(req.params.id, req.user.id);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
