import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiLogOut, FiList, FiCheckCircle, FiClock, FiAlertCircle,
  FiRefreshCw, FiUser,
} from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
const styles = `
  .agent-wrap {
    min-height: 100vh; background: #f8fafc;
    font-family: Inter, sans-serif; display: flex; flex-direction: column;
  }

  .agent-topbar {
    background: #fff; border-bottom: 1px solid #e2e8f0;
    padding: 0 16px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100; flex-shrink: 0;
  }
  @media (min-width: 640px) { .agent-topbar { padding: 0 24px; height: 64px; } }

  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 7px; flex-shrink: 0; }
  .topbar-logo-text { font-size: 16px; font-weight: 700; color: #1e293b; }
  @media (min-width: 640px) { .topbar-logo-text { font-size: 18px; } }
  .topbar-badge { background: #faf5ff; color: #7c3aed; border: 1px solid #ddd6fe; border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 600; display: none; }
  @media (min-width: 480px) { .topbar-badge { display: inline-block; } }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .topbar-name { font-size: 13px; font-weight: 600; color: #1e293b; display: none; }
  @media (min-width: 480px) { .topbar-name { display: block; } }
  .btn-logout { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .agent-main { flex: 1; padding: 20px 16px; max-width: 1000px; margin: 0 auto; width: 100%; box-sizing: border-box; }
  @media (min-width: 640px) { .agent-main { padding: 28px 24px; } }
  @media (min-width: 1024px) { .agent-main { padding: 32px 24px; } }

  .welcome-row {
    display: flex; flex-direction: column; gap: 10px;
    margin-bottom: 20px;
  }
  @media (min-width: 480px) {
    .welcome-row { flex-direction: row; align-items: center; justify-content: space-between; }
  }

  .page-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
  @media (min-width: 640px) { .page-title { font-size: 22px; } }
  .page-sub { font-size: 13px; color: #64748b; }

  .btn-refresh { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; align-self: flex-start; }

  /* Stats */
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
  @media (min-width: 640px) { .stat-grid { gap: 14px; } }

  .stat-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  @media (min-width: 640px) { .stat-card { padding: 18px; } }
  .stat-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
  .stat-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .stat-value { font-size: 22px; font-weight: 800; color: #1e293b; }
  @media (min-width: 640px) { .stat-value { font-size: 26px; } }

  /* Tickets */
  .section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }

  .tickets-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .tickets-table-wrap { overflow-x: auto; }
  .tickets-table { width: 100%; border-collapse: collapse; min-width: 500px; }
  .tickets-table th { text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .tickets-table td { padding: 13px 16px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
  .tickets-table tr:last-child td { border-bottom: none; }
  .tickets-table tr:hover td { background: #f8fafc; cursor: pointer; }

  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }

  .empty-state { text-align: center; padding: 48px 24px; color: #94a3b8; font-size: 14px; }
`;

const statusColors = {
  "New":          { bg: "#eff6ff", color: "#2563eb" },
  "Assigned":     { bg: "#fefce8", color: "#ca8a04" },
  "In Progress":  { bg: "#fff7ed", color: "#ea580c" },
  "Pending Info": { bg: "#faf5ff", color: "#7c3aed" },
  "Resolved":     { bg: "#f0fdf4", color: "#16a34a" },
  "Closed":       { bg: "#f8fafc", color: "#64748b" },
  "Escalated":    { bg: "#fef2f2", color: "#dc2626" },
};

const severityColors = {
  Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a",
};

function AgentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);

  const fetchTickets = () => {
    axios.get("http://127.0.0.1:8000/employee/tickets/", { headers: authHeaders() })
      .then(r => setTickets(r.data)).catch(() => {});
  };

  useEffect(() => { fetchTickets(); }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const open = tickets.filter(t => !["Resolved", "Closed"].includes(t.status)).length;
  const resolved = tickets.filter(t => ["Resolved", "Closed"].includes(t.status)).length;
  const escalated = tickets.filter(t => t.status === "Escalated").length;

  return (
    <>
      <style>{styles}</style>
      <div className="agent-wrap">
        <header className="agent-topbar">
          <div className="topbar-left">
            <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            borderRadius: "8px", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <RiCustomerService2Line size={18} color="#fff" />
        </div>
            <span className="topbar-logo-text">ResolveAI</span>
            <span className="topbar-badge">Agent</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-name">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}><FiLogOut size={14} /> Logout</button>
          </div>
        </header>

        <main className="agent-main">
          <div className="welcome-row">
            <div>
              <h1 className="page-title">My Tickets</h1>
              <p className="page-sub">Welcome back, {user?.name}. Here are tickets assigned to you.</p>
            </div>
            <button className="btn-refresh" onClick={fetchTickets}>
              <FiRefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#eff6ff" }}><FiList size={15} color="#3b82f6" /></div>
              <div className="stat-label">Total</div>
              <div className="stat-value">{tickets.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fff7ed" }}><FiClock size={15} color="#ea580c" /></div>
              <div className="stat-label">Open</div>
              <div className="stat-value">{open}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#f0fdf4" }}><FiCheckCircle size={15} color="#16a34a" /></div>
              <div className="stat-label">Resolved</div>
              <div className="stat-value">{resolved}</div>
            </div>
          </div>

          {escalated > 0 && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <FiAlertCircle size={16} color="#dc2626" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#dc2626" }}>
                {escalated} escalated ticket{escalated !== 1 ? "s" : ""} require your immediate attention.
              </span>
            </div>
          )}

          <p className="section-title">All Assigned Tickets</p>

          <div className="tickets-card">
            {tickets.length === 0 ? (
              <div className="empty-state">
                <FiUser size={32} style={{ marginBottom: "8px", opacity: 0.3 }} />
                <p>No tickets assigned to you yet.</p>
              </div>
            ) : (
              <div className="tickets-table-wrap">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Severity</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => {
                      const s = statusColors[t.status] || statusColors["New"];
                      return (
                        <tr key={t.id} onClick={() => navigate(`/agent/tickets/${t.id}`)}>
                          <td style={{ color: "#94a3b8", fontWeight: 600 }}>#{t.id}</td>
                          <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{t.title}</td>
                          <td><span className="badge" style={{ background: s.bg, color: s.color }}>{t.status}</span></td>
                          <td style={{ color: severityColors[t.severity], fontWeight: 600 }}>{t.severity}</td>
                          <td style={{ color: "#64748b" }}>{t.category}</td>
                          <td style={{ color: "#94a3b8" }}>{new Date(t.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AgentDashboard;