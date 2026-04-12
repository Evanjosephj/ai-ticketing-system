import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { HiOutlineTicket } from "react-icons/hi2";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import { RiRobot3Line } from "react-icons/ri";
import { TbAlertTriangle } from "react-icons/tb";

function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("https://ai-ticketing-system-2.onrender.com/analytics/").then((res) => setStats(res.data));
  }, []);

  const COLORS = ["#185FA5", "#534AB7", "#3B6D11", "#854F0B", "#A32D2D"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "10px 14px" }}>
          <p style={{ color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", marginBottom: "2px" }}>{label}</p>
          <p style={{ color: "#185FA5", fontSize: "13px" }}>{payload[0].value} tickets</p>
        </div>
      );
    }
    return null;
  };

  if (!stats) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading analytics...</p>
    </div>
  );

  const statCards = [
    { label: "Total",         value: stats.total,         icon: <HiOutlineTicket size={20} color="#185FA5" />, bg: "#E6F1FB", border: "#B5D4F4", iconBg: "#B5D4F4", valueColor: "#0C447C",  labelColor: "#185FA5" },
    { label: "Open",          value: stats.open,          icon: <LuLockKeyholeOpen size={20} color="#854F0B" />, bg: "#FAEEDA", border: "#FAC775", iconBg: "#FAC775", valueColor: "#633806",  labelColor: "#854F0B" },
    { label: "Resolved",      value: stats.resolved,      icon: <CiCircleCheck size={22} color="#3B6D11" />, bg: "#EAF3DE", border: "#C0DD97", iconBg: "#C0DD97", valueColor: "#27500A",  labelColor: "#3B6D11" },
    { label: "Auto-Resolved", value: stats.auto_resolved, icon: <RiRobot3Line size={20} color="#3C3489" />, bg: "#EEEDFE", border: "#CECBF6", iconBg: "#CECBF6", valueColor: "#26215C",  labelColor: "#3C3489" },
    { label: "Escalated",     value: stats.escalated,     icon: <TbAlertTriangle size={20} color="#A32D2D" />, bg: "#FCEBEB", border: "#F7C1C1", iconBg: "#F7C1C1", valueColor: "#791F1F",  labelColor: "#A32D2D" },
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <style>{`
        .analytics-stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
        .analytics-chart-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 1024px) { .analytics-stat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 700px)  { .analytics-stat-grid { grid-template-columns: repeat(2, 1fr); } .analytics-chart-grid { grid-template-columns: 1fr; } }
        @media (max-width: 400px)  { .analytics-stat-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: "500", color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Insights</p>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "5px" }}>Analytics</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Real-time performance metrics and insights</p>
      </div>

      {/* Stat cards */}
      <div className="analytics-stat-grid">
        {statCards.map((s) => (
          <div key={s.label}
            style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "14px", padding: "18px 16px", transition: "transform 0.18s", cursor: "default" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
              {s.icon}
            </div>
            <div style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: "500", color: s.valueColor, letterSpacing: "-1.5px", lineHeight: "1", marginBottom: "4px" }}>{s.value}</div>
            <div style={{ fontSize: "11px", fontWeight: "600", color: s.labelColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Auto-Resolution Rate */}
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "3px" }}>Auto-Resolution Success Rate</h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Based on user feedback</p>
          </div>
          <div style={{ background: "#EAF3DE", border: "1.5px solid #C0DD97", borderRadius: "10px", padding: "7px 14px" }}>
            <span style={{ fontSize: "24px", fontWeight: "500", color: "#27500A", letterSpacing: "-1px" }}>{stats.auto_resolution_success_rate}%</span>
          </div>
        </div>
        <div style={{ background: "var(--bg-primary)", borderRadius: "8px", height: "10px", overflow: "hidden", border: "1.5px solid var(--border)" }}>
          <div style={{ width: `${stats.auto_resolution_success_rate}%`, height: "100%", background: "#3B6D11", borderRadius: "8px", transition: "width 1s ease" }} />
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-chart-grid">
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>Department Load</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Tickets per department</p>
          {stats.department_load.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.department_load}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="department" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#185FA5" />
                    <stop offset="100%" stopColor="#534AB7" />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "4px" }}>Top Ticket Categories</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Distribution by category</p>
          {stats.top_categories.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={stats.top_categories} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={75} innerRadius={35}>
                  {stats.top_categories.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "10px", color: "var(--text-primary)", fontSize: "13px" }} />
                <Legend formatter={(value) => <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
