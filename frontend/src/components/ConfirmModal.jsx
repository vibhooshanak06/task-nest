const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="card p-6 w-full max-w-sm shadow-xl">
        <h2 id="modal-title" className="text-lg font-semibold text-gray-800 mb-2">
          {title || 'Confirm Action'}
        </h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
