import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import DepartmentFormModal from "../components/DepartmentFormModal";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 6;

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ open: false, department: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function loadDepartments() {
    setLoading(true);
    setError("");
    try {
      setDepartments(await apiRequest("/departments"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return departments.filter((department) =>
      [department.name, department.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [departments, search]);

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / PAGE_SIZE));
  const paginatedDepartments = filteredDepartments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleCreate(payload) {
    await apiRequest("/departments", { method: "POST", body: payload });
    setModalState({ open: false, department: null });
    await loadDepartments();
  }

  async function handleUpdate(payload) {
    await apiRequest(`/departments/${modalState.department.id}`, {
      method: "PUT",
      body: payload,
    });
    setModalState({ open: false, department: null });
    await loadDepartments();
  }

  async function handleDelete() {
    await apiRequest(`/departments/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    await loadDepartments();
  }

  return (
    <section className="card">
      <PageHeader
        title="Departments"
        description="Manage municipal service categories used for incident classification."
        action={
          <button
            className="primary-button"
            onClick={() => setModalState({ open: true, department: null })}
          >
            Add department
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by department name or description"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {loading ? <p>Loading departments...</p> : null}

      {!loading ? (
        <>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ verticalAlign: 'middle' }}>Name</th>
                  <th style={{ verticalAlign: 'middle' }}>Description</th>
                  <th style={{ verticalAlign: 'middle' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDepartments.map((department) => (
                  <tr key={department.id} className="table-row">
                    <td style={{ verticalAlign: 'middle' }}>
                      <strong>{department.name}</strong>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{department.description || "-"}</td>
                    <td className="actions-cell" style={{ verticalAlign: 'middle', display: 'table-cell' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="secondary-button"
                          onClick={() => setModalState({ open: true, department })}
                        >
                          Edit
                        </button>
                        <button className="danger-button" onClick={() => setDeleteTarget(department)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}

      <DepartmentFormModal
        open={modalState.open}
        title={modalState.department ? "Edit department" : "Add department"}
        department={modalState.department}
        onClose={() => setModalState({ open: false, department: null })}
        onSubmit={modalState.department ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete department"
        message={`Delete department "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}