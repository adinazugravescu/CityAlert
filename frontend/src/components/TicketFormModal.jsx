import { useEffect, useState } from "react";
import Modal from "./Modal";

function toInitialState(ticket, departments) {
  return {
    title: ticket?.title ?? "",
    description: ticket?.description ?? "",
    departmentId: ticket?.departmentId ?? departments[0]?.id ?? "",
    assignedTeamId: ticket?.assignedTeamId ?? "",
    status: ticket?.status ?? "OPEN",
    addressText: ticket?.details?.addressText ?? "",
    imageUrl: ticket?.details?.imageUrl ?? "",
  };
}

export default function TicketFormModal({
  open,
  title,
  ticket,
  departments,
  teams = [],
  canEditStatus,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(toInitialState(ticket, departments));
  const hasDepartments = departments.length > 0;

  useEffect(() => {
    if (open) {
      setForm(toInitialState(ticket, departments));
    }
  }, [open, ticket, departments]);

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      departmentId: form.departmentId,
      details: {
        addressText: form.addressText || null,
        imageUrl: form.imageUrl || null,
      },
    };

    if (canEditStatus) {
      payload.status = form.status;
      if (form.assignedTeamId) {
        payload.assignedTeamId = form.assignedTeamId;
      }
    }

    await onSubmit(payload);
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="form-field">
          <span className="field-label">Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
        </label>
        <label className="form-field">
          <span className="field-label">Category</span>
          <select
            value={form.departmentId}
            onChange={(event) => setForm({ ...form, departmentId: event.target.value })}
            required
            disabled={!hasDepartments}
          >
            {!hasDepartments ? <option value="">No categories available</option> : null}
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
        {!hasDepartments ? (
          <p className="error-text">No incident categories are available yet. Please contact an administrator.</p>
        ) : null}
        {canEditStatus ? (
          <label className="form-field">
            <span className="field-label">Status</span>
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </label>
        ) : null}
        {canEditStatus ? (
          <label className="form-field">
            <span className="field-label">Assigned team</span>
            <select
              value={form.assignedTeamId}
              onChange={(event) => setForm({ ...form, assignedTeamId: event.target.value })}
            >
              <option value="">Unassigned</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="form-field full-width">
          <span className="field-label">Description</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
          />
        </label>
        <label className="form-field">
          <span className="field-label">Address</span>
          <input
            value={form.addressText}
            onChange={(event) => setForm({ ...form, addressText: event.target.value })}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Image URL</span>
          <input
            value={form.imageUrl}
            onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={!hasDepartments}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
