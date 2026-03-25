import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";

function toInitialState(team) {
  return {
    name: team?.name ?? "",
    contactEmail: team?.contactEmail ?? "",
    memberIds: team?.members?.map((member) => member.id) ?? [],
  };
}

export default function TeamFormModal({
  open,
  title,
  team,
  users = [],
  canManageMembers = false,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(toInitialState(team));
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (open) {
      setForm(toInitialState(team));
      setSearchTerm("");
    }
  }, [open, team]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return users.filter(u =>
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({
      name: form.name,
      contactEmail: form.contactEmail || null,
      memberIds: form.memberIds,
    });
  }

  function toggleMember(userId) {
    setForm((current) => ({
      ...current,
      memberIds: current.memberIds.includes(userId)
        ? current.memberIds.filter((value) => value !== userId)
        : [...current.memberIds, userId],
    }));
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <label className="form-field">
          <span className="field-label">Team name</span>
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </label>
        <label className="form-field">
          <span className="field-label">Contact email</span>
          <input
            type="email"
            value={form.contactEmail}
            onChange={(event) => setForm({ ...form, contactEmail: event.target.value })}
          />
        </label>

        {canManageMembers ? (
          <div className="form-field full-width" style={{ marginTop: '10px' }}>
            <span className="field-label" style={{ marginBottom: '8px', display: 'block' }}>Members Selection</span>

            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', fontSize: '0.85rem',
                borderRadius: '6px', border: '1px solid #ddd', marginBottom: '8px'
              }}
            />

            <div style={{
              maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee',
              borderRadius: '6px', backgroundColor: '#fff'
            }}>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <label key={user.id} style={{
                  display: 'flex', alignItems: 'center', padding: '10px',
                  borderBottom: '1px solid #f9f9f9', cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={form.memberIds.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    style={{ width: '16px', height: '16px', marginRight: '12px', accentColor: '#007bff' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#333' }}>{user.fullName}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</span>
                  </div>
                </label>
              )) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                  No users found.
                </div>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '6px' }}>
              Selected: {form.memberIds.length} members
            </p>
          </div>
        ) : null}

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