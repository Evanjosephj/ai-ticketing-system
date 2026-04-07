// function StatusBadge({ status }) {
//   const styles = {
//     "New":           { bg: "#E6F1FB", color: "#0C447C", border: "#B5D4F4" },
//     "Assigned":      { bg: "#FAEEDA", color: "#633806", border: "#FAC775" },
//     "In Progress":   { bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27" },
//     "Pending Info":  { bg: "#EEEDFE", color: "#3C3489", border: "#CECBF6" },
//     "Resolved":      { bg: "#EAF3DE", color: "#27500A", border: "#C0DD97" },
//     "Closed":        { bg: "#F1EFE8", color: "#444441", border: "#D3D1C7" },
//     "Auto-Resolved": { bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
//     "Escalated":     { bg: "#FCEBEB", color: "#791F1F", border: "#F7C1C1" },
//   };

//   const s = styles[status] || styles["Closed"];

//   return (
//     <span style={{
//       background: s.bg, color: s.color, border: `1px solid ${s.border}`,
//       padding: "4px 10px", borderRadius: "20px", fontSize: "11px",
//       fontWeight: "500", letterSpacing: "0.03em", whiteSpace: "nowrap",
//     }}>
//       {status}
//     </span>
//   );
// }

// export default StatusBadge;