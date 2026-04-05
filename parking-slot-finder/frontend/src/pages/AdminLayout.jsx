import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    position: "relative",
    overflow: "hidden",
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            zIndex: 998,
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: isSidebarOpen ? "280px" : "0px",
          background: "linear-gradient(180deg, #020617, #0f172a)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 45px rgba(0,0,0,0.45)",
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 999,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "280px",
            padding: "24px 22px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: isSidebarOpen ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {/* LOGO / TITLE */}
          <div style={{ marginBottom: "40px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow: "0 8px 16px rgba(124,58,237,0.3)",
                }}
              >
                🚗
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                Admin Panel
              </h2>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "52px" }}>
              Parking Slot Finder
            </p>
          </div>

          {/* Admin Stats Badge */}
          <div
            style={{
              background: "rgba(124,58,237,0.15)",
              borderRadius: "16px",
              padding: "12px",
              marginBottom: "24px",
              textAlign: "center",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "4px" }}>
              Admin Access
            </div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#a78bfa" }}>
              Full Control Mode
            </div>
          </div>

          {/* NAV LINKS */}
          <nav style={{ flex: 1 }}>
            <NavLink to="/admin" end style={linkStyle}>
              <span style={{ fontSize: "20px" }}>📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/manage-parking" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>🅿️</span>
              <span>Manage Parking</span>
            </NavLink>

            <NavLink to="/admin/reservations" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>📄</span>
              <span>Reservations</span>
            </NavLink>

            <NavLink to="/admin/users" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>👥</span>
              <span>Users</span>
            </NavLink>

            <NavLink to="/admin/profile" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>👤</span>
              <span>My Profile</span>
            </NavLink>
          </nav>

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
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Top Bar with Hamburger Menu */}
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Hamburger Menu Button - 3 lines */}
          <button
            onClick={toggleSidebar}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              width: "44px",
              height: "44px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)";
            }}
          >
            <span
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "#1e293b",
                borderRadius: "2px",
                transition: "all 0.3s ease",
                transform: isSidebarOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
              }}
            />
            <span
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "#1e293b",
                borderRadius: "2px",
                transition: "all 0.3s ease",
                opacity: isSidebarOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "#1e293b",
                borderRadius: "2px",
                transition: "all 0.3s ease",
                transform: isSidebarOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
              }}
            />
          </button>

          {/* Page Title Indicator */}
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1e293b" }}>
              Admin Control Panel
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
              Manage your parking system efficiently
            </p>
          </div>

          {/* Admin Profile Mini */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px 16px",
              background: "rgba(0,0,0,0.05)",
              borderRadius: "40px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "700",
                color: "white",
              }}
            >
              A
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                Admin User
              </span>
              <span style={{ fontSize: "10px", color: "#64748b" }}>
                Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "32px", minHeight: "calc(100vh - 77px)" }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #7c3aed, #9333ea);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6d28d9, #7e22ce);
        }

        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }

        /* Active link ripple effect */
        .active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: ripple 0.6s ease-out;
        }

        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* Hover effect for nav links */
        .nav-link:hover {
          background: rgba(124,58,237,0.1);
          transform: translateX(4px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          main > div {
            padding: 20px 16px;
          }

          .top-bar {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}