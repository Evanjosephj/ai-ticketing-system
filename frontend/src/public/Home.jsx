import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSend, FiSearch, FiUser, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
const styles = `
  .home-wrapper {
    min-height: 100vh;
    background: #f8fafc;
    font-family: Inter, sans-serif;
  }

  /* ── Header ── */
  .home-header {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  @media (min-width: 640px) {
    .home-header { padding: 0 40px; height: 64px; }
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .header-logo-icon { width: 32px; height: 32px; border-radius: 8px; }
  }
  .header-logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  @media (min-width: 640px) {
    .header-logo-text { font-size: 18px; }
  }

  .header-btns {
    display: flex;
    gap: 8px;
  }
  @media (min-width: 640px) {
    .header-btns { gap: 12px; }
  }

  .btn-admin {
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    white-space: nowrap;
  }
  @media (min-width: 640px) {
    .btn-admin { padding: 8px 16px; font-size: 14px; }
  }

  .btn-agent {
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: #3b82f6;
    color: #fff;
    white-space: nowrap;
  }
  @media (min-width: 640px) {
    .btn-agent { padding: 8px 16px; font-size: 14px; }
  }

  /* ── Content ── */
  .home-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 16px;
  }
  @media (min-width: 640px) {
    .home-content { padding: 48px 24px; }
  }

  /* ── Hero ── */
  .hero {
    text-align: center;
    margin-bottom: 32px;
  }
  @media (min-width: 640px) {
    .hero { margin-bottom: 48px; }
  }
  .hero h1 {
    font-size: 28px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
    line-height: 1.2;
  }
  @media (min-width: 480px) {
    .hero h1 { font-size: 36px; letter-spacing: -1px; }
  }
  @media (min-width: 768px) {
    .hero h1 { font-size: 42px; }
  }
  .hero p {
    font-size: 15px;
    color: #64748b;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.6;
  }
  @media (min-width: 640px) {
    .hero p { font-size: 18px; }
  }

  /* ── Main grid ── */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 768px) {
    .main-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  }

  /* ── Cards ── */
  .card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 640px) {
    .card { padding: 28px; }
  }

  .card-lg {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 640px) {
    .card-lg { padding: 32px; }
  }

  /* ── Card header row ── */
  .card-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  @media (min-width: 640px) {
    .card-title { font-size: 20px; }
  }

  /* ── Form inputs ── */
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }
  .field-input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    color: #1e293b;
    font-family: inherit;
  }
  .field-textarea {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
    color: #1e293b;
    font-family: inherit;
  }
  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  @media (min-width: 640px) {
    .form-fields { gap: 16px; }
  }

  .btn-submit {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
  }
  @media (min-width: 640px) {
    .btn-submit { font-size: 15px; }
  }

  /* ── Success state ── */
  .success-box {
    text-align: center;
    padding: 24px 0;
  }
  @media (min-width: 640px) {
    .success-box { padding: 32px 0; }
  }
  .success-id-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 20px;
  }
  @media (min-width: 640px) {
    .success-id-box { padding: 20px; margin-bottom: 24px; }
  }
  .success-id {
    font-size: 30px;
    font-weight: 800;
    color: #16a34a;
  }
  @media (min-width: 640px) {
    .success-id { font-size: 36px; }
  }
  .success-btns {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* ── Track input row ── */
  .track-row {
    display: flex;
    gap: 10px;
  }
  .track-input {
    flex: 1;
    min-width: 0;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    outline: none;
    color: #1e293b;
    font-family: inherit;
  }
  .btn-track {
    padding: 10px 16px;
    border-radius: 8px;
    background: #6366f1;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
  }

  /* ── Right column ── */
  .right-col {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ── How it works steps ── */
  .step {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  @media (min-width: 640px) {
    .step { gap: 14px; }
  }
  .step-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .step-icon { width: 36px; height: 36px; }
  }
  .step-title {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 2px;
  }
  @media (min-width: 640px) {
    .step-title { font-size: 14px; }
  }
  .step-desc {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }
  @media (min-width: 640px) {
    .step-desc { font-size: 13px; }
  }
`;

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [trackId, setTrackId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    submitted_by: "",
    submitted_email: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async () => {
    if (!form.title || !form.description || !form.submitted_by) {
      alert("Please fill all required fields!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("https://ai-ticketing-system-2.onrender.com/tickets/", form);
      console.log("Full response:", res.data);
      const id = res.data?.id || res.data?.ticket_id || null;
      if (id) {
        setTicketId(id);
        setSubmitted(true);
      } else {
        alert("Ticket created but ID not found. Check console.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };
  const handleTrack = () => {
    if (!trackId) return;
    navigate(`/track/${trackId}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-wrapper">

        {/* Header */}
        <header className="home-header">
              <div className="header-logo">
        <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            borderRadius: "8px", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <RiCustomerService2Line size={18} color="#fff" />
        </div>
        <span className="header-logo-text">ResolveAI</span>
    </div>
          
        </header>

        <div className="home-content">

          {/* Hero */}
          <div className="hero">
            <h1>How can we help you?</h1>
            <p>Submit a support ticket and our AI will analyze and route it to the right team instantly.</p>
          </div>

          <div className="main-grid">

            {/* ── Submit Ticket ── */}
            <div className="card-lg">
              {!submitted ? (
                <>
                  <div className="card-heading">
                    <FiFileText size={20} color="#3b82f6" />
                    <h2 className="card-title">Submit a Ticket</h2>
                  </div>
                  <div className="form-fields">
                    <div className="field">
                      <label className="field-label">Your Name *</label>
                      <input
                        className="field-input"
                        name="submitted_by"
                        value={form.submitted_by}
                        onChange={handleChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Email (optional)</label>
                      <input
                        className="field-input"
                        name="submitted_email"
                        value={form.submitted_email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Issue Title *</label>
                      <input
                        className="field-input"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Cannot login to my account"
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Description *</label>
                      <textarea
                        className="field-textarea"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your issue in detail..."
                        rows={5}
                      />
                    </div>
                    <button
                      className="btn-submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{ background: loading ? "#93c5fd" : "#3b82f6", cursor: loading ? "not-allowed" : "pointer" }}
                    >
                      <FiSend size={16} />
                      {loading ? "AI is analyzing your ticket..." : "Submit Ticket"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="success-box">
                  <FiCheckCircle size={52} color="#22c55e" style={{ marginBottom: "14px" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                    Ticket Submitted!
                  </h3>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                    Your ticket ID is:
                  </p>
                  <div className="success-id-box">
                    <span className="success-id">#{ticketId}</span>
                    <p style={{ fontSize: "13px", color: "#15803d", marginTop: "8px", marginBottom: "12px" }}>
                    Save this ID to track your ticket status
                    </p>
                    <button
                    onClick={() => {
                        navigator.clipboard.writeText(String(ticketId));
                        alert("Ticket ID copied!");
                    }}
                    style={{
                        padding: "8px 20px", borderRadius: "8px",
                        background: "#16a34a", color: "#fff", border: "none",
                        fontSize: "13px", fontWeight: "600", cursor: "pointer",
                        fontFamily: "inherit", display: "flex", alignItems: "center",
                        gap: "6px", margin: "0 auto",
                    }}
                    >
                        Copy Ticket ID
                        </button>
                    </div>
                    <div className="success-btns">
                    <button
                      onClick={() => navigate(`/track/${ticketId}`)}
                      style={{
                        padding: "10px 24px", borderRadius: "8px", background: "#3b82f6",
                        color: "#fff", border: "none", fontSize: "14px", fontWeight: "600",
                        cursor: "pointer", width: "100%", fontFamily: "inherit",
                      }}
                    >
                      View Ticket Status
                    </button>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ title: "", description: "", submitted_by: "", submitted_email: "" }); }}
                      style={{
                        padding: "10px 24px", borderRadius: "8px", background: "#f1f5f9",
                        color: "#64748b", border: "none", fontSize: "14px", fontWeight: "500",
                        cursor: "pointer", width: "100%", fontFamily: "inherit",
                      }}
                    >
                      Submit Another Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column ── */}
            <div className="right-col">

              {/* Track Ticket */}
              <div className="card">
                <div className="card-heading">
                  <FiSearch size={20} color="#6366f1" />
                  <h2 className="card-title">Track Your Ticket</h2>
                </div>
                <div className="track-row">
                  <input
                    className="track-input"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    placeholder="Enter ticket ID e.g. 42"
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                  <button className="btn-track" onClick={handleTrack}>Track</button>
                </div>
              </div>

              {/* How it works */}
              <div className="card">
                <h2 className="card-title" style={{ marginBottom: "18px" }}>How It Works</h2>
                {[
                  { icon: <FiFileText size={17} color="#3b82f6" />,   title: "Submit Your Ticket", desc: "Describe your issue in detail" },
                  { icon: <FiCheckCircle size={17} color="#6366f1" />, title: "AI Analyzes It",      desc: "AI categorizes, prioritizes and routes instantly" },
                  { icon: <FiUser size={17} color="#22c55e" />,        title: "Expert Assigned",     desc: "Best agent assigned based on skills" },
                  { icon: <FiClock size={17} color="#f59e0b" />,       title: "Track Progress",      desc: "Follow updates using your ticket ID" },
                ].map((item, i, arr) => (
                  <div key={i} className="step" style={{ marginBottom: i < arr.length - 1 ? "14px" : 0 }}>
                    <div className="step-icon">{item.icon}</div>
                    <div>
                      <p className="step-title">{item.title}</p>
                      <p className="step-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
