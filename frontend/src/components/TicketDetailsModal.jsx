import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiRequest } from "../lib/api";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "./Modal";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "-";
}

function formatStatusLabel(status) {
  return status?.replaceAll("_", " ") ?? "-";
}

export default function TicketDetailsModal({ open, ticketId, onClose, onChanged }) {
  const { user, hasAnyRole } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [commentMessage, setCommentMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isPrivileged = hasAnyRole("ADMIN", "EMPLOYEE");

  const currentComment = useMemo(
    () => ticket?.comments?.find((comment) => comment.id === editingCommentId) ?? null,
    [ticket, editingCommentId],
  );

  useEffect(() => {
    if (!open || !ticketId) {
      return;
    }

    let mounted = true;

    async function loadTicket() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest(`/tickets/${ticketId}`);
        if (mounted) {
          setTicket(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTicket();
    return () => {
      mounted = false;
    };
  }, [open, ticketId]);

  useEffect(() => {
    if (currentComment) {
      setCommentMessage(currentComment.message);
    } else {
      setCommentMessage("");
    }
  }, [currentComment]);

  async function refreshTicket() {
    const data = await apiRequest(`/tickets/${ticketId}`);
    setTicket(data);
    await onChanged?.();
  }

  async function handleCommentSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (editingCommentId) {
        await apiRequest(`/tickets/${ticketId}/comments/${editingCommentId}`, {
          method: "PUT",
          body: { message: commentMessage },
        });
      } else {
        await apiRequest(`/tickets/${ticketId}/comments`, {
          method: "POST",
          body: { message: commentMessage },
        });
      }

      setCommentMessage("");
      setEditingCommentId(null);
      await refreshTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment() {
    if (!deleteTarget) {
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await apiRequest(`/tickets/${ticketId}/comments/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setDeleteTarget(null);
      await refreshTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function canManageComment(comment) {
    return isPrivileged || comment.authorId === user?.id;
  }

  return (
    <>
      <Modal open={open} title={ticket ? `Ticket details: ${ticket.title}` : "Ticket details"} onClose={onClose}>
        {loading ? <p>Loading ticket...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {ticket ? (
          <div className="ticket-details-layout">
            <div className="ticket-details-summary-grid">
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Status</span>
                <span className={`status-pill status-${ticket.status.toLowerCase()}`}>
                  {formatStatusLabel(ticket.status)}
                </span>
              </div>
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Department</span>
                <strong>{ticket.departmentName || "-"}</strong>
              </div>
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Assigned team</span>
                <strong>{ticket.assignedTeamName || "Unassigned"}</strong>
              </div>
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Created at</span>
                <strong>{formatDate(ticket.createdAt)}</strong>
              </div>
            </div>

            <div className="card-section">
              <span className="field-label">Description</span>
              <p>{ticket.description}</p>
            </div>

            <div className="ticket-details-grid">
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Address</span>
                <strong>{ticket.details?.addressText || "-"}</strong>
              </div>
              <div className="profile-field ticket-meta-card">
                <span className="field-label">Image URL</span>
                <strong>{ticket.details?.imageUrl || "-"}</strong>
              </div>
            </div>

            <div className="card-section">
              <div className="card-heading">
                <div>
                  <span className="section-eyebrow">Comments</span>
                  <h3>Ticket updates</h3>
                </div>
              </div>

              <div className="summary-list">
                {(ticket.comments ?? []).map((comment) => (
                  <div key={comment.id} className="summary-list-item">
                    <div className="comment-block">
                      <strong>{comment.authorName}</strong>
                      <p>{comment.message}</p>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    {canManageComment(comment) ? (
                      <div className="actions-cell">
                        <button
                          className="secondary-button"
                          onClick={() => setEditingCommentId(comment.id)}
                          disabled={submitting}
                        >
                          Edit
                        </button>
                        <button
                          className="danger-button"
                          onClick={() => setDeleteTarget(comment)}
                          disabled={submitting}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
                {!ticket.comments?.length ? <p>No comments added yet.</p> : null}
              </div>

              <form className="form-grid top-spaced" onSubmit={handleCommentSubmit}>
                <label className="form-field full-width">
                  <span className="field-label">
                    {editingCommentId ? "Edit comment" : "Add comment"}
                  </span>
                  <textarea
                    rows="4"
                    value={commentMessage}
                    onChange={(event) => setCommentMessage(event.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  {editingCommentId ? (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setEditingCommentId(null);
                        setCommentMessage("");
                      }}
                    >
                      Cancel edit
                    </button>
                  ) : null}
                  <button type="submit" className="primary-button" disabled={submitting}>
                    {submitting ? "Saving..." : editingCommentId ? "Update comment" : "Post comment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete comment"
        message="This comment will be permanently removed from the ticket history."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteComment}
      />
    </>
  );
}
