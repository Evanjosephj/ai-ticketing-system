import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiRobot3Line } from "react-icons/ri";

function SubmitTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", submitted_by: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.submitted_by) {
      alert("Please fill all fields!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("https://ai-ticketing-system-2.onrender.com/tickets/", form);
      if (res.data && res.data.id) navigate(`/tickets/${res.data.id}`);
      else navigate("/tickets");
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: "500", color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Support Hub</p>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "6px" }}>Submit a Ticket</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Describe your issue and our AI will analyze and route it instantly</p>
      </div>

      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "clamp(20px, 4vw, 32px)" }}>

        {[
          { name: "submitted_by", label: "Your Name", placeholder: "e.g. John Doe", type: "input" },
          { name: "title", label: "Ticket Title", placeholder: "e.g. Cannot login to my account", type: "input" },
          { name: "description", label: "Description", placeholder: "Describe your issue in detail...", type: "textarea" },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea name={field.name} value={form[field.name]} onChange={handleChange}
                placeholder={field.placeholder} rows={5} className="input-field" style={{ resize: "vertical" }} />
            ) : (
              <input name={field.name} value={form[field.name]} onChange={handleChange}
                placeholder={field.placeholder} className="input-field" />
            )}
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading} className="btn-primary"
          style={{ width: "100%", padding: "13px", fontSize: "15px", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {loading ? <><RiRobot3Line size={16} /> AI is analyzing your ticket...</> : "Submit Ticket →"}
        </button>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>
            This may take a few seconds...
          </p>
        )}

        <div style={{ marginTop: "20px", padding: "14px 16px", background: "#E6F1FB", borderRadius: "10px", border: "1.5px solid #B5D4F4", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <RiRobot3Line size={16} color="#185FA5" style={{ flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "13px", color: "#0C447C", lineHeight: "1.6" }}>
            <strong>AI Analysis:</strong> Your ticket will be automatically categorized, prioritized, and routed to the right team member based on skills and availability.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubmitTicket;
