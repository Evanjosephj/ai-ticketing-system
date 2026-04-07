import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiGrid, FiList, FiUsers, FiBarChart2, FiLogOut,
  FiZap, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw,
} from "react-icons/fi";

const styles = `
  .aana-wrap {
    min-height: 100vh; background: #f8fafc;
    font-family: Inter, sans-serif; display: flex; flex-direction: column;
  }

  .adash-topbar {
    background: #fff; border-bottom: 1px solid #e2e8f0;
    padding: 0 16px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100; flex-shrink: 0;
  }
  @media (min-width: 640px) { .adash-topbar { padding: 0 24px; height: 64px; } }
  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 7px; flex-shrink: 0; }
  .topbar-logo-text { font-size: 16px; font-weight: 700; color: #1e293b; }
  @media (min-width: 640px) { .topbar-logo-text { font-size: 18px; } }
  .topbar-badge { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 600; display: none; }
  @media (min-width: 480px) { .topbar-badge { display: inline-block; } }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .topbar-name { font-size: 13px; font-weight: 600; color: #1e293b; display: none; }
  @media (min-width: 480px) { .topbar-name { display: block; } }
  .btn-logout { display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .adash-layout { display: flex; flex: 1; }

  .adash-sidebar { width: 56px; background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 16px 8px; gap: 4px; flex-shrink: 0; }
  @media (min-width: 768px) { .adash-sidebar { width: 200px; padding: 20px 12px; } }
  @media (min-width: 1024px) { .adash-sidebar { width: 220px; } }

  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #64748b; border: none; background: transparent; font-family: inherit; width: 100%; text-align: left; justify-content: center; }
  @media (min-width: 768px) { .nav-item { justify-content: flex-start; } }
  .nav-item:hover { background: #f1f5f9; color: #1e293b; }
  .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
  .nav-label { display: none; }
  @media (min-width: 768px) { .nav-label { display: block; } }

  .adash-main { flex: 1; padding: 20px 16px; overflow-x: hidden; }
  @media (min-width: 640px) { .adash-main { padding: 28px 24px; } }
  @media (min-width: 1024px) { .adash-main { padding: 32px 32px; } }

  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
  .page-title { font-size: 20px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
  @media (min-width: 640px) { .page-title { font-size: 24px; } }
  .page-sub { font-size: 13px; color: #64748b; }

  .btn-refresh { display: flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }

  /* ── Stats ── */
  .stat-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
  }
  @media (min-width: 640px) { .stat-grid { gap: 16px; } }
  @media (min-width: 900px) { .stat-grid { grid-template-columns: repeat(5, 1fr); } }

  .stat-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  @media (min-width: 640px) { .stat-card { padding: 18px; } }
  .stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
  .stat-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .stat-value { font-size: 24px; font-weight: 800; color: #1e293b; line-height: 1; }
  @media (min-width: 640px) { .stat-value { font-size: 28px; } }

  /* ── Charts row ── */
  .charts-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  @media (min-width: 900px) {
    .charts-row { grid-template-columns: 1fr 1fr; }
  }

  .chart-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .chart-title { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }

  /* Bar chart */
  .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .bar-label { font-size: 12px; color: #64748b; min-width: 80px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  @media (min-width: 480px) { .bar-label { min-width: 100px; } }
  .bar-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width 0.4s; }
  .bar-count { font-size: 12px; font-weight: 600; color: #374151; min-width: 20px; text-align: right; }

  /* Top categories */
  .cat-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .cat-row:last-child { border-bottom: none; }
  .cat-rank { font-size: 13px; font-weight: 700; color: #94a3b8; min-width: 24px; }
  .cat-name { font-size: 13px; font-weight: 600; color: #1e293b; flex: 1; }
  .cat-count { font-size: 12px; font-weight: 600; background: #f1f5f9; color: #374151; padding: 3px 10px; border-radius: 20px; }

  /* Resolution time */
  .dept-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .dept-row:last-child { border-bottom: none; }
  .dept-name { font-size: 13px; font-weight: 500; color: #374151; }
  .dept-time { font-size: 13px; font-weight: 700; color: #3b82f6; }

  /* Success rate */
  .rate-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  .rate-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .rate-label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .rate-value { font-size: 28px; font-weight: 800; color: #16a34a; }
  .rate-bar-track { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
  .rate-bar-fill { height: 100%; background: #22c55e; border-radius: 5px; transition: width 0.5s; }

  .empty-chart { font-size: 13px; color: #94a3b8; text-align: center; padding: 20px; }
`;

const BAR_COLORS = ["#3b82f6","#6366f1","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899"];

function AdminAnalytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios.get("http://127.0.0.1:8000/admin/analytics/", { headers: authHeaders() })
      .then(r => setData(r.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const navItems = [
    { icon: <FiGrid size={18} />,      label: "Dashboard",  path: "/admin" },
    { icon: <FiList size={18} />,      label: "Tickets",    path: "/admin/tickets" },
    { icon: <FiUsers size={18} />,     label: "Employees",  path: "/admin/employees" },
    { icon: <FiBarChart2 size={18} />, label: "Analytics",  path: "/admin/analytics" },
  ];

  const stats = data ? [
    { label: "Total",        value: data.total,         icon: <FiList size={16} color="#3b82f6" />,       bg: "#eff6ff" },
    { label: "Open",         value: data.open,          icon: <FiClock size={16} color="#ea580c" />,      bg: "#fff7ed" },
    { label: "Resolved",     value: data.resolved,      icon: <FiCheckCircle size={16} color="#16a34a" />, bg: "#f0fdf4" },
    { label: "Auto-Resolved",value: data.auto_resolved, icon: <FiZap size={16} color="#6366f1" />,        bg: "#faf5ff" },
    { label: "Escalated",    value: data.escalated,     icon: <FiAlertCircle size={16} color="#dc2626" />, bg: "#fef2f2" },
  ] : [];

  const maxDeptCount = data ? Math.max(...(data.department_load.map(d => d.count) || [1]), 1) : 1;

  return (
    <>
      <style>{styles}</style>
      <div className="aana-wrap">
        <header className="adash-topbar">
          <div className="topbar-left">
            <div className="topbar-logo-icon" />
            <span className="topbar-logo-text">Support Hub</span>
            <span className="topbar-badge">Admin</span>
          </div>
          <div className="topbar-right">
            <span className="topbar-name">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}><FiLogOut size={14} /> Logout</button>
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
            <div className="page-header">
              <div>
                <h1 className="page-title">Analytics</h1>
                <p className="page-sub">Overview of ticket performance and team workload.</p>
              </div>
              <button className="btn-refresh" onClick={fetchData}>
                <FiRefreshCw size={13} /> Refresh
              </button>
            </div>

            {!data ? (
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading analytics...</p>
            ) : (
              <>
                {/* Stats */}
                <div className="stat-grid">
                  {stats.map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* AI Success Rate */}
                <div className="rate-card" style={{ marginBottom: "16px" }}>
                  <div className="rate-top">
                    <div style={{ background: "#f0fdf4", borderRadius: "10px", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FiZap size={18} color="#16a34a" />
                    </div>
                    <div>
                      <p className="rate-label">AI Auto-Resolution Success Rate</p>
                      <p className="rate-value">{data.auto_resolution_success_rate}%</p>
                    </div>
                  </div>
                  <div className="rate-bar-track">
                    <div className="rate-bar-fill" style={{ width: `${data.auto_resolution_success_rate}%` }} />
                  </div>
                </div>

                <div className="charts-row">
                  {/* Department Load */}
                  <div className="chart-card">
                    <p className="chart-title">Department Ticket Load</p>
                    {data.department_load.length === 0 ? (
                      <p className="empty-chart">No data yet.</p>
                    ) : (
                      data.department_load.map((d, i) => (
                        <div key={d.department} className="bar-row">
                          <span className="bar-label">{d.department}</span>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(d.count / maxDeptCount) * 100}%`,
                                background: BAR_COLORS[i % BAR_COLORS.length],
                              }}
                            />
                          </div>
                          <span className="bar-count">{d.count}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Top categories this week */}
                  <div className="chart-card">
                    <p className="chart-title">Top Categories This Week</p>
                    {data.top_categories.length === 0 ? (
                      <p className="empty-chart">No tickets this week yet.</p>
                    ) : (
                      data.top_categories.map((cat, i) => (
                        <div key={cat.category} className="cat-row">
                          <span className="cat-rank">#{i + 1}</span>
                          <span className="cat-name">{cat.category}</span>
                          <span className="cat-count">{cat.count} tickets</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Avg resolution time by dept */}
                <div className="chart-card">
                  <p className="chart-title">Average Resolution Time by Department</p>
                  {data.avg_resolution_by_dept.length === 0 ? (
                    <p className="empty-chart">No resolved tickets yet.</p>
                  ) : (
                    data.avg_resolution_by_dept.map(d => (
                      <div key={d.department} className="dept-row">
                        <span className="dept-name">{d.department}</span>
                        <span className="dept-time">{d.avg_hours}h avg</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminAnalytics;