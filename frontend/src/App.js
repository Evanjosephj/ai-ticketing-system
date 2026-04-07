import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context";

// Public pages
import Home from "./public/Home";
import TrackTicket from "./public/TrackTicket";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminTickets from "./admin/AdminTickets";
import AdminTicketDetail from "./admin/AdminTicketDetail";
import AdminEmployees from "./admin/AdminEmployees";
import AdminAnalytics from "./admin/AdminAnalytics";

// Agent pages
import AgentLogin from "./agent/AgentLogin";
import AgentDashboard from "./agent/AgentDashboard";
import AgentTicketDetail from "./agent/AgentTicketDetail";

// If logged in as admin, redirect away from login page
function AdminLoginRoute() {
  const { user } = useAuth();
  if (user && user.role === "admin") return <Navigate to="/admin" replace />;
  return <AdminLogin />;
}

// If logged in as agent, redirect away from login page
function AgentLoginRoute() {
  const { user } = useAuth();
  if (user && user.role === "employee") return <Navigate to="/agent" replace />;
  return <AgentLogin />;
}

// Protect admin pages
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}

// Protect agent pages
function AgentRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/agent/login" replace />;
  if (user.role !== "employee") return <Navigate to="/agent/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/track/:id" element={<TrackTicket />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginRoute />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
          <Route path="/admin/tickets/:id" element={<AdminRoute><AdminTicketDetail /></AdminRoute>} />
          <Route path="/admin/employees" element={<AdminRoute><AdminEmployees /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />

          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLoginRoute />} />
          <Route path="/agent" element={<AgentRoute><AgentDashboard /></AgentRoute>} />
          <Route path="/agent/tickets/:id" element={<AgentRoute><AgentTicketDetail /></AgentRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;