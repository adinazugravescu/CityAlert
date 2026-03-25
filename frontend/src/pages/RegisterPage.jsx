import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate("/");
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
          <span className="auth-badge">CityAlert</span>
          <h2 style={{ margin: '0.5rem 0' }}>Create account</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>Register to report urban incidents.</p>
        </div>

        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            First and Last name
          </label>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Email
          </label>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
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
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            minLength={8}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '0.8rem' }}>
          <label className="field-label" style={{ display: 'block', marginBottom: '2px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Confirm password
          </label>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
            minLength={8}
          />
        </div>

        {error ? <p className="error-text" style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p> : null}

        <button className="primary-button" type="submit" disabled={loading} style={{ padding: '10px', width: '100%' }}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer-text" style={{ marginTop: '0.8rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}