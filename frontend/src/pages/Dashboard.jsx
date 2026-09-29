import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import ConfirmModal from '../components/ConfirmModal';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, updateTask, deleteTask } = useTasks();

  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const activeFilters = {};
    if (filters.status) activeFilters.status = filters.status;
    if (filters.priority) activeFilters.priority = filters.priority;
    fetchTasks(activeFilters);
  }, [filters, fetchTasks]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'TODO').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === id);
      await updateTask(id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        due_date: task.due_date,
      });
      setSuccessMsg('Task marked as completed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setActionError('Failed to update task status.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(deleteTarget);
      setDeleteTarget(null);
      setSuccessMsg('Task deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setActionError('Failed to delete task.');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => navigate('/tasks/new')}
            className="btn-primary self-start sm:self-auto"
          >
            + New Task
          </button>
        </div>

        {/* Status messages */}
        {actionError && <div className="mb-4"><Alert message={actionError} type="error" onClose={() => setActionError('')} /></div>}
        {successMsg && <div className="mb-4"><Alert message={successMsg} type="success" onClose={() => setSuccessMsg('')} /></div>}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={stats.total} color="blue" icon="📋" />
          <StatCard label="To Do" value={stats.todo} color="yellow" icon="📌" />
          <StatCard label="In Progress" value={stats.inProgress} color="orange" icon="🔄" />
          <StatCard label="Completed" value={stats.completed} color="green" icon="✅" />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" />
        ) : tasks.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-400 text-sm mb-6">
              {filters.status || filters.priority
                ? 'No tasks match your current filters.'
                : "You haven't created any tasks yet."}
            </p>
            {!filters.status && !filters.priority && (
              <button onClick={() => navigate('/tasks/new')} className="btn-primary">
                Create your first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={(id) => setDeleteTarget(id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Dashboard;
