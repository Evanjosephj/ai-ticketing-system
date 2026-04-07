import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiArrowLeft, FiTag, FiAlertCircle, FiClock, FiUser,
  FiMessageSquare, FiActivity, FiEdit2, FiCheck,
} from "react-icons/fi";

const styles = `
  .agt-wrap {
    min-height: 100vh; background: #f8fafc;
    font-family: Inter, sans-serif;
  }

  .agt-topbar {
    background: #fff; border-bottom: 1px solid #e2e8f0;
    padding: 0 16px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }
  @media (min-width: 640px) { .agt-topbar { padding: 0 24px; height: 64px; } }

  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo-icon { width: 28px; height: 28px; background: linear-gradient(135deg, #3b82f6, #6366f1); border-radius: 7px; }
  .topbar-logo-text { font-size: 16px; font-weight: 700; color: #1e293b; }
  @media (min-width: 640px) { .topbar-logo-text { font-size: 18px; } }

  .btn-back { display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; }

  .agt-content { max-width: 860px; margin: 0 auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }
  @media (min-width: 640px) { .agt-content { padding: 28px 24px; gap: 20px; } }

  .card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
  @media (min-width: 640px) { .card { padding: 24px; } }

  .ticket-top { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
  @media (min-width: 480px) { .ticket-top { flex-direction: row; justify-content: space-between; align-items: flex-start; } }

  .ticket-id { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .ticket-title { font-size: 18px; font-weight: 700; color: #1e293b; line-height: 1.35; margin: 0; }
  @media (min-width: 640px) { .ticket-title { font-size: 20px; } }

  .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; align-self: flex-start; flex-shrink: 0; }

  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (min-width: 480px) { .meta-grid { grid-template-columns: repeat(4, 1fr); } }

  .meta-cell { background: #f8fafc; border-radius: 10px; padding: 12px; border: 1px solid #e2e8f0; }
  .meta-label { display: flex; align-items: center; gap: 5px; color: #94a3b8; margin-bottom: 5px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .meta-value { font-size: 13px; font-weight: 700; color: #1e293b; }

  .section-label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

  .ai-summary-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; }
  .ai-summary-text { font-size: 14px; color: #1e40af; line-height: 1.7; margin: 0; }

  /* Update form */
  .update-form { display: flex; flex-direction: column; gap: 14px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 5px; }
  .form-select { width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 14px; outline: none; color: #1e293b; background: #fff; font-family: inherit; cursor: pointer; }
  .form-select:focus { border-color: #6366f1; }
  .form-textarea { width: 100%; padding: 9px 12px; border-radius: 8px; border: 1px solid #d1d5db; font-size: 14px; outline: none; box-sizing: border-box; resize: vertical; color: #1e293b; font-family: inherit; }
  .form-textarea:focus { border-color: #6366f1; }

  .update-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-update { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; background: #6366f1; color: #fff; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
  .btn-update:disabled { background: #a5b4fc; cursor: not-allowed; }
  .btn-note { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; background: #f1f5f9; color: #374151; border: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }

  .success-bar { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #16a34a; font-weight: 500; display: flex; align-items: center; gap: 6px; }

  /* Timeline */
  .timeline-list { display: flex; flex-direction: column; gap: 14px; }
  .timeline-item { display: flex; gap: 12px; }
  .timeline-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; margin-top: 5px; flex-shrink: 0; }
  .timeline-action { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
  .timeline-note { font-size: 12px; color: #64748b; margin-bottom: 2px; }
  .timeline-meta { font-size: 11px; color: #94a3b8; }

  .loading-text { text-align: center; padding: 80px 24px; color: #94a3b8; font-size: 14px; font-family: Inter, sans-serif; }
`;

const statusColors = {
  "New":          { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "Assigned":     { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
  "In Progress":  { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  "Pending Info": { bg: "#faf5ff", color: "#7c3aed", border: "#ddd6fe" },
  "Resolved":     { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  "Closed":       { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" },
  "Escalated":    { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const severityColors = {
  Critical: "#dc2626", High: "#ea580c", Medium: "#ca8a04", Low: "#16a34a",
};

function AgentTicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchAll = () => {
    axios.get(`http://127.0.0.1:8000/employee/tickets/`, { headers: authHeaders() })
      .then(r => {
        const t = r.data.find(t => t.id === parseInt(id));
        if (t) { setTicket(t); setStatus(t.status); }
      }).catch(() => {});
    axios.get(`http://127.0.0.1:8000/employee/tickets/${id}/timeline`, { headers: authHeaders() })
      .then(r => setTimeline(r.data)).catch(() => {});
  };

  useEffect(() => { fetchAll(); }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/employee/tickets/${id}`, { status, note }, { headers: authHeaders() });
      setSuccess("Status updated successfully.");
      setNote("");
      fetchAll();
    } catch { setSuccess(""); }
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleNoteOnly = async () => {
    if (!internalNote.trim()) return;
    setSaving(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/employee/tickets/${id}`, { internal_note: internalNote }, { headers: authHeaders() });
      setSuccess("Note saved.");
      setInternalNote("");
      fetchAll();
    } catch { setSuccess(""); }
    setSaving(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  if (!ticket) return <div className="loading-text">Loading ticket...</div>;

  const s = statusColors[ticket.status] || statusColors["New"];
  const isResolved = ["Resolved", "Closed"].includes(ticket.status);

  return (
    <>
      <style>{styles}</style>
      <div className="agt-wrap">
        <header className="agt-topbar">
          <div className="topbar-left">
            <div className="topbar-logo-icon" />
            <span className="topbar-logo-text">Support Hub</span>
          </div>
          <button className="btn-back" onClick={() => navigate("/agent")}>
            <FiArrowLeft size={14} /> My Tickets
          </button>
        </header>

        <div className="agt-content">

          {/* Header */}
          <div className="card">
            <div className="ticket-top">
              <div>
                <p className="ticket-id">Ticket #{ticket.id}</p>
                <h1 className="ticket-title">{ticket.title}</h1>
              </div>
              <span className="status-badge" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                {ticket.status}
              </span>
            </div>

            <div className="meta-grid">
              {[
                { icon: <FiTag size={12} />,         label: "Category",     value: ticket.category },
                { icon: <FiAlertCircle size={12} />, label: "Severity",     value: ticket.severity, color: severityColors[ticket.severity] },
                { icon: <FiClock size={12} />,        label: "Submitted",    value: new Date(ticket.created_at).toLocaleDateString() },
                { icon: <FiUser size={12} />,         label: "Submitted By", value: ticket.submitted_by },
              ].map(item => (
                <div key={item.label} className="meta-cell">
                  <div className="meta-label">{item.icon}{item.label}</div>
                  <p className="meta-value" style={{ color: item.color || "#1e293b" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {(ticket.sentiment || ticket.estimated_time) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                {ticket.sentiment && <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: "#475569" }}>Sentiment: {ticket.sentiment}</span>}
                {ticket.estimated_time && <span style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", color: "#475569" }}>Est. Time: {ticket.estimated_time}</span>}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <p className="section-label">Issue Description</p>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", margin: 0 }}>{ticket.description}</p>
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

          {/* Internal Note display */}
          {ticket.internal_note && (
            <div className="card">
              <p className="section-label">Internal Note</p>
              <div style={{ background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: "8px", padding: "12px" }}>
                <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>{ticket.internal_note}</p>
              </div>
            </div>
          )}

          {/* Update Ticket — only if not resolved */}
          {!isResolved && (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <FiEdit2 size={15} color="#6366f1" />
                <p className="section-label" style={{ margin: 0 }}>Update Ticket</p>
              </div>

              {success && (
                <div className="success-bar" style={{ marginBottom: "14px" }}>
                  <FiCheck size={14} /> {success}
                </div>
              )}

              <div className="update-form">
                <div>
                  <label className="form-label">Update Status</label>
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    {["New","Assigned","In Progress","Pending Info","Resolved","Closed"].map(s =>
                      <option key={s}>{s}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label">Status Note (visible to user)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                  />
                </div>

                <div className="update-actions">
                  <button className="btn-update" onClick={handleUpdate} disabled={saving}>
                    <FiCheck size={14} />
                    {saving ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Internal note */}
              <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "20px", paddingTop: "20px" }}>
                <label className="form-label">Add Internal Note (private)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={internalNote}
                  onChange={e => setInternalNote(e.target.value)}
                  placeholder="Internal notes — not visible to the user..."
                  style={{ marginBottom: "10px" }}
                />
                <button className="btn-note" onClick={handleNoteOnly} disabled={saving || !internalNote.trim()}>
                  <FiMessageSquare size={13} /> Save Note
                </button>
              </div>
            </div>
          )}

          {isResolved && (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <FiCheck size={16} color="#16a34a" />
              <p style={{ fontSize: "14px", color: "#15803d", fontWeight: 600, margin: 0 }}>
                This ticket has been {ticket.status.toLowerCase()}. No further updates needed.
              </p>
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
                      <p className="timeline-meta">{event.done_by} — {new Date(event.created_at).toLocaleString()}</p>
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

export default AgentTicketDetail;