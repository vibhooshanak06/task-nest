import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import useTasks from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { FullPageSpinner } from '../components/Spinner';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTask } = useTasks();

  const [form, setForm] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing task
  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await tasksAPI.getById(id);
        const task = response.data.data.task;
        setForm({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          due_date: task.due_date ? task.due_date.split('T')[0] : '',
        });
      } catch (err) {
        setFetchError(err.response?.data?.message || 'Failed to load task.');
      } finally {
        setFetchLoading(false);
      }
    };
    loadTask();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setSubmitLoading(true);
    try {
      await updateTask(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) return <FullPageSpinner />;

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Alert message={fetchError} type="error" />
          <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4">
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Task</h1>
            <p className="text-gray-500 text-sm">Update your task details</p>
          </div>
        </div>

        <div className="card p-6">
          <Alert message={error} type="error" onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4" noValidate>
            {/* Title */}
            <div>
              <label htmlFor="title" className="label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="input"
                placeholder="Task title"
                disabled={submitLoading}
                maxLength={255}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input resize-none"
                placeholder="Add more details (optional)"
                rows={4}
                disabled={submitLoading}
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input"
                  disabled={submitLoading}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="label">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="input"
                  disabled={submitLoading}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            {/* Due date */}
            <div>
              <label htmlFor="due_date" className="label">Due Date</label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                className="input"
                disabled={submitLoading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={submitLoading}>
                {submitLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" /> Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={submitLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditTask;
