import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft, FiClock, FiUser, FiTag,
  FiAlertCircle, FiCheckCircle, FiMessageSquare,
  FiActivity,
} from "react-icons/fi";

const styles = `
  .track-wrapper {
    min-height: 100vh;
    background: #f8fafc;
    font-family: Inter, sans-serif;
  }

  /* ── Header ── */
  .track-header {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  @media (min-width: 640px) {
    .track-header { padding: 0 40px; height: 64px; }
  }

  .track-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .track-logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .track-logo-icon { width: 32px; height: 32px; border-radius: 8px; }
  }
  .track-logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  @media (min-width: 640px) {
    .track-logo-text { font-size: 18px; }
  }

  .back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  @media (min-width: 640px) {
    .back-btn { padding: 8px 16px; font-size: 14px; }
  }

  /* ── Content area ── */
  .track-content {
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  @media (min-width: 640px) {
    .track-content { padding: 32px 24px; }
  }
  @media (min-width: 1024px) {
    .track-content { padding: 40px 24px; }
  }

  /* ── Cards ── */
  .card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 640px) {
    .card { padding: 28px; margin-bottom: 20px; }
  }

  /* ── Ticket header card ── */
  .ticket-top {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (min-width: 480px) {
    .ticket-top {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
  }

  .ticket-id {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .ticket-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.35;
    margin: 0;
  }
  @media (min-width: 640px) {
    .ticket-title { font-size: 22px; }
  }

  .status-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    align-self: flex-start;
    flex-shrink: 0;
  }

  /* ── Meta grid ── */
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (min-width: 480px) {
    .meta-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .meta-cell {
    background: #f8fafc;
    border-radius: 10px;
    padding: 12px;
    border: 1px solid #e2e8f0;
  }
  .meta-label {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #94a3b8;
    margin-bottom: 5px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .meta-value {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }
  @media (min-width: 640px) {
    .meta-cell { padding: 14px; }
    .meta-value { font-size: 15px; }
  }

  /* ── AI Summary ── */
  .ai-summary {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) {
    .ai-summary { padding: 20px; margin-bottom: 20px; }
  }
  .ai-summary-label {
    font-size: 11px;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 7px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .ai-summary-text {
    font-size: 14px;
    color: #1e40af;
    line-height: 1.75;
    margin: 0;
  }
  @media (min-width: 640px) {
    .ai-summary-text { font-size: 15px; }
  }

  /* ── Assignment ── */
  .assign-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
  }
  .assign-name {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin-top: 4px;
  }
  @media (min-width: 640px) {
    .assign-name { font-size: 17px; }
  }
  .assign-dept {
    font-size: 13px;
    color: #64748b;
  }

  /* ── Auto response ── */
  .auto-response {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 16px;
  }
  @media (min-width: 640px) {
    .auto-response { padding: 24px; margin-bottom: 20px; }
  }
  .auto-response-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .auto-response-tag {
    font-size: 11px;
    font-weight: 600;
    color: #16a34a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .auto-response-text {
    font-size: 14px;
    color: #15803d;
    line-height: 1.8;
    margin-bottom: 18px;
  }
  @media (min-width: 640px) {
    .auto-response-text { font-size: 15px; }
  }

  .feedback-question {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .feedback-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .btn-helpful {
    padding: 8px 16px;
    border-radius: 8px;
    background: #22c55e;
    color: #fff;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .btn-not-helpful {
    padding: 8px 16px;
    border-radius: 8px;
    background: #ef4444;
    color: #fff;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .feedback-thanks {
    font-size: 13px;
    color: #16a34a;
    font-weight: 500;
  }

  /* ── Notification ── */
  .notification {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .notification p {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }

  /* ── Status History / Timeline ── */
  .timeline-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 640px) {
    .timeline-card { padding: 28px; margin-bottom: 20px; }
  }
  .timeline-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }
  .timeline-title {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .timeline-list {
    position: relative;
    padding-left: 28px;
  }
  .timeline-list::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: #e2e8f0;
    border-radius: 2px;
  }
  .timeline-item {
    position: relative;
    margin-bottom: 20px;
  }
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  .timeline-dot {
    position: absolute;
    left: -24px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 0 2px #e2e8f0;
    background: #94a3b8;
    z-index: 1;
  }
  .timeline-dot.active {
    background: #3b82f6;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
  .timeline-dot.resolved {
    background: #22c55e;
    box-shadow: 0 0 0 2px #bbf7d0;
  }
  .timeline-dot.escalated {
    background: #ef4444;
    box-shadow: 0 0 0 2px #fecaca;
  }
  .timeline-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .timeline-status-pill {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .timeline-by {
    font-size: 12px;
    color: #64748b;
  }
  .timeline-time {
    font-size: 11px;
    color: #94a3b8;
    margin-left: auto;
  }
  .timeline-note {
    font-size: 13px;
    color: #374151;
    line-height: 1.65;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 14px;
    margin-top: 8px;
  }

  /* ── Loading / Not found ── */
  .state-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    flex-direction: column;
    gap: 14px;
    padding: 24px;
    text-align: center;
  }
`;

function TrackTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    axios
      .get(`https://ai-ticketing-system-2.onrender.com/tickets/track/${id}`)
      .then((res) => { setTicket(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const sendFeedback = async (helpful) => {
    await axios.patch(`https://ai-ticketing-system-2.onrender.com/tickets/${id}/feedback`, { helpful });
    setFeedback(helpful);
  };

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
    Critical: "#dc2626",
    High:     "#ea580c",
    Medium:   "#ca8a04",
    Low:      "#16a34a",
  };

  // Dot color class based on status
  const getDotClass = (status) => {
    if (!status) return "";
    const s = status.toLowerCase();
    if (s === "resolved" || s === "auto-resolved" || s === "closed") return "resolved";
    if (s === "escalated") return "escalated";
    if (s === "in progress" || s === "assigned") return "active";
    return "";
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="state-screen">
        <p style={{ color: "#64748b", fontSize: "16px" }}>Loading ticket...</p>
      </div>
    </>
  );

  if (!ticket) return (
    <>
      <style>{styles}</style>
      <div className="state-screen">
        <FiAlertCircle size={48} color="#ef4444" />
        <p style={{ color: "#1e293b", fontSize: "18px", fontWeight: "600", margin: 0 }}>Ticket not found</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px", borderRadius: "8px", background: "#3b82f6",
            color: "#fff", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "14px",
          }}
        >
          Go Back
        </button>
      </div>
    </>
  );

  const s = statusColors[ticket.status] || statusColors["New"];

  // status_history: array of { status, note, updated_by, updated_at }
  const history = ticket.status_history || [];

  return (
    <>
      <style>{styles}</style>
      <div className="track-wrapper">

        {/* Header */}
        <header className="track-header">
          <div className="track-logo">
            <div className="track-logo-icon" />
            <span className="track-logo-text">ResolveAI</span>
          </div>
          <button className="back-btn" onClick={() => navigate("/")}>
            <FiArrowLeft size={15} /> Back to Home
          </button>
        </header>

        <div className="track-content">

          {/* Ticket header card */}
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
                { icon: <FiTag size={12} />,          label: "Category", value: ticket.category },
                { icon: <FiAlertCircle size={12} />,  label: "Severity",  value: ticket.severity, color: severityColors[ticket.severity] },
                { icon: <FiClock size={12} />,         label: "Submitted", value: new Date(ticket.created_at).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className="meta-cell">
                  <div className="meta-label">{item.icon}{item.label}</div>
                  <p className="meta-value" style={{ color: item.color || "#1e293b" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {ticket.ai_summary && (
            <div className="ai-summary">
              <p className="ai-summary-label">AI Summary</p>
              <p className="ai-summary-text">{ticket.ai_summary}</p>
            </div>
          )}

          {/* Assignment */}
          {ticket.assigned_to && (
            <div className="card">
              <div className="assign-row">
                <FiUser size={15} color="#6366f1" />
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", margin: 0 }}>Assigned To</p>
              </div>
              <p className="assign-name">{ticket.assigned_to}</p>
              <p className="assign-dept">{ticket.department} Department</p>
            </div>
          )}

          {/* ── STATUS HISTORY TIMELINE ── */}
          {history.length > 0 && (
            <div className="timeline-card">
              <div className="timeline-header">
                <FiActivity size={15} color="#6366f1" />
                <span className="timeline-title">Status Updates</span>
              </div>
              <div className="timeline-list">
                {history.map((entry, idx) => {
                  const sc = statusColors[entry.status] || statusColors["New"];
                  return (
                    <div key={idx} className="timeline-item">
                      <div className={`timeline-dot ${getDotClass(entry.status)}`} />
                      <div className="timeline-meta">
                        <span
                          className="timeline-status-pill"
                          style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                        >
                          {entry.status}
                        </span>
                        {entry.updated_by && (
                          <span className="timeline-by">by {entry.updated_by}</span>
                        )}
                        {entry.updated_at && (
                          <span className="timeline-time">
                            {new Date(entry.updated_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {entry.note && (
                        <div className="timeline-note">{entry.note}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Auto Response */}
          {ticket.auto_response && (
            <div className="auto-response">
              <div className="auto-response-label">
                <FiMessageSquare size={15} color="#16a34a" />
                <span className="auto-response-tag">AI Response</span>
              </div>
              <p className="auto-response-text">{ticket.auto_response}</p>

              {!ticket.helpful && !feedback ? (
                <div>
                  <p className="feedback-question">Was this helpful?</p>
                  <div className="feedback-btns">
                    <button className="btn-helpful" onClick={() => sendFeedback("yes")}>
                      <FiCheckCircle size={14} /> Yes, helpful
                    </button>
                    <button className="btn-not-helpful" onClick={() => sendFeedback("no")}>
                      Not helpful
                    </button>
                  </div>
                </div>
              ) : (
                <p className="feedback-thanks">
                  {(ticket.helpful === "yes" || feedback === "yes")
                    ? "You rated this as helpful."
                    : "Thank you for your feedback."}
                </p>
              )}
            </div>
          )}

          {/* Notification */}
          {ticket.notification && (
            <div className="notification">
              <p>{ticket.notification}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default TrackTicket;
