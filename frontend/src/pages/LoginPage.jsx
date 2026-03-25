import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname ?? "/";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="auth-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: '0.5rem 0' }}>Sign in</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Citizen portal for reporting urban incidents</p>
          <span className="auth-badge">CityAlert</span>
        </div>

        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Email
          </label>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Password
          </label>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </div>

        {error ? <p className="error-text" style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p> : null}

        <button className="primary-button" type="submit" disabled={loading} style={{ padding: '10px', width: '100%' }}>
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="auth-footer-text" style={{ marginTop: '0.8rem', textAlign: 'center' }}>
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}