import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";

export default function ProfilePage() {
  const { user, hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole("ADMIN");

  const accountType = useMemo(() => {
    if (hasAnyRole("ADMIN")) return "Administrator Account";
    if (hasAnyRole("EMPLOYEE")) return "Operational Account";
    return "Citizen Account";
  }, [hasAnyRole]);

  return (
    <section style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <div className="card" style={{ borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <PageHeader
          title="Account Information"
          description="View your personal details and current access level."
        />

        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            <div style={{ flex: '0 0 150px' }}>
              <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Full Name
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                {user?.fullName || "Not available"}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
            <div style={{ flex: '0 0 150px' }}>
              <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
                {user?.email || "Not available"}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', paddingBottom: '16px' }}>
            <div style={{ flex: '0 0 150px' }}>
              <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Role
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <span className="status-pill status-open" style={{ fontSize: '0.85rem', padding: '4px 12px', borderRadius: '4px', display: 'inline-block' }}>
                {accountType}
              </span>
            </div>
          </div>

        </div>

        {!isAdmin ? (
          <div style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#666',
            border: '1px solid #eee',
            lineHeight: '1.5'
          }}>
            <p style={{ margin: 0 }}>
              <strong>Note:</strong> Profile information is managed by the central registry.
              To request any changes or to <strong>deactivate your account</strong>, please contact the administration team by submitting a formal ticket through the dashboard.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}