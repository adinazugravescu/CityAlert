import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function linkClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function Layout() {
  const { user, logout, hasAnyRole } = useAuth();
  const canManageTeams = hasAnyRole("ADMIN", "EMPLOYEE");
  const isAdmin = hasAnyRole("ADMIN");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>CityAlert</h1>
        </div>
        <div className="topbar-user">
          <div className="topbar-user-meta">
            <strong>{user?.fullName}</strong>
            <span>Connected</span>
          </div>
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="navbar">
        <NavLink to="/" end className={linkClassName}>
          Dashboard
        </NavLink>
        <NavLink to="/tickets" className={linkClassName}>
          Tickets
        </NavLink>
        {canManageTeams ? (
          <NavLink to="/teams" className={linkClassName}>
            Teams
          </NavLink>
        ) : null}
        {isAdmin ? (
          <NavLink to="/departments" className={linkClassName}>
            Departments
          </NavLink>
        ) : null}
        {isAdmin ? (
          <NavLink to="/users" className={linkClassName}>
            Users
          </NavLink>
        ) : null}
        <NavLink to="/feedback" className={linkClassName}>
          Feedback
        </NavLink>
        <NavLink to="/profile" className={linkClassName}>
          Profile
        </NavLink>
      </nav>

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
