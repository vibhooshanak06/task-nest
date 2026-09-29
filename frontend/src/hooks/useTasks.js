import { useState, useCallback } from 'react';
import { tasksAPI } from '../services/api';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksAPI.getAll(filters);
      setTasks(response.data.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data) => {
    const response = await tasksAPI.create(data);
    const newTask = response.data.data.task;
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const response = await tasksAPI.update(id, data);
    const updated = response.data.data.task;
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksAPI.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
};

export default useTasks;
