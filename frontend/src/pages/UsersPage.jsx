import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import UserRolesModal from "../components/UserRolesModal";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 6;

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleTarget, setRoleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      setUsers(await apiRequest("/users"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) =>
      [user.fullName, user.email, user.roles.join(", "), user.active ? "active" : "inactive"]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleRolesUpdate(payload) {
    await apiRequest(`/users/${roleTarget.id}/roles`, {
      method: "PUT",
      body: payload,
    });
    setRoleTarget(null);
    await loadUsers();
  }

  async function handleDeactivate() {
    await apiRequest(`/users/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    await loadUsers();
  }

  return (
    <section className="card">
      <PageHeader
        title="Users"
        description="Administer platform accounts, roles and account availability."
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name, email, role or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading users...</p> : null}

      {!loading ? (
        <>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="table-row">
                    <td>
                      <div className="table-primary-cell">
                        <strong>{user.fullName}</strong>
                        <span>{user.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <div className="status-list">
                        {user.roles.map((role) => (
                          <span key={role} className="status-pill status-open">
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${user.active ? "status-resolved" : "status-rejected"}`}>
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="actions-cell">
                      <button className="secondary-button" onClick={() => setRoleTarget(user)}>
                        Roles
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => setDeleteTarget(user)}
                        disabled={user.id === currentUser?.id || !user.active}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <UserRolesModal
        open={Boolean(roleTarget)}
        user={roleTarget}
        onClose={() => setRoleTarget(null)}
        onSubmit={handleRolesUpdate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Deactivate user"
        message={`Deactivate account ${deleteTarget?.fullName}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeactivate}
      />
    </section>
  );
}
