const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateTask } = require('../middleware/validate.middleware');

// All task routes require authentication
router.use(authenticate);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
