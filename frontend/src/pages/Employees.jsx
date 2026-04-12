import { useEffect, useState } from "react";
import axios from "axios";
import { IoPerson } from "react-icons/io5";
import { TbUserPlus, TbX } from "react-icons/tb";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", role: "", skill_tags: "", availability: "Available" });

  const fetchEmployees = () => {
    axios.get("https://ai-ticketing-system-2.onrender.com/employees/").then((res) => setEmployees(res.data));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.department || !form.role || !form.skill_tags) {
      alert("Please fill all fields!");
      return;
    }
    await axios.post("https://ai-ticketing-system-2.onrender.com/employees/", form);
    setForm({ name: "", email: "", department: "", role: "", skill_tags: "", availability: "Available" });
    setShowForm(false);
    fetchEmployees();
  };

  const deactivate = async (id) => {
    if (window.confirm("Deactivate this employee?")) {
      await axios.delete(`https://ai-ticketing-system-2.onrender.com/employees/${id}`);
      fetchEmployees();
    }
  };

  const availabilityStyle = {
    Available:  { bg: "#EAF3DE", color: "#3B6D11", border: "#C0DD97" },
    Busy:       { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
    "On Leave": { bg: "#FCEBEB", color: "#A32D2D", border: "#F7C1C1" },
  };

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px" }} className="animate-fade-in">

      <style>{`
        .emp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .emp-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 18px; }
        @media (max-width: 900px) { .emp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .emp-grid { grid-template-columns: 1fr; } .emp-form-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "11px", fontWeight: "500", color: "#185FA5", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "6px" }}>Support Hub</p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: "500", color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: "5px" }}>Employee Directory</h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{employees.length} active agents across all departments</p>
        </div>
        <button className="btn-primary"
          onClick={() => setShowForm(!showForm)}
          style={{ display: "flex", alignItems: "center", gap: "7px", flexShrink: 0 }}>
          {showForm ? <><TbX size={15} /> Cancel</> : <><TbUserPlus size={15} /> Add Employee</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: "#fff", border: "1.5px solid #B5D4F4", borderRadius: "16px", padding: "clamp(18px, 3vw, 28px)", marginBottom: "24px" }} className="animate-fade-in">
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)", marginBottom: "18px" }}>Add New Employee</h2>
          <div className="emp-form-grid">
            {[
              { name: "name",       placeholder: "Full Name" },
              { name: "email",      placeholder: "Email Address" },
              { name: "department", placeholder: "Department (e.g. Engineering)" },
              { name: "role",       placeholder: "Role (e.g. Backend Developer)" },
              { name: "skill_tags", placeholder: "Skills (e.g. Database, Python)" },
            ].map((field) => (
              <input key={field.name} name={field.name} value={form[field.name]}
                onChange={handleChange} placeholder={field.placeholder} className="input-field" />
            ))}
            <select name="availability" value={form.availability} onChange={handleChange}
              className="input-field" style={{ appearance: "none" }}>
              <option>Available</option>
              <option>Busy</option>
              <option>On Leave</option>
            </select>
          </div>
          <button onClick={handleSubmit} className="btn-primary">Save Employee</button>
        </div>
      )}

      {/* Empty state */}
      {employees.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#E6F1FB", border: "1.5px solid #B5D4F4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <IoPerson size={24} color="#185FA5" />
          </div>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", fontWeight: "500" }}>No employees yet</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>Add your first team member to get started</p>
        </div>
      ) : (
        <div className="emp-grid">
          {employees.map((emp) => {
            const avStyle = availabilityStyle[emp.availability] || availabilityStyle["Available"];
            const initials = emp.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={emp.id}
                style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "22px", transition: "all 0.18s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#85B7EB"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", color: "#fff", flexShrink: 0 }}>
                    {initials}
                  </div>
                  <span style={{ background: avStyle.bg, color: avStyle.color, border: `1px solid ${avStyle.border}`, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "500" }}>
                    {emp.availability}
                  </span>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "500", color: "var(--text-primary)", marginBottom: "3px" }}>{emp.name}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "3px" }}>{emp.role}</p>
                <p style={{ fontSize: "13px", color: "#185FA5", marginBottom: "3px", fontWeight: "500" }}>{emp.department}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>{emp.email}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
                  {emp.skill_tags.split(",").map((skill, i) => (
                    <span key={i} className="tag" style={{ fontSize: "11px" }}>{skill.trim()}</span>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>{emp.current_load} open tickets</span>
                  <button onClick={() => deactivate(emp.id)} style={{ background: "#FCEBEB", color: "#A32D2D", border: "1px solid #F7C1C1", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "500", fontFamily: "Space Grotesk" }}>
                    Deactivate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Employees;
