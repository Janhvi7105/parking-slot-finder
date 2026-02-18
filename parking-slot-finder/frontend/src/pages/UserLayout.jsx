import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function UserLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: isActive ? "700" : "500",
    color: isActive ? "#ffffff" : "#cbd5e1",
    background: isActive
      ? "linear-gradient(135deg, #10b981, #14b8a6)"
      : "transparent",
    textDecoration: "none",
    marginBottom: "10px",
    transition: "all 0.3s ease",
    boxShadow: isActive
      ? "0 10px 25px rgba(16,185,129,0.45)"
      : "none",
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #0f172a, #1e293b)",
          color: "#fff",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 40px rgba(0,0,0,0.35)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "40px",
          }}
        >
          <span style={{ fontSize: "26px" }}>🚗</span>
          <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
            Parking
          </h2>
        </div>

        {/* NAV LINKS */}
        <NavLink to="/user" end style={linkStyle}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/user/search" style={linkStyle}>
          🔍 Search Parking
        </NavLink>

        <NavLink to="/user/bookings" style={linkStyle}>
          📖 Booking History
        </NavLink>

        <NavLink to="/user/profile" style={linkStyle}>
          👤 My Profile
        </NavLink>

        {/* LOGOUT */}
        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "14px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            border: "none",
            color: "#fff",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          🚪 Logout
        </button>
      </aside>

      {/* ================= PAGE CONTENT ================= */}
      <main
        style={{
          flex: 1,
          background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
          padding: "32px",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
