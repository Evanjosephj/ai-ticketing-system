import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiGrid, FiList, FiUsers, FiBarChart2, FiLogOut,
  FiSearch, FiFilter, FiRefreshCw,
} from "react-icons/fi";

const styles = `
  .atickets-wrap {
    min-height: 100vh;
    background: #f8fafc;
    font-family: Inter, sans-serif;
    display: flex;
    flex-direction: column;
  }

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
  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo-icon {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px; flex-shrink: 0;
  }
  .topbar-logo-text { font-size: 16px; font-weight: 700; color: #1e293b; }
  @media (min-width: 640px) { .topbar-logo-text { font-size: 18px; } }
  .topbar-badge {
    background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;
    border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 600;
    display: none;
  }
  @media (min-width: 480px) { .topbar-badge { display: inline-block; } }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .topbar-name { font-size: 13px; font-weight: 600; color: #1e293b; display: none; }
  @media (min-width: 480px) { .topbar-name { display: block; } }
  .btn-logout {
    display: flex; align-items: center; gap: 5px;
    padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0;
    background: #fff; color: #64748b; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
  }

  .adash-layout { display: flex; flex: 1; }

  .adash-sidebar {
    width: 56px; background: #fff; border-right: 1px solid #e2e8f0;
    display: flex; flex-direction: column; padding: 16px 8px; gap: 4px; flex-shrink: 0;
  }
  @media (min-width: 768px) { .adash-sidebar { width: 200px; padding: 20px 12px; } }
  @media (min-width: 1024px) { .adash-sidebar { width: 220px; } }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px; cursor: pointer;
    font-size: 14px; font-weight: 500; color: #64748b;
    border: none; background: transparent; font-family: inherit;
    width: 100%; text-align: left; justify-content: center;
  }
  @media (min-width: 768px) { .nav-item { justify-content: flex-start; } }
  .nav-item:hover { background: #f1f5f9; color: #1e293b; }
  .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
  .nav-label { display: none; }
  @media (min-width: 768px) { .nav-label { display: block; } }

  .adash-main {
    flex: 1; padding: 20px 16px; overflow-x: hidden;
  }
  @media (min-width: 640px) { .adash-main { padding: 28px 24px; } }
  @media (min-width: 1024px) { .adash-main { padding: 32px 32px; } }

  .page-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  @media (min-width: 640px) { .page-title { font-size: 24px; } }
  .page-sub { font-size: 13px; color: #64748b; margin-bottom: 20px; }

  /* ── Filters ── */
  .filters-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  @media (min-width: 640px) {
    .filters-bar { flex-direction: row; flex-wrap: wrap; align-items: center; }
  }

  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
  }
  @media (min-width: 640px) {
    .search-wrap { min-width: 200px; max-width: 280px; }
  }
  .search-icon {
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%); color: #94a3b8;
    display: flex; align-items: center;
  }
  .search-input {
    width: 100%; padding: 9px 12px 9px 34px;
    border-radius: 8px; border: 1px solid #d1d5db;
    font-size: 13px; outline: none; box-sizing: border-box;
    color: #1e293b; font-family: inherit;
  }

  .filter-select {
    padding: 9px 12px; border-radius: 8px;
    border: 1px solid #d1d5db; font-size: 13px;
    outline: none; color: #1e293b; background: #fff;
    font-family: inherit; cursor: pointer;
  }

  .btn-refresh {
    display: flex; align-items: center; gap: 6px;
    padding: 9px 14px; border-radius: 8px;
    border: 1px solid #e2e8f0; background: #fff;
    color: #64748b; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    white-space: nowrap;
  }

  /* ── Table ── */
  .tickets-card {
    background: #fff; border-radius: 14px;
    border: 1px solid #e2e8f0; overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  .tickets-table-wrap { overflow-x: auto; }
  .tickets-table {
    width: 100%; border-collapse: collapse; min-width: 620px;
  }
  .tickets-table th {
    text-align: left; font-size: 11px; font-weight: 600;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;
    padding: 12px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  }
  .tickets-table td {
    padding: 13px 16px; font-size: 13px; color: #1e293b;
    border-bottom: 1px solid #f1f5f9; vertical-align: middle;
  }
  .tickets-table tr:last-child td { border-bottom: none; }
  .tickets-table tr:hover td { background: #f8fafc; cursor: pointer; }

  .badge {
    display: inline-block; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 600;
  }

  .empty-state {
    text-align: center; padding: 48px 24px;
    color: #94a3b8; font-size: 14px;
  }

  .results-count {
    font-size: 12px; color: #94a3b8; margin-bottom: 10px;
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
  Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a",
};

function AdminTickets() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");

  const fetchTickets = () => {
    const params = {};
    if (statusFilter !== "All") params.status = statusFilter;
    if (deptFilter !== "All") params.department = deptFilter;
    if (sevFilter !== "All") params.severity = sevFilter;
    if (search) params.search = search;
    axios.get("https://ai-ticketing-system-2.onrender.com/admin/tickets/", {
      headers: authHeaders(), params,
    }).then(r => setTickets(r.data)).catch(() => {});
  };

  useEffect(() => { fetchTickets(); }, [statusFilter, deptFilter, sevFilter]);

  const handleLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { icon: <FiGrid size={18} />,      label: "Dashboard",  path: "/admin" },
    { icon: <FiList size={18} />,      label: "Tickets",    path: "/admin/tickets" },
    { icon: <FiUsers size={18} />,     label: "Employees",  path: "/admin/employees" },
    { icon: <FiBarChart2 size={18} />, label: "Analytics",  path: "/admin/analytics" },
  ];

  const departments = ["All", "Engineering", "Finance", "HR", "IT", "Product", "Marketing", "Legal", "DevOps"];

  return (
    <>
      <style>{styles}</style>
      <div className="atickets-wrap">
        <header className="adash-topbar">
          <div className="topbar-left">
            <div className="topbar-logo-icon" />
            <span className="topbar-logo-text">Support Hub</span>
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

          <main className="adash-main">
            <h1 className="page-title">All Tickets</h1>
            <p className="page-sub">Search, filter and manage all support tickets.</p>

            {/* Filters */}
            <div className="filters-bar">
              <div className="search-wrap">
                <span className="search-icon"><FiSearch size={14} /></span>
                <input
                  className="search-input"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && fetchTickets()}
                />
              </div>

              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {["All","New","Assigned","In Progress","Pending Info","Resolved","Closed","Auto-Resolved","Escalated"].map(s =>
                  <option key={s}>{s}</option>
                )}
              </select>

              <select className="filter-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>

              <select className="filter-select" value={sevFilter} onChange={e => setSevFilter(e.target.value)}>
                {["All","Critical","High","Medium","Low"].map(s => <option key={s}>{s}</option>)}
              </select>

              <button className="btn-refresh" onClick={fetchTickets}>
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>

            <p className="results-count">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found</p>

            <div className="tickets-card">
              {tickets.length === 0 ? (
                <div className="empty-state">No tickets match your filters.</div>
              ) : (
                <div className="tickets-table-wrap">
                  <table className="tickets-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Severity</th>
                        <th>Department</th>
                        <th>Assigned To</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(t => {
                        const s = statusColors[t.status] || statusColors["New"];
                        return (
                          <tr key={t.id} onClick={() => navigate(`/admin/tickets/${t.id}`)}>
                            <td style={{ color: "#94a3b8", fontWeight: 600 }}>#{t.id}</td>
                            <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                              {t.title}
                            </td>
                            <td>
                              <span className="badge" style={{ background: s.bg, color: s.color }}>
                                {t.status}
                              </span>
                            </td>
                            <td style={{ color: severityColors[t.severity], fontWeight: 600 }}>{t.severity}</td>
                            <td style={{ color: "#64748b" }}>{t.department || "—"}</td>
                            <td style={{ color: "#64748b" }}>{t.assigned_to || "—"}</td>
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
      </div>
    </>
  );
}

export default AdminTickets;
