import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function UserLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "#ccc",
    background: isActive ? "#1abc9c" : "transparent",
    padding: "10px",
    borderRadius: "6px",
    textDecoration: "none",
    marginBottom: "8px",
    display: "block"
  });

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <aside
        style={{
          width: "240px",
          background: "#2f3b52",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>🚗 Parking</h2>

        <NavLink to="/user" end style={linkStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/user/search" style={linkStyle}>
          Search Parking
        </NavLink>

        <NavLink to="/user/bookings" style={linkStyle}>
          Booking History
        </NavLink>

        <NavLink to="/user/profile" style={linkStyle}>
          My Profile
        </NavLink>

        <button
          onClick={logout}
          style={{
            marginTop: "auto",
            padding: "10px",
            background: "#e74c3c",
            border: "none",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </aside>

      {/* PAGE CONTENT */}
      <main
        style={{
          flex: 1,
          background: "#f5f7fa",
          padding: "30px",
          overflowY: "auto"
        }}
      >
        <Outlet />
      </main>

    </div>
  );
}
