import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import TeamFormModal from "../components/TeamFormModal";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 5;

export default function TeamsPage() {
  const { user: currentUser, hasAnyRole } = useAuth();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ open: false, team: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdmin = hasAnyRole("ADMIN");

  async function loadTeams() {
    setLoading(true);
    setError("");
    try {
      const requests = [apiRequest("/teams")];
      if (isAdmin) {
        requests.push(apiRequest("/users"));
      }

      const [teamData, userData = []] = await Promise.all(requests);
      setTeams(teamData);
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, [isAdmin]);

  const filteredTeams = useMemo(() => {
    const term = search.trim().toLowerCase();
    return teams.filter((team) =>
      [
        team.name,
        team.contactEmail,
        String(team.members.length),
        team.members.map((member) => member.fullName).join(", "),
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [teams, search]);

  const assignableUsers = useMemo(() => {
    const mergedUsers = [...users];

    if (
      currentUser &&
      !mergedUsers.some((user) => user.id === currentUser.id) &&
      (currentUser.roles?.includes("ADMIN") || currentUser.roles?.includes("EMPLOYEE"))
    ) {
      mergedUsers.push({
        ...currentUser,
        active: true,
      });
    }

    return mergedUsers.filter(
      (user) =>
        user.active !== false &&
        (user.roles?.includes("EMPLOYEE") || user.roles?.includes("ADMIN")),
    );
  }, [currentUser, users]);

  const totalPages = Math.max(1, Math.ceil(filteredTeams.length / PAGE_SIZE));
  const paginatedTeams = filteredTeams.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleCreate(payload) {
    await apiRequest("/teams", { method: "POST", body: payload });
    setModalState({ open: false, team: null });
    await loadTeams();
  }

  async function handleUpdate(payload) {
    await apiRequest(`/teams/${modalState.team.id}`, {
      method: "PUT",
      body: payload,
    });
    setModalState({ open: false, team: null });
    await loadTeams();
  }

  async function handleDelete() {
    await apiRequest(`/teams/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    await loadTeams();
  }

  return (
    <section className="card">
      <PageHeader
        title="Intervention Teams"
        description="Manage intervention units, contact points and staffing visibility."
        action={
          <button className="primary-button" onClick={() => setModalState({ open: true, team: null })}>
            Add team
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by team name, email or members"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading teams...</p> : null}

      {!loading ? (
        <>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact email</th>
                  <th>Members count</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="table-row">
                    <td>
                      <strong>{team.name}</strong>
                    </td>
                    <td>{team.contactEmail || "-"}</td>
                    <td>{team.members.length}</td>
                    <td>{team.members.map((member) => member.fullName).join(", ") || "-"}</td>
                    <td className="actions-cell">
                      <button
                        className="secondary-button"
                        onClick={() => setModalState({ open: true, team })}
                      >
                        Edit
                      </button>
                      <button className="danger-button" onClick={() => setDeleteTarget(team)}>
                        Delete
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

      <TeamFormModal
        open={modalState.open}
        title={modalState.team ? "Edit team" : "Add team"}
        team={modalState.team}
        users={assignableUsers}
        canManageMembers={isAdmin}
        onClose={() => setModalState({ open: false, team: null })}
        onSubmit={modalState.team ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete team"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
