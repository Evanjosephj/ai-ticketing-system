import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TicketCard from "../components/TicketCard";
import { HiOutlineTicket } from "react-icons/hi2";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import { RiRobot3Line } from "react-icons/ri";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://ai-ticketing-system-2.onrender.com/tickets/").then((res) => setTickets(res.data));
    axios.get("https://ai-ticketing-system-2.onrender.com/analytics/").then((res) => setStats(res.data));
  }, []);

  const statCards = stats ? [
    { label: "Total Tickets", value: stats.total, icon: <HiOutlineTicket size={20} color="#185FA5" />, bg: "#E6F1FB", border: "#B5D4F4", iconBg: "#B5D4F4", valueColor: "#0C447C", labelColor: "#185FA5", sub: "All time" },
    { label: "Open", value: stats.open, icon: <LuLockKeyholeOpen size={20} color="#854F0B" />, bg: "#FAEEDA", border: "#FAC775", iconBg: "#FAC775", valueColor: "#633806", labelColor: "#854F0B", sub: "+6 today" },
    { label: "Resolved", value: stats.resolved, icon: <CiCircleCheck size={22} color="#3B6D11" />, bg: "#EAF3DE", border: "#C0DD97", iconBg: "#C0DD97", valueColor: "#27500A", labelColor: "#3B6D11", sub: "79% rate" },
    { label: "Auto-Resolved", value: stats.auto_resolved, icon: <RiRobot3Line size={20} color="#3C3489" />, bg: "#EEEDFE", border: "#CECBF6", iconBg: "#CECBF6", valueColor: "#26215C", labelColor: "#3C3489", sub: "45% of total" },
  ] : [];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
        .ticket-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media (max-width: 900px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .ticket-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: "500", color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Support Hub</p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.8px", lineHeight: "1.1", marginBottom: "6px" }}>Command Center</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>Monitor and manage all support tickets in real-time</p>
        </div>
        <button
          onClick={() => navigate("/submit")}
          style={{ background: "#185FA5", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px", fontSize: "13px", fontWeight: "500", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
        >
          + New Ticket
        </button>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="stat-grid">
          {statCards.map((s) => (
            <div key={s.label}
              style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: "14px", padding: "20px 18px", transition: "transform 0.18s", cursor: "default" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                {s.icon}
              </div>
              <div style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: "500", color: s.valueColor, letterSpacing: "-2px", lineHeight: "1", marginBottom: "5px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", fontWeight: "500", color: s.labelColor, letterSpacing: "0.04em", textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontSize: "11px", color: s.labelColor, opacity: 0.75, marginTop: "5px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "17px", fontWeight: "500", color: "var(--text-primary)" }}>Recent Tickets</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>Showing latest 6 of {stats?.open ?? "..."} open tickets</p>
        </div>
        <button onClick={() => navigate("/tickets")} style={{ background: "transparent", border: "1.5px solid var(--border)", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: "500", cursor: "pointer", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          View All →
        </button>
      </div>

      {/* Tickets */}
      {tickets.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#E6F1FB", border: "1.5px solid #B5D4F4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <HiOutlineTicket size={24} color="#185FA5" />
          </div>
          <p style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: "500" }}>No tickets yet</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>Submit your first ticket to get started</p>
        </div>
      ) : (
        <div className="ticket-grid">
          {tickets.slice(0, 6).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
