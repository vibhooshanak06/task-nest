const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
