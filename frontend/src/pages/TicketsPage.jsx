import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import TicketDetailsModal from "../components/TicketDetailsModal";
import TicketFormModal from "../components/TicketFormModal";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 5;

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

function formatStatusLabel(status) {
  return status?.replaceAll("_", " ") ?? "-";
}

export default function TicketsPage() {
  const { user, hasAnyRole } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ open: false, ticket: null });
  const [detailsTarget, setDetailsTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canEdit = hasAnyRole("ADMIN", "EMPLOYEE");
  const canDelete = hasAnyRole("ADMIN");
  const isAdmin = hasAnyRole("ADMIN");
  const isEmployee = hasAnyRole("EMPLOYEE") && !isAdmin;
  const hasDepartments = departments.length > 0;

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const requests = [apiRequest("/tickets"), apiRequest("/departments")];
      if (canEdit) {
        requests.push(apiRequest("/teams"));
      }

      const [ticketData, departmentData, teamData = []] = await Promise.all(requests);
      setTickets(ticketData);
      setDepartments(departmentData);
      setTeams(teamData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [canEdit]);

  const filteredTickets = useMemo(() => {
    const employeeTeamIds = isEmployee
      ? teams
        .filter((team) => team.members?.some((member) => member.id === user?.id))
        .map((team) => team.id)
      : [];

    const sourceTickets = isEmployee
      ? tickets.filter((ticket) => employeeTeamIds.includes(ticket.assignedTeamId))
      : tickets;

    const term = search.trim().toLowerCase();
    return sourceTickets.filter((ticket) =>
      [
        ticket.title,
        ticket.status,
        ticket.departmentName,
        ticket.reporterName,
        ticket.assignedTeamName,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [isEmployee, search, teams, tickets, user?.id]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const paginatedTickets = filteredTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleCreate(payload) {
    await apiRequest("/tickets", { method: "POST", body: payload });
    setModalState({ open: false, ticket: null });
    await loadData();
  }

  async function handleUpdate(payload) {
    await apiRequest(`/tickets/${modalState.ticket.id}`, {
      method: "PUT",
      body: payload,
    });
    setModalState({ open: false, ticket: null });
    await loadData();
  }

  async function handleDelete() {
    await apiRequest(`/tickets/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    await loadData();
  }

  return (
    <section className="card">
      <PageHeader
        title="Tickets"
        description={canEdit ? "Manage reported incidents, update statuses and assign teams to tickets." : "Report incidents to the city administration by selecting the appropriate category."}
        action={
          <button
            className="primary-button"
            onClick={() => setModalState({ open: true, ticket: null })}
            disabled={!hasDepartments}
          >
            Add ticket
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by title, status, department or reporter"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading tickets...</p> : null}
      {!loading && !hasDepartments ? (
        <p className="error-text">
          No categories are configured yet, so tickets cannot be submitted at the moment.
        </p>
      ) : null}

      {!loading ? (
        <>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Reporter</th>
                  <th>Department</th>
                  <th>Assigned team</th>
                  <th>Created at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td>
                      <strong>{ticket.title}</strong>
                    </td>
                    <td>
                      <span className={`status-pill status-${ticket.status.toLowerCase()}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td>
                      {ticket.reporterName || "-"}
                    </td>
                    <td>
                      {ticket.departmentName || "-"}
                    </td>
                    <td>{ticket.assignedTeamName || "Unassigned"}</td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td className="actions-cell">
                      <button
                        className="secondary-button"
                        onClick={() => setDetailsTarget(ticket)}
                      >
                        Details
                      </button>
                      {canEdit ? (
                        <button
                          className="secondary-button"
                          onClick={() => setModalState({ open: true, ticket })}
                        >
                          Edit
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button className="danger-button" onClick={() => setDeleteTarget(ticket)}>
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <TicketFormModal
        open={modalState.open}
        title={modalState.ticket ? "Edit ticket" : "Add ticket"}
        ticket={modalState.ticket}
        departments={departments}
        teams={teams}
        canEditStatus={canEdit}
        onClose={() => setModalState({ open: false, ticket: null })}
        onSubmit={modalState.ticket ? handleUpdate : handleCreate}
      />

      <TicketDetailsModal
        open={Boolean(detailsTarget)}
        ticketId={detailsTarget?.id}
        onClose={() => setDetailsTarget(null)}
        onChanged={loadData}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete ticket"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
