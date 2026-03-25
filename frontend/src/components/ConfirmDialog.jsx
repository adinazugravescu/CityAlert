export default function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="confirm-dialog-copy">
          <span className="section-eyebrow">Confirmation</span>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="danger-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
