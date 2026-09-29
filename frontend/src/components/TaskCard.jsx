import { useNavigate } from 'react-router-dom';

const STATUS_STYLES = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const PRIORITY_STYLES = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'COMPLETED') return false;
  return new Date(dueDate) < new Date();
};

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const navigate = useNavigate();

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate(`/tasks/${task.id}/edit`)}
            className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        {isOverdue(task.due_date, task.status) && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
            Overdue
          </span>
        )}
      </div>

      {/* Footer row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
        <div className="flex gap-4 text-xs text-gray-500">
          {task.due_date && (
            <span>Due: <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>{formatDate(task.due_date)}</span></span>
          )}
          <span>Created: {formatDate(task.created_at)}</span>
        </div>

        {task.status !== 'COMPLETED' && (
          <button
            onClick={() => onStatusChange(task.id, 'COMPLETED')}
            className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors"
          >
            ✓ Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
