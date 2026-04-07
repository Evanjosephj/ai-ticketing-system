import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useEffect } from "react";
import { RiCustomerService2Line } from "react-icons/ri";

const styles = `
  .login-page {
    min-height: 100vh;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    font-family: Inter, sans-serif;
  }

  .login-header {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 16px;
    height: 56px;
    display: flex;
    align-items: center;
  }
  @media (min-width: 640px) {
    .login-header { padding: 0 40px; height: 64px; }
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .login-logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-radius: 7px;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    .login-logo-icon { width: 32px; height: 32px; border-radius: 8px; }
  }
  .login-logo-text {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
  }
  @media (min-width: 640px) {
    .login-logo-text { font-size: 18px; }
  }

  .login-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  .login-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    padding: 28px 24px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 480px) {
    .login-card { padding: 36px 32px; }
  }

  .login-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .login-title {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 6px;
  }
  @media (min-width: 480px) {
    .login-title { font-size: 26px; }
  }
  .login-sub {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 28px;
  }

  .field { margin-bottom: 16px; }
  .field-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
  }
  .input-wrap {
    position: relative;
  }
  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    display: flex;
    align-items: center;
  }
  .field-input {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
    color: #1e293b;
    font-family: inherit;
    transition: border-color 0.15s;
  }
  .field-input:focus {
    border-color: #3b82f6;
  }

  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: #dc2626;
    margin-bottom: 16px;
  }

  .btn-login {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    background: #3b82f6;
    color: #fff;
    border: none;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    transition: background 0.15s;
    margin-top: 8px;
  }
  .btn-login:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }

  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #64748b;
  }
  .login-footer a {
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;
  }
`;

function AdminLogin() {
  const navigate = useNavigate();
const { login, user } = useAuth(); 
 useEffect(() => {                    // ✅ added here
    if (user && user.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);

      const res = await axios.post("http://127.0.0.1:8000/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (res.data.role !== "admin") {
        setError("This login is for admins only. Use Agent Login instead.");
        setLoading(false);
        return;
      }

      login({ name: res.data.name, email: res.data.email, role: res.data.role }, res.data.access_token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <header className="login-header">
          <div className="login-logo" onClick={() => navigate("/")}>
            <div style={{
            width: "32px", height: "32px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            borderRadius: "8px", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <RiCustomerService2Line size={18} color="#fff" />
        </div>
            <span className="login-logo-text">ResolveAI</span>
          </div>
        </header>

        <div className="login-body">
          <div className="login-card">
            <div className="login-badge">
              <FiLock size={11} /> Admin Portal
            </div>
            <h1 className="login-title">Welcome back</h1>
            <p className="login-sub">Sign in to manage tickets and your team.</p>

            {error && <div className="error-box">{error}</div>}

            <div className="field">
              <label className="field-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon"><FiMail size={15} /></span>
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon"><FiLock size={15} /></span>
                <input
                  className="field-input"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            <button className="btn-login" onClick={handleSubmit} disabled={loading}>
              <FiLogIn size={16} />
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="login-footer">
              Are you an agent?{" "}
              <a onClick={() => navigate("/agent/login")} style={{ cursor: "pointer" }}>
                Agent Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;