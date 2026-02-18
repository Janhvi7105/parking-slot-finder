import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "12px",
    borderRadius: "14px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: isActive ? "700" : "500",
    color: isActive ? "#ffffff" : "#cbd5e1",
    background: isActive
      ? "linear-gradient(135deg, #7c3aed, #9333ea)"
      : "transparent",
    boxShadow: isActive
      ? "0 12px 30px rgba(124,58,237,0.45)"
      : "none",
    transition: "all 0.25s ease",
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: "270px",
          background: "linear-gradient(180deg, #020617, #0f172a)",
          color: "#fff",
          padding: "24px 22px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 45px rgba(0,0,0,0.45)",
        }}
      >
        {/* LOGO / TITLE */}
        <div style={{ marginBottom: "36px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "0.5px",
            }}
          >
            🚗 Admin Panel
          </h2>
          <p style={{ fontSize: "13px", color: "#94a3b8" }}>
            Parking Slot Finder
          </p>
        </div>

        {/* NAV LINKS */}
        <NavLink to="/admin" end style={linkStyle}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/manage-parking" style={linkStyle}>
          🅿️ Manage Parking
        </NavLink>

        <NavLink to="/admin/reservations" style={linkStyle}>
          📄 Reservations
        </NavLink>

        <NavLink to="/admin/users" style={linkStyle}>
          👥 Users
        </NavLink>

        <NavLink to="/admin/profile" style={linkStyle}>
          👤 My Profile
        </NavLink>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "14px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            border: "none",
            borderRadius: "16px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 15px 35px rgba(239,68,68,0.45)",
            transition: "0.25s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          🚪 Logout
        </button>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        style={{
          flex: 1,
          background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
          padding: "36px",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
