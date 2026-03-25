import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiRequest } from "../lib/api";

export default function DashboardPage() {
  const { user, hasAnyRole } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [teams, setTeams] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canSeeBackoffice = hasAnyRole("ADMIN", "EMPLOYEE");
  const isAdmin = hasAnyRole("ADMIN");
  const isEmployee = hasAnyRole("EMPLOYEE") && !isAdmin;

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const requests = [apiRequest("/tickets")];
        if (canSeeBackoffice) {
          requests.push(apiRequest("/teams"));
        }
        if (isAdmin) {
          requests.push(apiRequest("/feedback"));
        }

        const [ticketData, teamData = [], feedbackData = []] = await Promise.all(requests);
        if (!mounted) {
          return;
        }

        setTickets(ticketData);
        setTeams(teamData);
        setFeedback(feedbackData);
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

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [canSeeBackoffice, isAdmin]);

  const employeeTeamIds = useMemo(() => {
    if (!isEmployee || !user?.id) {
      return [];
    }

    return teams
      .filter((team) => team.members?.some((member) => member.id === user.id))
      .map((team) => team.id);
  }, [isEmployee, teams, user?.id]);

  const visibleTickets = useMemo(() => {
    if (isAdmin) {
      return tickets;
    }
    if (isEmployee) {
      return tickets.filter((ticket) => employeeTeamIds.includes(ticket.assignedTeamId));
    }
    return tickets;
  }, [employeeTeamIds, isAdmin, isEmployee, tickets]);

  const stats = useMemo(() => {
    const resolvedCount = visibleTickets.filter((ticket) => ticket.status === "RESOLVED").length;
    const openCount = visibleTickets.filter((ticket) => ticket.status === "OPEN").length;
    const inProgressCount = visibleTickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;

    return [
      {
        label: canSeeBackoffice ? "Total tickets" : "My tickets",
        value: visibleTickets.length,
      },
      {
        label: "Open tickets",
        value: openCount,
      },
      {
        label: "Resolved tickets",
        value: resolvedCount,
      },
      {
        label: canSeeBackoffice ? "Intervention teams" : "In progress",
        value: isAdmin ? teams.length : isEmployee ? employeeTeamIds.length : inProgressCount,
      },
    ];
  }, [canSeeBackoffice, employeeTeamIds.length, isAdmin, isEmployee, teams.length, visibleTickets]);

  const latestTicket = visibleTickets[0] ?? null;
  const dashboardHighlights = useMemo(() => {
    const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTeamName).length;
    const followUpFeedback = feedback.filter((entry) => entry.contactBack).length;
    const inProgressCount = tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;

    if (isAdmin) {
      return [
        {
          title: "Tickets awaiting team assignment",
          description: "Reported incidents that still need an operational team.",
          value: `${unassignedTickets}`,
        },
        {
          title: "Active field interventions",
          description: "Tickets currently marked as in progress.",
          value: `${inProgressCount}`,
        },
        {
          title: "Feedback requiring follow-up",
          description: "Submissions where the sender requested to be contacted.",
          value: `${followUpFeedback}`,
        },
      ];
    }
    return [];
  }, [feedback, isAdmin, tickets]);

  return (
    <section className="dashboard-layout">
      <div className="card dashboard-hero">
        <div>
          <h2>Welcome, {user?.fullName}</h2>
          <p>
            Monitor incident reports, follow their status and keep the urban maintenance workflow
            organized from one place.
          </p>
        </div>
        <div className="hero-highlight">
          <span>{canSeeBackoffice ? "Operations panel" : "Citizen portal"}</span>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <span className="section-eyebrow">{stat.label}</span>
            <strong>{loading ? "..." : stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-heading">
          <div>
            <span className="section-eyebrow">Recent activity</span>
            <h3>Latest tickets</h3>
          </div>
        </div>
        {loading ? (
          <p>Loading dashboard...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="summary-list">
            {latestTicket ? (
              <div key={latestTicket.id} className="summary-list-item">
                <div>
                  <strong>{latestTicket.title}</strong>
                  <p>{latestTicket.departmentName}</p>
                </div>
                <span className={`status-pill status-${latestTicket.status.toLowerCase()}`}>
                  {latestTicket.status}
                </span>
              </div>
            ) : (
              <p>No tickets available yet.</p>
            )}
          </div>
        )}
      </div>

      {isAdmin ? (
        <div className="card">
          <div className="card-heading">
            <div>
              <span className="section-eyebrow">Current priorities</span>
              <h3>Operational focus</h3>
            </div>
          </div>
          <div className="summary-list">
            {dashboardHighlights.map((item) => (
              <div key={item.title} className="summary-list-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span>{loading ? "..." : item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
