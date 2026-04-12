import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";
import { HiOutlineTicket } from "react-icons/hi2";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import { RiRobot3Line } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios.get(`https://ai-ticketing-system-2.onrender.com/tickets/${id}`).then((res) => { setTicket(res.data); setStatus(res.data.status); });
    axios.get(`https://ai-ticketing-system-2.onrender.com/tickets/${id}/timeline`).then((res) => setTimeline(res.data));
  }, [id]);

  const updateStatus = async () => {
    await axios.patch(`https://ai-ticketing-system-2.onrender.com/tickets/${id}`, { status, note });
    setNote("");
    const res = await axios.get(`https://ai-ticketing-system-2.onrender.com/tickets/${id}`);
    setTicket(res.data);
    const tl = await axios.get(`https://ai-ticketing-system-2.onrender.com/tickets/${id}/timeline`);
    setTimeline(tl.data);
  };

  const sendFeedback = async (helpful) => {
    await axios.patch(`https://ai-ticketing-system-2.onrender.com/tickets/${id}`, { helpful });
    const res = await axios.get(`https://ai-ticketing-system-2.onrender.com/tickets/${id}`);
    setTicket(res.data);
  };

  const severityColor = {
    Critical: { text: "#A32D2D", bg: "#FCEBEB", border: "#F7C1C1" },
    High:     { text: "#854F0B", bg: "#FAEEDA", border: "#FAC775" },
    Medium:   { text: "#BA7517", bg: "#FAEEDA", border: "#EF9F27" },
    Low:      { text: "#3B6D11", bg: "#EAF3DE", border: "#C0DD97" },
  };

  if (!ticket) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading ticket...</p>
    </div>
  );

  const sev = severityColor[ticket.severity] || { text: "#534AB7", bg: "#EEEDFE", border: "#CECBF6" };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <style>{`
        .detail-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
        .detail-meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
        .feedback-btns { display: flex; gap: 10px; flex-wrap: wrap; }
        @media (max-width: 600px) {
          .detail-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .detail-meta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "14px", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Space Grotesk", fontWeight: "500" }}>
        ← Back
      </button>

      {/* Main card */}
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "clamp(18px, 3vw, 32px)", marginBottom: "16px" }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "18px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#E6F1FB", border: "1.5px solid #B5D4F4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <HiOutlineTicket size={20} color="#185FA5" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px", flexWrap: "wrap" }}>
              <StatusBadge status={ticket.status} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--text-muted)" }}>{ticket.category}</span>
            </div>
            <h1 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: "600", color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "1.3" }}>{ticket.title}</h1>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.7", marginBottom: "20px", padding: "14px", background: "var(--bg-primary)", borderRadius: "10px", border: "1.5px solid var(--border)" }}>
          {ticket.description}
        </p>

        {/* Stat grid */}
        <div className="detail-stat-grid">
          {[
            { label: "Category",   value: ticket.category,               color: "var(--text-primary)", bg: "var(--bg-primary)", border: "var(--border)" },
            { label: "Severity",   value: ticket.severity,               color: sev.text, bg: sev.bg, border: sev.border },
            { label: "Sentiment",  value: ticket.sentiment,              color: "var(--text-primary)", bg: "var(--bg-primary)", border: "var(--border)" },
            { label: "Confidence", value: `${ticket.confidence_score}%`, color: "#3B6D11", bg: "#EAF3DE", border: "#C0DD97" },
          ].map((item) => (
            <div key={item.label} style={{ background: item.bg, borderRadius: "10px", padding: "14px", border: `1.5px solid ${item.border}` }}>
              <div style={{ fontSize: "10px", color: item.color, fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "5px", opacity: 0.65 }}>{item.label}</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Meta grid */}
        <div className="detail-meta-grid">
          <div style={{ background: "var(--bg-primary)", borderRadius: "10px", padding: "14px", border: "1.5px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
              <IoPerson size={12} color="var(--text-muted)" />
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Submitted By</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>{ticket.submitted_by}</div>
          </div>
          <div style={{ background: "var(--bg-primary)", borderRadius: "10px", padding: "14px", border: "1.5px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
              <LuLockKeyholeOpen size={12} color="var(--text-muted)" />
              <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Est. Resolution</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>{ticket.estimated_time}</div>
          </div>
        </div>

        {/* AI Summary */}
        {ticket.ai_summary && (
          <div style={{ background: "#E6F1FB", border: "1.5px solid #B5D4F4", borderRadius: "12px", padding: "18px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "9px" }}>
              <RiRobot3Line size={15} color="#185FA5" />
              <span style={{ fontSize: "11px", color: "#185FA5", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>AI Summary</span>
            </div>
            <p style={{ fontSize: "14px", color: "#0C447C", lineHeight: "1.7" }}>{ticket.ai_summary}</p>
          </div>
        )}

        {/* Assigned To */}
        {ticket.assigned_to && (
          <div style={{ background: "#FAEEDA", border: "1.5px solid #FAC775", borderRadius: "12px", padding: "18px", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "9px" }}>
              <IoPerson size={15} color="#854F0B" />
              <span style={{ fontSize: "11px", color: "#854F0B", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned To</span>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#633806" }}>{ticket.assigned_to}</div>
            <div style={{ fontSize: "13px", color: "#854F0B", marginTop: "3px" }}>{ticket.department}</div>
          </div>
        )}

        {/* Auto Response */}
        {ticket.auto_response && (
          <div style={{ background: "#EAF3DE", border: "1.5px solid #C0DD97", borderRadius: "12px", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "9px" }}>
              <CiCircleCheck size={16} color="#3B6D11" />
              <span style={{ fontSize: "11px", color: "#3B6D11", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Auto-Response</span>
            </div>
            <p style={{ fontSize: "14px", color: "#27500A", lineHeight: "1.7", marginBottom: "14px" }}>{ticket.auto_response}</p>
            {!ticket.helpful ? (
              <div>
                <p style={{ fontSize: "13px", color: "#3B6D11", marginBottom: "10px", fontWeight: "500" }}>Was this helpful?</p>
                <div className="feedback-btns">
                  <button onClick={() => sendFeedback("yes")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", color: "#3B6D11", border: "1.5px solid #C0DD97", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500", fontFamily: "Space Grotesk" }}>
                    <FaRegThumbsUp size={13} /> Yes, helpful
                  </button>
                  <button onClick={() => sendFeedback("no")} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#fff", color: "#A32D2D", border: "1.5px solid #F7C1C1", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500", fontFamily: "Space Grotesk" }}>
                    <FaRegThumbsDown size={13} /> Not helpful
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                {ticket.helpful === "yes" ? <FaRegThumbsUp size={13} color="#3B6D11" /> : <FaRegThumbsDown size={13} color="#A32D2D" />}
                <p style={{ fontSize: "13px", color: ticket.helpful === "yes" ? "#3B6D11" : "#A32D2D", fontWeight: "500" }}>
                  {ticket.helpful === "yes" ? "Marked as helpful" : "Marked as not helpful"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Ticket */}
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "clamp(18px, 3vw, 28px)", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "16px" }}>Update Ticket</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field" style={{ appearance: "none" }}>
            {["New","Assigned","In Progress","Pending Info","Resolved","Closed","Escalated"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note (optional)..." rows={3} className="input-field" style={{ resize: "vertical" }} />
          <button onClick={updateStatus} className="btn-primary" style={{ alignSelf: "flex-start", padding: "10px 22px" }}>
            Update Status
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "clamp(18px, 3vw, 28px)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "18px" }}>Timeline</h2>
        {timeline.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No timeline events yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {timeline.map((event, index) => (
              <div key={event.id} style={{ display: "flex", gap: "14px", paddingBottom: index < timeline.length - 1 ? "18px" : "0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0, background: "#E6F1FB", border: "1.5px solid #B5D4F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <HiOutlineTicket size={13} color="#185FA5" />
                  </div>
                  {index < timeline.length - 1 && <div style={{ width: "1px", flex: 1, background: "var(--border)", marginTop: "4px" }} />}
                </div>
                <div style={{ paddingBottom: "4px", paddingTop: "3px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "3px" }}>{event.action}</p>
                  {event.note && <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "3px" }}>{event.note}</p>}
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{new Date(event.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
