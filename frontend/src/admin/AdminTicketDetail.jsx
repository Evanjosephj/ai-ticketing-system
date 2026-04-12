import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { authHeaders } from "../context";
import {
  FiArrowLeft, FiTag, FiAlertCircle, FiClock, FiUser,
  FiMessageSquare, FiActivity, FiCheckCircle,
} from "react-icons/fi";

const styles = `
  .atd-wrap {
    min-height: 100vh;
    background: #f8fafc;
    font-family: Inter, sans-serif;
  }

  .atd-topbar {
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
  }
  @media (min-width: 640px) { .atd-topbar { padding: 0 24px; height: 64px; } }

  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo-icon {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px;
  }
  .topbar-logo-text { font-size: 16px; font-weight: 700; color: #1e293b; }
  @media (min-width: 640px) { .topbar-logo-text { font-size: 18px; } }

  .btn-back {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0;
    background: #fff; color: #64748b; font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: inherit;
  }

  .atd-content {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  @media (min-width: 640px) { .atd-content { padding: 28px 24px; gap: 20px; } }
  @media (min-width: 1024px) { .atd-content { padding: 32px 24px; } }

  .card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  }
  @media (min-width: 640px) { .card { padding: 24px; } }

  .ticket-top {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (min-width: 480px) {
    .ticket-top { flex-direction: row; justify-content: space-between; align-items: flex-start; }
  }

  .ticket-id { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .ticket-title { font-size: 18px; font-weight: 700; color: #1e293b; line-height: 1.35; margin: 0; }
  @media (min-width: 640px) { .ticket-title { font-size: 22px; } }

  .status-badge {
    display: inline-block; padding: 6px 14px;
    border-radius: 20px; font-size: 12px; font-weight: 600;
    white-space: nowrap; align-self: flex-start; flex-shrink: 0;
  }

  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (min-width: 480px) { .meta-grid { grid-template-columns: repeat(4, 1fr); } }

  .meta-cell {
    background: #f8fafc; border-radius: 10px;
    padding: 12px; border: 1px solid #e2e8f0;
  }
  .meta-label {
    display: flex; align-items: center; gap: 5px;
    color: #94a3b8; margin-bottom: 5px;
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .meta-value { font-size: 13px; font-weight: 700; color: #1e293b; }

  .section-label {
    font-size: 11px; font-weight: 600; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
  }

  .ai-summary-box {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 10px; padding: 14px;
  }
  .ai-summary-text { font-size: 14px; color: #1e40af; line-height: 1.7; margin: 0; }

  .auto-response-box {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 10px; padding: 14px;
  }
  .auto-response-text { font-size: 14px; color: #15803d; line-height: 1.8; margin: 0; }

  .assign-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
  }
  .assign-label { font-size: 12px; font-weight: 600; color: #64748b; }
  .assign-name { font-size: 16px; font-weight: 700; color: #1e293b; }
  .assign-dept { font-size: 13px; color: #64748b; }

  /* Timeline */
  .timeline-list { display: flex; flex-direction: column; gap: 14px; }
  .timeline-item { display: flex; gap: 12px; }
  .timeline-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3b82f6; margin-top: 5px; flex-shrink: 0;
  }
  .timeline-action { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
  .timeline-note { font-size: 12px; color: #64748b; margin-bottom: 2px; }
  .timeline-meta { font-size: 11px; color: #94a3b8; }

  .loading-text {
    text-align: center; padding: 80px 24px;
    color: #94a3b8; font-size: 14px; font-family: Inter, sans-serif;
  }

  .ai-tags {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;
  }
  .ai-tag {
    background: #f1f5f9; border: 1px solid #e2e8f0;
    border-radius: 6px; padding: 4px 10px;
    font-size: 12px; color: #475569; font-weight: 500;
  }
`;

const statusColors = {
  "New":          { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Assigned":     { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
  "In Progress":  { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  "Pending Info": { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
  "Resolved":     { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Closed":       { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
  "Auto-Resolved":{ bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Escalated":    { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const severityColors = {
  Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a",
};

function AdminTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    axios.get(`https://ai-ticketing-system-2.onrender.com/admin/tickets/${id}`, { headers: authHeaders() })
      .then(r => setTicket(r.data)).catch(() => {});
    axios.get(`https://ai-ticketing-system-2.onrender.com/admin/tickets/${id}/timeline`, { headers: authHeaders() })
      .then(r => setTimeline(r.data)).catch(() => {});
  }, [id]);

  if (!ticket) return <div className="loading-text" style={{ fontFamily: "Inter, sans-serif" }}>Loading ticket...</div>;

  const s = statusColors[ticket.status] || statusColors["New"];

  return (
    <>
      <style>{styles}</style>
      <div className="atd-wrap">
        <header className="atd-topbar">
          <div className="topbar-left">
            <div className="topbar-logo-icon" />
            <span className="topbar-logo-text">Support Hub</span>
          </div>
          <button className="btn-back" onClick={() => navigate("/admin/tickets")}>
            <FiArrowLeft size={14} /> Back to Tickets
          </button>
        </header>

        <div className="atd-content">

          {/* Header card */}
          <div className="card">
            <div className="ticket-top">
              <div>
                <p className="ticket-id">Ticket #{ticket.id}</p>
                <h1 className="ticket-title">{ticket.title}</h1>
              </div>
              <span
                className="status-badge"
                style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
              >
                {ticket.status}
              </span>
            </div>

            <div className="meta-grid">
              {[
                { icon: <FiTag size={12} />,         label: "Category",  value: ticket.category },
                { icon: <FiAlertCircle size={12} />, label: "Severity",  value: ticket.severity, color: severityColors[ticket.severity] },
                { icon: <FiClock size={12} />,        label: "Submitted", value: new Date(ticket.created_at).toLocaleDateString() },
                { icon: <FiUser size={12} />,         label: "Submitted By", value: ticket.submitted_by },
              ].map(item => (
                <div key={item.label} className="meta-cell">
                  <div className="meta-label">{item.icon}{item.label}</div>
                  <p className="meta-value" style={{ color: item.color || "#1e293b" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* AI tags */}
            <div className="ai-tags">
              {ticket.sentiment && (
                <span className="ai-tag">Sentiment: {ticket.sentiment}</span>
              )}
              {ticket.confidence_score && (
                <span className="ai-tag">Confidence: {ticket.confidence_score}%</span>
              )}
              {ticket.estimated_time && (
                <span className="ai-tag">Est. Time: {ticket.estimated_time}</span>
              )}
              {ticket.resolution_path && (
                <span className="ai-tag">Path: {ticket.resolution_path}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <p className="section-label">Issue Description</p>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", margin: 0 }}>
              {ticket.description}
            </p>
          </div>

          {/* AI Summary */}
          {ticket.ai_summary && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <FiMessageSquare size={15} color="#2563eb" />
                <p className="section-label" style={{ margin: 0 }}>AI Summary</p>
              </div>
              <div className="ai-summary-box">
                <p className="ai-summary-text">{ticket.ai_summary}</p>
              </div>
            </div>
          )}

          {/* Auto Response */}
          {ticket.auto_response && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <FiCheckCircle size={15} color="#16a34a" />
                <p className="section-label" style={{ margin: 0 }}>AI Auto-Response</p>
                {ticket.helpful && (
                  <span style={{
                    marginLeft: "auto", background: ticket.helpful === "yes" ? "#f0fdf4" : "#fef2f2",
                    color: ticket.helpful === "yes" ? "#16a34a" : "#dc2626",
                    border: `1px solid ${ticket.helpful === "yes" ? "#bbf7d0" : "#fecaca"}`,
                    borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600,
                  }}>
                    {ticket.helpful === "yes" ? "Helpful" : "Not Helpful"}
                  </span>
                )}
              </div>
              <div className="auto-response-box">
                <p className="auto-response-text">{ticket.auto_response}</p>
              </div>
            </div>
          )}

          {/* Assignment */}
          {ticket.assigned_to && (
            <div className="card">
              <div className="assign-row">
                <FiUser size={15} color="#6366f1" />
                <span className="assign-label">Assigned To</span>
              </div>
              <p className="assign-name">{ticket.assigned_to}</p>
              <p className="assign-dept">{ticket.department} Department</p>
              {ticket.internal_note && (
                <div style={{
                  marginTop: "12px", background: "#fafaf9",
                  border: "1px solid #e7e5e4", borderRadius: "8px", padding: "12px",
                }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Internal Note
                  </p>
                  <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>{ticket.internal_note}</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <FiActivity size={15} color="#6366f1" />
              <p className="section-label" style={{ margin: 0 }}>Ticket Timeline</p>
            </div>
            {timeline.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>No timeline events yet.</p>
            ) : (
              <div className="timeline-list">
                {timeline.map(event => (
                  <div key={event.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div>
                      <p className="timeline-action">{event.action}</p>
                      {event.note && <p className="timeline-note">{event.note}</p>}
                      <p className="timeline-meta">
                        {event.done_by} — {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminTicketDetail;
