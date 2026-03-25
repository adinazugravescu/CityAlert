import { useEffect, useState } from "react";
import Modal from "./Modal";

const ROLE_OPTIONS = ["CITIZEN", "EMPLOYEE", "ADMIN"];

function toInitialState(user) {
  return {
    roles: user?.roles ?? [],
  };
}

export default function UserRolesModal({ open, user, onClose, onSubmit }) {
  const [form, setForm] = useState(toInitialState(user));
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(toInitialState(user));
      setError("");
    }
  }, [open, user]);

  function toggleRole(role) {
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((value) => value !== role)
        : [...current.roles, role],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.roles.length) {
      setError("Select at least one role.");
      return;
    }
    await onSubmit({ roles: form.roles });
  }

  return (
    <Modal open={open} title={`Update roles for ${user?.fullName ?? ""}`} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-field full-width">
          <span className="field-label" style={{ marginBottom: '12px', display: 'block' }}>Assigned Roles</span>

          <div style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}>
            {ROLE_OPTIONS.map((role) => (
              <label key={role} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #f5f5f5',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>
                <input
                  type="checkbox"
                  checked={form.roles.includes(role)}
                  onChange={() => toggleRole(role)}
                  style={{
                    width: '18px',
                    height: '18px',
                    marginRight: '12px',
                    accentColor: '#007bff',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <strong style={{
                    fontSize: '0.95rem',
                    color: form.roles.includes(role) ? '#007bff' : '#333'
                  }}>
                    {role}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    {role === 'ADMIN' ? 'Full system access' : role === 'EMPLOYEE' ? 'Operational & ticket management' : 'Standard reporting access'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="error-text" style={{ marginTop: '8px' }}>{error}</p> : null}

        <div className="modal-actions" style={{ marginTop: '1rem' }}>
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