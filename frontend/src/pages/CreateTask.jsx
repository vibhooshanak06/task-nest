import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const initialForm = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  due_date: '',
};

const CreateTask = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Create Task</h1>
            <p className="text-gray-500 text-sm">Fill in the details for your new task</p>
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
                placeholder="What needs to be done?"
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" /> Creating...
                  </span>
                ) : (
                  'Create Task'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
                disabled={loading}
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

export default CreateTask;
