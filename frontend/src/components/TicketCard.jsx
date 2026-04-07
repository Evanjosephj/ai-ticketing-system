// import { useNavigate } from "react-router-dom";
// import StatusBadge from "./StatusBadge";

// function TicketCard({ ticket }) {
//   const navigate = useNavigate();

//   const severityColor = {
//     Critical: { text: "#A32D2D", bg: "#FCEBEB", border: "#F7C1C1" },
//     High:     { text: "#854F0B", bg: "#FAEEDA", border: "#FAC775" },
//     Medium:   { text: "#BA7517", bg: "#FAEEDA", border: "#EF9F27" },
//     Low:      { text: "#3B6D11", bg: "#EAF3DE", border: "#C0DD97" },
//   };

//   const severityLeft = {
//     Critical: "#E24B4A", High: "#EF9F27", Medium: "#FAC775", Low: "#639922",
//   };

//   const sev = severityColor[ticket.severity] || { text: "#534AB7", bg: "#EEEDFE", border: "#CECBF6" };
//   const leftBorder = severityLeft[ticket.severity] || "#AFA9EC";

//   return (
//     <div
//       onClick={() => navigate(`/tickets/${ticket.id}`)}
//       className="animate-fade-in"
//       style={{
//         background: "#fff", border: "1.5px solid #E8E6F0",
//         borderLeft: `4px solid ${leftBorder}`, borderRadius: "14px",
//         padding: "18px 18px", cursor: "pointer",
//         transition: "border-color 0.18s, transform 0.18s",
//       }}
//       onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#85B7EB"; e.currentTarget.style.transform = "translateY(-2px)"; }}
//       onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E6F0"; e.currentTarget.style.transform = "translateY(0)"; }}
//     >
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "10px" }}>
//         <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#111", lineHeight: "1.4", flex: 1 }}>
//           {ticket.title}
//         </h3>
//         <StatusBadge status={ticket.status} />
//       </div>

//       <p style={{ fontSize: "13px", color: "#777", marginBottom: "12px", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
//         {ticket.ai_summary || ticket.description}
//       </p>

//       <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
//         {ticket.category && (
//           <span style={{ padding: "3px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: "500", background: "#F1EFF8", color: "#534AB7", border: "1px solid #D8D5F0" }}>
//             {ticket.category}
//           </span>
//         )}
//         <span style={{ padding: "3px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: "500", background: sev.bg, color: sev.text, border: `1px solid ${sev.border}` }}>
//           {ticket.severity}
//         </span>
//         {ticket.department && (
//           <span style={{ padding: "3px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: "500", background: "#E6F1FB", color: "#0C447C", border: "1px solid #B5D4F4" }}>
//             {ticket.department}
//           </span>
//         )}
//       </div>

//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F0EEF8", paddingTop: "10px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#B5D4F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "500", color: "#0C447C", flexShrink: 0 }}>
//             {(ticket.submitted_by ?? "?").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
//           </div>
//           <span style={{ fontSize: "12px", color: "#999" }}>by {ticket.submitted_by}</span>
//         </div>
//         <span style={{ fontSize: "11px", color: "#bbb", fontWeight: "500", fontFamily: "JetBrains Mono, monospace" }}>#{ticket.id}</span>
//       </div>
//     </div>
//   );
// }

// export default TicketCard;