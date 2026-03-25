import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import { apiRequest } from "../lib/api";

const categories = ["Bug report", "Feature request", "Service quality", "Other"];
const experiences = ["Excellent", "Good", "Average", "Poor"];

export default function FeedbackPage() {
  const { hasAnyRole } = useAuth();
  const [form, setForm] = useState({
    category: categories[0],
    experience: experiences[1],
    contactBack: false,
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);
  const [markingId, setMarkingId] = useState(null);

  const canReviewFeedback = hasAnyRole("ADMIN", "EMPLOYEE");
  const isAdmin = hasAnyRole("ADMIN");

  async function loadFeedbackEntries() {
    if (!canReviewFeedback) return;
    try {
      setEntries(await apiRequest("/feedback"));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadFeedbackEntries(); }, [canReviewFeedback]);

  const followUpEntries = entries.filter((entry) => entry.contactBack);

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess(""); setError(""); setLoading(true);
    try {
      await apiRequest("/feedback", { method: "POST", body: form });
      setSuccess("Feedback sent successfully.");
      setForm({ category: categories[0], experience: experiences[1], contactBack: false, message: "" });
      await loadFeedbackEntries();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  async function handleMarkContacted(id) {
    setMarkingId(id);
    try {
      await apiRequest(`/feedback/${id}/contacted`, { method: "PUT" });
      await loadFeedbackEntries();
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingId(null);
    }
  }

  return (
    <section className="dashboard-layout" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="card" style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
        <PageHeader
          title="Service Feedback"
          description="We value your observations regarding platform use and municipal service quality."
        />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '0.9rem' }}>How was your experience?</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {experiences.map((exp) => (
                <label key={exp} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="radio"
                    name="experience"
                    checked={form.experience === exp}
                    onChange={() => setForm({ ...form, experience: exp })}
                    style={{ width: '14px', height: '14px', accentColor: '#007bff' }}
                  />
                  {exp}
                </label>
              ))}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
            <input
              type="checkbox"
              checked={form.contactBack}
              onChange={(e) => setForm({ ...form, contactBack: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: '#007bff' }}
            />
            <span>Request follow-up regarding this submission</span>
          </label>

          <div className="form-group">
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.9rem' }}>Your Message</label>
            <textarea
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe the issue or suggestion..."
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          {success && <p style={{ color: 'green', fontSize: '0.85rem' }}>{success}</p>}

          <button className="primary-button" type="submit" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>

      {isAdmin ? (
        <div className="card" style={{ borderRadius: '12px', overflow: 'hidden' }}>
          <PageHeader
            title="Follow-Up Requests"
            description="Users who asked to be contacted regarding submitted feedback."
          />

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Category</th>
                  <th>Experience</th>
                  <th style={{ width: '30%' }}>Message</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {followUpEntries.map((entry) => (
                  <tr key={entry.id} className="table-row">
                    <td><strong>{entry.userName}</strong></td>
                    <td>{entry.userEmail}</td>
                    <td>{entry.category}</td>
                    <td>{entry.experience}</td>
                    <td style={{ fontSize: '0.85rem', color: '#555' }}>{entry.message}</td>
                    <td className="actions-cell" style={{ textAlign: 'right' }}>
                      <button
                        className="secondary-button"
                        onClick={() => handleMarkContacted(entry.id)}
                        disabled={markingId === entry.id}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {markingId === entry.id ? "Saving..." : "Mark Contacted"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!followUpEntries.length && (
              <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No follow-up requests at the moment.</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}