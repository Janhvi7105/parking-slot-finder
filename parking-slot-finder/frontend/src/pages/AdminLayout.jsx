import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 12px",
    marginBottom: "8px",
    borderRadius: "6px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#cbd5e1",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    fontSize: "15px"
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ========== SIDEBAR ========== */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #020617, #0f172a)",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* TITLE */}
        <h2 style={{ marginBottom: "25px", fontSize: "20px" }}>
          🚗 Admin Panel
        </h2>

        {/* MENU */}
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

        {/* LOGOUT */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "12px",
            background: "#ef4444",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "15px",
            cursor: "pointer"
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* ========== PAGE CONTENT ========== */}
      <main
        style={{
          flex: 1,
          background: "#f1f5f9",
          padding: "30px",
          overflowY: "auto"
        }}
      >
        <Outlet />
      </main>

    </div>
  );
}
