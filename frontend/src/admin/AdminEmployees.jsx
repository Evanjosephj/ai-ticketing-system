import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, authHeaders } from "../context";
import {
  FiGrid, FiList, FiUsers, FiBarChart2, FiLogOut,
  FiPlus, FiEdit2, FiUserX, FiX, FiCheck, FiCopy,
  FiMail, FiLock, FiAlertTriangle,
} from "react-icons/fi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .aemp-wrap {
    min-height: 100vh;
    background: #f0f2f7;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
  }

  /* ── Topbar ── */
  .adash-topbar {
    background: #ffffff;
    border-bottom: 1.5px solid #e8eaf0;
    padding: 0 24px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    flex-shrink: 0;
  }
  @media (min-width: 640px) { .adash-topbar { padding: 0 32px; } }

  .topbar-left { display: flex; align-items: center; gap: 10px; }

  .topbar-logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    border-radius: 9px;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .topbar-logo-dot {
    width: 10px; height: 10px;
    background: #fff; border-radius: 50%; opacity: 0.9;
  }

  .topbar-logo-text {
    font-size: 17px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.3px;
  }

  .topbar-badge {
    background: #eef2ff;
    color: #4338ca;
    border: 1.5px solid #c7d2fe;
    border-radius: 7px;
    padding: 3px 9px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    display: none;
  }
  @media (min-width: 480px) { .topbar-badge { display: inline-block; } }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .topbar-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    flex-shrink: 0; display: none;
  }
  @media (min-width: 480px) { .topbar-avatar { display: flex; } }

  .topbar-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    display: none;
  }
  @media (min-width: 480px) { .topbar-name { display: block; } }

  .btn-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: 9px;
    border: 1.5px solid #e8eaf0;
    background: #fff;
    color: #6b7280;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s ease;
  }
  .btn-logout:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

  /* ── Layout ── */
  .adash-layout { display: flex; flex: 1; }

  /* ── Sidebar ── */
  .adash-sidebar {
    width: 60px;
    background: #ffffff;
    border-right: 1.5px solid #e8eaf0;
    display: flex;
    flex-direction: column;
    padding: 18px 10px;
    gap: 5px;
    flex-shrink: 0;
  }
  @media (min-width: 768px) { .adash-sidebar { width: 210px; padding: 22px 14px; } }
  @media (min-width: 1024px) { .adash-sidebar { width: 228px; } }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 11px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    text-align: left;
    justify-content: center;
    transition: all 0.15s ease;
    letter-spacing: -0.1px;
  }
  @media (min-width: 768px) { .nav-item { justify-content: flex-start; } }
  .nav-item:hover { background: #f3f4f6; color: #111827; }
  .nav-item.active { background: #eef2ff; color: #4338ca; font-weight: 600; }
  .nav-item.active svg { color: #4338ca; }

  .nav-label { display: none; }
  @media (min-width: 768px) { .nav-label { display: block; } }

  /* ── Main ── */
  .adash-main { flex: 1; padding: 24px 18px; overflow-x: hidden; }
  @media (min-width: 640px) { .adash-main { padding: 32px 28px; } }
  @media (min-width: 1024px) { .adash-main { padding: 36px 36px; } }

  /* ── Page header ── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 26px;
    gap: 14px;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }
  @media (min-width: 640px) { .page-title { font-size: 26px; } }

  .page-sub { font-size: 14px; color: #6b7280; font-weight: 400; }

  .btn-add {
    display: flex; align-items: center; gap: 7px;
    padding: 10px 18px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: -0.1px;
    transition: opacity 0.15s ease, transform 0.1s ease;
    box-shadow: 0 2px 8px rgba(79, 110, 247, 0.3);
  }
  .btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-add:active { transform: translateY(0); }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 26px;
  }
  @media (min-width: 640px) { .stats-row { grid-template-columns: repeat(4, 1fr); } }

  .stat-card {
    background: #fff;
    border-radius: 14px;
    border: 1.5px solid #e8eaf0;
    padding: 16px 18px;
  }
  .stat-label {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.5px;
  }
  .stat-value.green { color: #16a34a; }
  .stat-value.amber { color: #d97706; }
  .stat-value.red   { color: #dc2626; }

  /* ── Employee grid ── */
  .emp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 640px) { .emp-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1100px) { .emp-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Employee card ── */
  .emp-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #e8eaf0;
    padding: 20px;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .emp-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); transform: translateY(-2px); }

  .emp-card-top {
    display: flex; align-items: center; gap: 13px; margin-bottom: 16px;
  }

  .emp-avatar {
    width: 46px; height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff;
    flex-shrink: 0;
    letter-spacing: 0.02em;
  }

  .emp-name {
    font-size: 15.5px; font-weight: 700; color: #111827;
    letter-spacing: -0.2px; margin-bottom: 2px;
  }
  .emp-role { font-size: 12.5px; color: #6b7280; font-weight: 500; }

  .emp-details {
    display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px;
    background: #f8f9fc;
    border-radius: 10px;
    padding: 12px 14px;
  }
  .emp-detail-row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; color: #6b7280;
  }
  .emp-detail-key { font-weight: 500; }
  .emp-detail-val { font-weight: 600; color: #1f2937; }

  .avail-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .avail-dot { width: 6px; height: 6px; border-radius: 50%; }

  .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .skill-tag {
    background: #eef2ff;
    border: 1.5px solid #c7d2fe;
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 11.5px;
    color: #4338ca;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .emp-card-actions { display: flex; gap: 9px; }

  .btn-edit {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px;
    border-radius: 10px;
    border: 1.5px solid #c7d2fe;
    background: #eef2ff;
    color: #4338ca;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s ease;
  }
  .btn-edit:hover { background: #e0e7ff; border-color: #a5b4fc; }

  .btn-deactivate {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px;
    border-radius: 10px;
    border: 1.5px solid #fecaca;
    background: #fff5f5;
    color: #dc2626;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s ease;
  }
  .btn-deactivate:hover { background: #fee2e2; border-color: #fca5a5; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15, 15, 30, 0.5);
    backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 16px;
  }

  .modal-box {
    background: #fff;
    border-radius: 20px;
    width: 100%; max-width: 500px;
    max-height: 92vh;
    overflow-y: auto;
    padding: 28px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    border: 1.5px solid #e8eaf0;
  }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
  }

  .modal-title {
    font-size: 19px;
    font-weight: 700;
    color: #111827;
    letter-spacing: -0.4px;
  }

  .btn-close {
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1.5px solid #e8eaf0;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.15s ease;
  }
  .btn-close:hover { background: #f3f4f6; color: #374151; }

  .form-section-label {
    font-size: 11.5px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 12px;
    margin-top: 4px;
  }

  .form-field { margin-bottom: 14px; }

  .form-label {
    display: block;
    font-size: 13.5px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    letter-spacing: -0.1px;
  }

  .form-input {
    width: 100%;
    padding: 10px 13px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    font-size: 14px;
    outline: none;
    color: #111827;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    background: #fafbfc;
  }
  .form-input:focus {
    border-color: #4f6ef7;
    box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12);
    background: #fff;
  }
  .form-input::placeholder { color: #c0c7d0; }

  .form-select {
    width: 100%;
    padding: 10px 13px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    font-size: 14px;
    outline: none;
    color: #111827;
    background: #fafbfc;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: border-color 0.15s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }
  .form-select:focus { border-color: #4f6ef7; box-shadow: 0 0 0 3px rgba(79,110,247,0.12); background-color: #fff; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }

  .divider { height: 1.5px; background: #f0f2f7; margin: 18px 0; border-radius: 99px; }

  .error-box {
    background: #fff5f5;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13.5px;
    color: #dc2626;
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
    font-weight: 500;
  }

  .modal-footer { display: flex; gap: 10px; margin-top: 22px; }

  .btn-cancel {
    flex: 1; padding: 11px;
    border-radius: 10px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s ease;
  }
  .btn-cancel:hover { background: #f9fafb; border-color: #d1d5db; }

  .btn-save {
    flex: 2; padding: 11px;
    border-radius: 10px;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.1px;
    transition: opacity 0.15s ease;
    box-shadow: 0 2px 8px rgba(79,110,247,0.3);
  }
  .btn-save:hover { opacity: 0.9; }
  .btn-save:disabled { background: #c7d2fe; box-shadow: none; cursor: not-allowed; }

  .empty-state {
    text-align: center; padding: 64px 24px; color: #9ca3af;
    font-size: 15px; font-weight: 500;
    background: #fff; border-radius: 16px; border: 1.5px dashed #e2e8f0;
  }
  .empty-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: #f3f4f6;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }

  /* ── Credentials Modal ── */
  .cred-modal-box {
    background: #fff;
    border-radius: 20px;
    width: 100%; max-width: 440px;
    padding: 28px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    border: 1.5px solid #e8eaf0;
  }

  .cred-success-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 22px;
  }

  .cred-success-icon {
    width: 42px; height: 42px; border-radius: 50%;
    background: #f0fdf4;
    border: 2px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .cred-title { font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.3px; margin-bottom: 2px; }
  .cred-sub { font-size: 13px; color: #6b7280; font-weight: 400; }

  .cred-field {
    background: #f8f9fc;
    border: 1.5px solid #e8eaf0;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 10px;
  }

  .cred-field-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 11.5px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
  }

  .cred-field-row {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }

  .cred-value {
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: #111827;
    font-weight: 500;
    word-break: break-all;
    flex: 1;
  }

  .btn-copy {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1.5px solid #c7d2fe;
    background: #eef2ff;
    color: #4338ca;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
    transition: all 0.15s ease;
    white-space: nowrap;
  }
  .btn-copy:hover { background: #e0e7ff; border-color: #a5b4fc; }
  .btn-copy.copied { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }

  .cred-warning {
    background: #fffbeb;
    border: 1.5px solid #fde68a;
    border-radius: 10px;
    padding: 12px 14px;
    margin: 14px 0 20px;
    display: flex; align-items: flex-start; gap: 9px;
  }
  .cred-warning-text {
    font-size: 13px; color: #92400e; font-weight: 500; line-height: 1.55;
  }

  .btn-done {
    width: 100%; padding: 12px;
    border-radius: 10px;
    background: #111827;
    color: #fff;
    border: none;
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: -0.1px;
    transition: background 0.15s ease;
  }
  .btn-done:hover { background: #1f2937; }
`;

const availabilityConfig = {
  Available: { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a", border: "#bbf7d0" },
  Busy:      { bg: "#fff7ed", color: "#ea580c", dot: "#ea580c", border: "#fed7aa" },
  "On Leave":{ bg: "#fef2f2", color: "#dc2626", dot: "#dc2626", border: "#fecaca" },
};

const DEPARTMENTS = ["Engineering", "Finance", "HR", "IT", "Product", "Marketing", "Legal", "DevOps"];

function AdminEmployees() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [credentialsModal, setCredentialsModal] = useState(null);
  const [copied, setCopied] = useState({});
  const [form, setForm] = useState({
    name: "", email: "", password: "", department: "Engineering",
    role: "", skill_tags: "", availability: "Available",
  });

  const fetchEmployees = () => {
    axios.get("http://127.0.0.1:8000/admin/employees/", { headers: authHeaders() })
      .then(r => setEmployees(r.data)).catch(() => {});
  };

  useEffect(() => { fetchEmployees(); }, []);

  const openAdd = () => {
    setEditEmp(null);
    setForm({ name: "", email: "", password: "", department: "Engineering", role: "", skill_tags: "", availability: "Available" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditEmp(emp);
    setForm({ name: emp.name, email: emp.email, password: "", department: emp.department, role: emp.role, skill_tags: emp.skill_tags, availability: emp.availability });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.department || !form.role || !form.skill_tags) {
      setError("Please fill all required fields."); return;
    }
    if (!editEmp && !form.password) {
      setError("Password is required for new employees."); return;
    }
    setSaving(true);
    try {
      if (editEmp) {
        const payload = { name: form.name, email: form.email, department: form.department, role: form.role, skill_tags: form.skill_tags, availability: form.availability };
        await axios.patch(`http://127.0.0.1:8000/admin/employees/${editEmp.id}`, payload, { headers: authHeaders() });
        setShowModal(false);
      } else {
        await axios.post("http://127.0.0.1:8000/admin/employees/", form, { headers: authHeaders() });
        setShowModal(false);
        setCredentialsModal({ email: form.email, password: form.password });
      }
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
    setSaving(false);
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this employee?")) return;
    await axios.delete(`http://127.0.0.1:8000/admin/employees/${id}`, { headers: authHeaders() });
    fetchEmployees();
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
    });
  };

  const initials = (name) => name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const navItems = [
    { icon: <FiGrid size={17} />,      label: "Dashboard",  path: "/admin" },
    { icon: <FiList size={17} />,      label: "Tickets",    path: "/admin/tickets" },
    { icon: <FiUsers size={17} />,     label: "Employees",  path: "/admin/employees" },
    { icon: <FiBarChart2 size={17} />, label: "Analytics",  path: "/admin/analytics" },
  ];

  const totalEmployees = employees.length;
  const available = employees.filter(e => e.availability === "Available").length;
  const busy = employees.filter(e => e.availability === "Busy").length;
  const onLeave = employees.filter(e => e.availability === "On Leave").length;

  const userInitials = user?.name ? initials(user.name) : "A";

  return (
    <>
      <style>{styles}</style>
      <div className="aemp-wrap">

        {/* Topbar */}
        <header className="adash-topbar">
          <div className="topbar-left">
            <div className="topbar-logo-icon">
              <div className="topbar-logo-dot" />
            </div>
            <span className="topbar-logo-text">Support Hub</span>
            <span className="topbar-badge">Admin</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-avatar">{userInitials}</div>
            <span className="topbar-name">{user?.name}</span>
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <div className="adash-layout">

          {/* Sidebar */}
          <aside className="adash-sidebar">
            {navItems.map(item => (
              <button
                key={item.path}
                className={`nav-item ${window.location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="adash-main">

            {/* Page header */}
            <div className="page-header">
              <div>
                <h1 className="page-title">Employee Directory</h1>
                <p className="page-sub">Manage your support team members and their details.</p>
              </div>
              <button className="btn-add" onClick={openAdd}>
                <FiPlus size={16} /> Add Employee
              </button>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card">
                <p className="stat-label">Total</p>
                <p className="stat-value">{totalEmployees}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Available</p>
                <p className="stat-value green">{available}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Busy</p>
                <p className="stat-value amber">{busy}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">On Leave</p>
                <p className="stat-value red">{onLeave}</p>
              </div>
            </div>

            {/* Grid */}
            {employees.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FiUsers size={24} color="#d1d5db" />
                </div>
                <p style={{ fontWeight: 700, color: "#374151", fontSize: 16, marginBottom: 6 }}>No employees yet</p>
                <p>Add your first team member to get started.</p>
              </div>
            ) : (
              <div className="emp-grid">
                {employees.map(emp => {
                  const av = availabilityConfig[emp.availability] || availabilityConfig["Available"];
                  return (
                    <div key={emp.id} className="emp-card">
                      <div className="emp-card-top">
                        <div className="emp-avatar">{initials(emp.name)}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="emp-name">{emp.name}</p>
                          <p className="emp-role">{emp.role}</p>
                        </div>
                        <span className="avail-badge" style={{ background: av.bg, color: av.color, border: `1.5px solid ${av.border}` }}>
                          <span className="avail-dot" style={{ background: av.dot }} />
                          {emp.availability}
                        </span>
                      </div>

                      <div className="emp-details">
                        <div className="emp-detail-row">
                          <span className="emp-detail-key">Department</span>
                          <span className="emp-detail-val">{emp.department}</span>
                        </div>
                        <div className="emp-detail-row">
                          <span className="emp-detail-key">Open Tickets</span>
                          <span className="emp-detail-val">{emp.current_load}</span>
                        </div>
                        <div className="emp-detail-row">
                          <span className="emp-detail-key">Avg Resolution</span>
                          <span className="emp-detail-val">
                            {emp.avg_resolution_time > 0 ? `${emp.avg_resolution_time.toFixed(1)}h` : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="skill-tags">
                        {emp.skill_tags.split(",").map(tag => (
                          <span key={tag.trim()} className="skill-tag">{tag.trim()}</span>
                        ))}
                      </div>

                      <div className="emp-card-actions">
                        <button className="btn-edit" onClick={() => openEdit(emp)}>
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button className="btn-deactivate" onClick={() => handleDeactivate(emp.id)}>
                          <FiUserX size={13} /> Deactivate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">{editEmp ? "Edit Employee" : "Add New Employee"}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><FiX size={16} /></button>
            </div>

            {error && (
              <div className="error-box">
                <FiAlertTriangle size={15} style={{ flexShrink: 0 }} /> {error}
              </div>
            )}

            <p className="form-section-label">Personal Info</p>
            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Smith" />
              </div>
              <div className="form-field">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@company.com" />
              </div>
            </div>

            {!editEmp && (
              <div className="form-field">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Set login password" />
              </div>
            )}

            <div className="divider" />
            <p className="form-section-label">Work Details</p>

            <div className="form-row">
              <div className="form-field">
                <label className="form-label">Department *</label>
                <select className="form-select" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Availability</label>
                <select className="form-select" value={form.availability} onChange={e => setForm({...form, availability: e.target.value})}>
                  <option>Available</option>
                  <option>Busy</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Job Title / Role *</label>
              <input className="form-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="e.g. Backend Engineer" />
            </div>

            <div className="form-field">
              <label className="form-label">Skill Tags * <span style={{ fontWeight: 400, color: "#9ca3af" }}>(comma-separated)</span></label>
              <input className="form-input" value={form.skill_tags} onChange={e => setForm({...form, skill_tags: e.target.value})} placeholder="e.g. Database, Python, Networking" />
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editEmp ? "Save Changes" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {credentialsModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setCredentialsModal(null)}>
          <div className="cred-modal-box">

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
              <div className="cred-success-header" style={{ margin: 0 }}>
                <div className="cred-success-icon">
                  <FiCheck size={19} color="#16a34a" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="cred-title">Employee Created!</p>
                  <p className="cred-sub">Share these login credentials with the employee.</p>
                </div>
              </div>
              <button className="btn-close" onClick={() => setCredentialsModal(null)} style={{ marginLeft: 8, flexShrink: 0 }}>
                <FiX size={16} />
              </button>
            </div>

            {/* Email field */}
            <div className="cred-field">
              <div className="cred-field-label">
                <FiMail size={12} /> Login Email
              </div>
              <div className="cred-field-row">
                <span className="cred-value">{credentialsModal.email}</span>
                <button
                  className={`btn-copy ${copied.email ? "copied" : ""}`}
                  onClick={() => copyToClipboard(credentialsModal.email, "email")}
                >
                  {copied.email ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  {copied.email ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Password field */}
            <div className="cred-field">
              <div className="cred-field-label">
                <FiLock size={12} /> Password
              </div>
              <div className="cred-field-row">
                <span className="cred-value">{credentialsModal.password}</span>
                <button
                  className={`btn-copy ${copied.password ? "copied" : ""}`}
                  onClick={() => copyToClipboard(credentialsModal.password, "password")}
                >
                  {copied.password ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  {copied.password ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="cred-warning">
              <FiAlertTriangle size={15} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p className="cred-warning-text">
                This password won't be shown again after you close this dialog. Copy and share it with the employee now.
              </p>
            </div>

            <button className="btn-done" onClick={() => setCredentialsModal(null)}>
              Done, credentials shared
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminEmployees;