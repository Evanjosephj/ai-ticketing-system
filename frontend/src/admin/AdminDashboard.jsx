import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiGrid, FiList, FiUsers, FiBarChart2, FiLogOut,
  FiAlertCircle, FiCheckCircle, FiClock, FiZap, FiTrendingUp,
} from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";

const styles = `
  .adash-wrap {
    min-height: 100vh;
    background: #f8fafc;
    font-family: Inter, sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── Topbar ── */
  .adash-topbar {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .adash-topbar { padding: 0 24px; height: 64px; }
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .topbar-logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px;
    flex-shrink: 0;
  }
  .topbar-logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  @media (min-width: 640px) {
    .topbar-logo-text { font-size: 18px; }
  }
  .topbar-badge {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    display: none;
  }
  @media (min-width: 480px) {
    .topbar-badge { display: inline-block; }
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .topbar-name {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    display: none;
  }
  @media (min-width: 480px) {
    .topbar-name { display: block; }
  }
  .btn-logout {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }

  /* ── Layout ── */
  .adash-layout {
    display: flex;
    flex: 1;
  }

  /* ── Sidebar ── */
  .adash-sidebar {
    width: 56px;
    background: #fff;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    padding: 16px 8px;
    gap: 4px;
    flex-shrink: 0;
  }
  @media (min-width: 768px) {
    .adash-sidebar { width: 200px; padding: 20px 12px; }
  }
  @media (min-width: 1024px) {
    .adash-sidebar { width: 220px; }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    border: none;
    background: transparent;
    font-family: inherit;
    width: 100%;
    text-align: left;
    justify-content: center;
  }
  @media (min-width: 768px) {
    .nav-item { justify-content: flex-start; }
  }
  .nav-item:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
  .nav-item.active {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 600;
  }
  .nav-label {
    display: none;
  }
  @media (min-width: 768px) {
    .nav-label { display: block; }
  }

  /* ── Main ── */
  .adash-main {
    flex: 1;
    padding: 20px 16px;
    overflow-x: hidden;
  }
  @media (min-width: 640px) {
    .adash-main { padding: 28px 24px; }
  }
  @media (min-width: 1024px) {
    .adash-main { padding: 32px 32px; }
  }

  .page-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
  }
  @media (min-width: 640px) {
    .page-title { font-size: 24px; }
  }
  .page-sub {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 24px;
  }

  /* ── Stat cards ── */
  .stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }
  @media (min-width: 640px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  }
  @media (min-width: 900px) {
    .stat-grid { grid-template-columns: repeat(4, 1fr); }
  }

  .stat-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 640px) {
    .stat-card { padding: 20px; }
  }
  .stat-icon-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .stat-value {
    font-size: 26px;
    font-weight: 800;
    color: #1e293b;
    line-height: 1;
  }
  @media (min-width: 640px) {
    .stat-value { font-size: 30px; }
  }

  /* ── Recent tickets table ── */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  .btn-view-all {
    font-size: 13px;
    font-weight: 600;
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
  }

  .tickets-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }

  .tickets-table-wrap {
    overflow-x: auto;
  }
  .tickets-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
  }
  .tickets-table th {
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 16px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  .tickets-table td {
    padding: 13px 16px;
    font-size: 13px;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  .tickets-table tr:last-child td {
    border-bottom: none;
  }
  .tickets-table tr:hover td {
    background: #f8fafc;
    cursor: pointer;
  }

  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }

  .empty-state {
    text-align: center;
    padding: 48px 24px;
    color: #94a3b8;
    font-size: 14px;
  }
`;

const statusColors = {
  "New":          { bg: "#eff6ff", color: "#2563eb" },
  "Assigned":     { bg: "#fefce8", color: "#ca8a04" },
  "In Progress":  { bg: "#fff7ed", color: "#ea580c" },
  "Pending Info": { bg: "#faf5ff", color: "#7c3aed" },
  "Resolved":     { bg: "#f0fdf4", color: "#16a34a" },
  "Closed":       { bg: "#f8fafc", color: "#64748b" },
  "Auto-Resolved":{ bg: "#f0fdf4", color: "#16a34a" },
  "Escalated":    { bg: "#fef2f2", color: "#dc2626" },
};

const severityColors = {
  Critical: "#dc2626",
  High:     "#ea580c",
  Medium:   "#ca8a04",
  Low:      "#16a34a",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get("https://ai-ticketing-system-2.onrender.com/admin/tickets/", { headers: authHeaders() })
      .then(r => setTickets(r.data))
      .catch(() => {});
    axios.get("https://ai-ticketing-system-2.onrender.com/admin/analytics/", { headers: authHeaders() })
      .then(r => setAnalytics(r.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const stats = [
    { label: "Total Tickets",   value: analytics?.total ?? 0,         icon: <FiList size={18} color="#3b82f6" />,     bg: "#eff6ff" },
    { label: "Open",            value: analytics?.open ?? 0,           icon: <FiClock size={18} color="#ea580c" />,    bg: "#fff7ed" },
    { label: "Auto-Resolved",   value: analytics?.auto_resolved ?? 0,  icon: <FiZap size={18} color="#16a34a" />,      bg: "#f0fdf4" },
    { label: "Escalated",       value: analytics?.escalated ?? 0,      icon: <FiAlertCircle size={18} color="#dc2626" />, bg: "#fef2f2" },
  ];

  const navItems = [
    { icon: <FiGrid size={18} />,     label: "Dashboard",  path: "/admin" },
    { icon: <FiList size={18} />,     label: "Tickets",    path: "/admin/tickets" },
    { icon: <FiUsers size={18} />,    label: "Employees",  path: "/admin/employees" },
    { icon: <FiBarChart2 size={18} />,label: "Analytics",  path: "/admin/analytics" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="adash-wrap">

        {/* Topbar */}
        <header className="adash-topbar">
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
            <span className="topbar-badge">Admin</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-name">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <div className="adash-layout">
          {/* Sidebar */}
          <aside className="adash-sidebar">
            {navItems.map(item => (
              <button
                key={item.path}
                className={`nav-item ${window.location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="adash-main">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Welcome back, {user?.name}. Here's what's happening today.</p>

            {/* Stats */}
            <div className="stat-grid">
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-icon-row">
                    <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                  </div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recent Tickets */}
            <div className="section-header">
              <span className="section-title">Recent Tickets</span>
              <button className="btn-view-all" onClick={() => navigate("/admin/tickets")}>
                View all
              </button>
            </div>

            <div className="tickets-card">
              {tickets.length === 0 ? (
                <div className="empty-state">No tickets yet.</div>
              ) : (
                <div className="tickets-table-wrap">
                  <table className="tickets-table">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Severity</th>
                        <th>Assigned To</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.slice(0, 10).map(t => {
                        const s = statusColors[t.status] || statusColors["New"];
                        return (
                          <tr key={t.id} onClick={() => navigate(`/admin/tickets/${t.id}`)}>
                            <td style={{ color: "#94a3b8", fontWeight: 600 }}>#{t.id}</td>
                            <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                              {t.title}
                            </td>
                            <td>
                              <span className="badge" style={{ background: s.bg, color: s.color }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ color: severityColors[t.severity] || "#1e293b", fontWeight: 600 }}>
                              {t.severity}
                            </td>
                            <td style={{ color: "#64748b" }}>{t.assigned_to || "—"}</td>
                            <td style={{ color: "#94a3b8" }}>
                              {new Date(t.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Auto-resolution rate */}
            {analytics && (
              <div style={{
                marginTop: "20px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FiTrendingUp size={20} color="#16a34a" />
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>
                    AI Auto-Resolution Success Rate
                  </p>
                  <p style={{ fontSize: "22px", fontWeight: 800, color: "#16a34a" }}>
                    {analytics.auto_resolution_success_rate}%
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/analytics")}
                  style={{
                    marginLeft: "auto", padding: "8px 16px", borderRadius: "8px",
                    background: "#f1f5f9", color: "#3b82f6", border: "none",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Full Analytics
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
