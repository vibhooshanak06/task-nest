const TaskFilters = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div>
        <label htmlFor="filter-status" className="label">Status</label>
        <select
          id="filter-status"
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="input w-40"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-priority" className="label">Priority</label>
        <select
          id="filter-priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="input w-40"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {(filters.status || filters.priority) && (
        <div className="flex items-end">
          <button
            onClick={() => onChange({ status: '', priority: '' })}
            className="btn-secondary text-xs h-9"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
