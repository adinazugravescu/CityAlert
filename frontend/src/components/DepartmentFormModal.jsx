import { useEffect, useState } from "react";
import Modal from "./Modal";

function toInitialState(department) {
  return {
    name: department?.name ?? "",
    description: department?.description ?? "",
  };
}

export default function DepartmentFormModal({ open, title, department, onClose, onSubmit }) {
  const [form, setForm] = useState(toInitialState(department));

  useEffect(() => {
    if (open) {
      setForm(toInitialState(department));
    }
  }, [open, department]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      name: form.name,
      description: form.description || null,
    });
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <label className="form-field" style={{ marginBottom: '1rem' }}>
          <span className="field-label">Name</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>

        <label className="form-field full-width" style={{ marginBottom: '1.5rem' }}>
          <span className="field-label">Description</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}