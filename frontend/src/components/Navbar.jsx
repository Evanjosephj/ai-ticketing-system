// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { HiOutlineTicket } from "react-icons/hi2";
// import { RxDashboard } from "react-icons/rx";
// import { TbCirclePlus, TbTicket, TbChartBar, TbMenu2, TbX } from "react-icons/tb";
// import { HiOutlineUsers } from "react-icons/hi2";

// function Navbar() {
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const links = [
//     { path: "/",          label: "Dashboard",  icon: <RxDashboard size={15} /> },
//     { path: "/submit",    label: "New Ticket", icon: <TbCirclePlus size={15} /> },
//     { path: "/tickets",   label: "Tickets",    icon: <TbTicket size={15} /> },
//     { path: "/employees", label: "Directory",  icon: <HiOutlineUsers size={15} /> },
//     { path: "/analytics", label: "Analytics",  icon: <TbChartBar size={15} /> },
//   ];

//   return (
//     <nav style={{ background: "#fff", borderBottom: "1.5px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
//       <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px" }}>

//         {/* Brand */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//           <div style={{ width: "36px", height: "36px", background: "#185FA5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//             <HiOutlineTicket size={19} color="#fff" />
//           </div>
//           <div>
//             <div style={{ fontSize: "14px", fontWeight: "600", color: "#1A1825", letterSpacing: "-0.3px", lineHeight: "1.2" }}>AI Ticketing</div>
//             <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace", lineHeight: "1.2" }}>crafted by Yesobhu</div>
//           </div>
//         </div>

//         {/* Desktop nav links */}
//         <div style={{ display: "flex", gap: "2px", background: "var(--bg-primary)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "4px" }}
//           className="desktop-nav">
//           {links.map((link) => {
//             const active = location.pathname === link.path;
//             return (
//               <Link key={link.path} to={link.path} style={{
//                 display: "flex", alignItems: "center", gap: "6px",
//                 padding: "7px 13px", borderRadius: "9px", fontSize: "13px",
//                 fontWeight: active ? "600" : "500", textDecoration: "none",
//                 transition: "all 0.18s",
//                 background: active ? "#fff" : "transparent",
//                 color: active ? "#185FA5" : "var(--text-secondary)",
//                 border: active ? "1px solid var(--border)" : "1px solid transparent",
//                 boxShadow: active ? "0 1px 4px rgba(24,95,165,0.10)" : "none",
//                 whiteSpace: "nowrap",
//               }}>
//                 {link.icon}{link.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* Desktop status */}
//         <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#EAF3DE", border: "1.5px solid #C0DD97", borderRadius: "20px", padding: "6px 14px" }}
//           className="desktop-nav">
//           <div className="pulse-dot" style={{ background: "#639922", flexShrink: 0 }}></div>
//           <span style={{ fontSize: "12px", fontWeight: "500", color: "#3B6D11", whiteSpace: "nowrap" }}>System Online</span>
//         </div>

//         {/* Mobile hamburger */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="mobile-menu-btn"
//           style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", display: "none", padding: "4px" }}
//         >
//           {menuOpen ? <TbX size={24} /> : <TbMenu2 size={24} />}
//         </button>
//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="mobile-nav" style={{ background: "#fff", borderTop: "1.5px solid var(--border)", padding: "12px 20px 16px" }}>
//           {links.map((link) => {
//             const active = location.pathname === link.path;
//             return (
//               <Link key={link.path} to={link.path}
//                 onClick={() => setMenuOpen(false)}
//                 style={{
//                   display: "flex", alignItems: "center", gap: "10px",
//                   padding: "11px 14px", borderRadius: "10px", fontSize: "14px",
//                   fontWeight: active ? "600" : "500", textDecoration: "none",
//                   color: active ? "#185FA5" : "var(--text-secondary)",
//                   background: active ? "#E6F1FB" : "transparent",
//                   marginBottom: "4px",
//                 }}>
//                 {link.icon}{link.label}
//               </Link>
//             );
//           })}
//           <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#EAF3DE", border: "1.5px solid #C0DD97", borderRadius: "20px", padding: "8px 14px", marginTop: "8px", width: "fit-content" }}>
//             <div className="pulse-dot" style={{ background: "#639922" }}></div>
//             <span style={{ fontSize: "12px", fontWeight: "500", color: "#3B6D11" }}>System Online</span>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @media (max-width: 768px) {
//           .desktop-nav { display: none !important; }
//           .mobile-menu-btn { display: flex !important; }
//         }
//         @media (min-width: 769px) {
//           .mobile-nav { display: none !important; }
//         }
//       `}</style>
//     </nav>
//   );
// }

// export default Navbar;