import { useEffect, useState } from "react";
import axios from "axios";
import TicketCard from "../components/TicketCard";
import { TbSearch, TbInbox } from "react-icons/tb";

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/tickets/").then((res) => setTickets(res.data));
  }, []);

  const statuses = ["All", "New", "Assigned", "In Progress", "Pending Info", "Resolved", "Auto-Resolved", "Closed", "Escalated"];

  const filtered = tickets.filter((t) => {
    const matchStatus = filter === "All" || t.status === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.submitted_by.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <style>{`
        .ticket-list-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 1024px) { .ticket-list-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .ticket-list-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: "500", color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Support Hub</p>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "5px" }}>All Tickets</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{tickets.length} total · {filtered.length} shown</p>
      </div>

      {/* Search + filters */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ position: "relative", marginBottom: "14px", maxWidth: "340px" }}>
          <TbSearch size={15} color="var(--text-muted)" style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="input-field"
            style={{ paddingLeft: "36px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500",
              cursor: "pointer", fontFamily: "Space Grotesk", transition: "all 0.18s",
              border: filter === s ? "1.5px solid #185FA5" : "1.5px solid var(--border)",
              background: filter === s ? "#E6F1FB" : "#fff",
              color: filter === s ? "#185FA5" : "var(--text-secondary)",
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#E6F1FB", border: "1.5px solid #B5D4F4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <TbInbox size={24} color="#185FA5" />
          </div>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "500" }}>No tickets found</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="ticket-list-grid">
          {filtered.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;