export default function Modal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-large">
        <div className="modal-header">
          <div className="modal-title-block">
            <h3>{title}</h3>
          </div>
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
