import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserLayout() {
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
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: isActive ? "700" : "500",
    color: isActive ? "#ffffff" : "#94a3b8",
    background: isActive
      ? "linear-gradient(135deg, #10b981, #14b8a6)"
      : "transparent",
    textDecoration: "none",
    marginBottom: "8px",
    transition: "all 0.3s ease",
    boxShadow: isActive
      ? "0 4px 12px rgba(16,185,129,0.3)"
      : "none",
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
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
            animation: "fadeIn 0.3s ease",
          }}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          width: isSidebarOpen ? "280px" : "0px",
          background: "linear-gradient(180deg, #0f172a, #1e293b)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 40px rgba(0,0,0,0.25)",
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
            padding: "24px 20px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: isSidebarOpen ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {/* LOGO SECTION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "40px",
              paddingBottom: "20px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                boxShadow: "0 8px 16px rgba(16,185,129,0.3)",
              }}
            >
              🚗
            </div>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: "800", margin: 0 }}>
                ParkSmart
              </h2>
              <p style={{ fontSize: "10px", margin: 0, color: "#94a3b8" }}>
                Premium Parking
              </p>
            </div>
          </div>

          {/* USER GREETING */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>👤</div>
            <div style={{ fontSize: "13px", fontWeight: "600" }}>
              Welcome Back!
            </div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>
              Ready to park?
            </div>
          </div>

          {/* NAV LINKS */}
          <nav style={{ flex: 1 }}>
            <NavLink to="/user" end style={linkStyle}>
              <span style={{ fontSize: "20px" }}>📊</span>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/user/search" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>🔍</span>
              <span>Search Parking</span>
            </NavLink>

            <NavLink to="/user/bookings" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>📖</span>
              <span>Booking History</span>
            </NavLink>

            <NavLink to="/user/profile" style={linkStyle}>
              <span style={{ fontSize: "20px" }}>👤</span>
              <span>My Profile</span>
            </NavLink>
          </nav>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            style={{
              marginTop: "auto",
              padding: "12px",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              border: "none",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
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
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
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
              width: "40px",
              height: "40px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "10px",
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
              Parking Management System
            </h3>
          </div>

          {/* User Profile Mini */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px 12px",
              background: "rgba(0,0,0,0.05)",
              borderRadius: "40px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, #10b981, #14b8a6)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
            >
              👤
            </div>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
              My Account
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "32px", minHeight: "calc(100vh - 73px)" }}>
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
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #0d9488);
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

        /* Responsive */
        @media (max-width: 768px) {
          main > div {
            padding: 20px 16px;
          }
        }

        /* Loading animation for content */
        .loading {
          animation: skeleton 1.5s ease-in-out infinite;
        }

        @keyframes skeleton {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}