import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api";

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // ✅ BULLETPROOF USER PARSE (handles null / undefined / bad JSON)
  let user = null;
  try {
    const rawUser = localStorage.getItem("user");

    if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
      user = JSON.parse(rawUser);
    } else {
      user = null;
    }
  } catch (err) {
    console.warn("⚠️ Invalid user data in localStorage");
    user = null;
  }

  const userId = user?._id;

  /* ================= FETCH RECENT BOOKINGS ================= */
  const fetchRecentBookings = useCallback(async () => {
    try {
      // ✅ safety guard (unchanged logic)
      if (!userId) {
        console.warn("⚠️ No userId found for dashboard");
        setBookings([]);
        return;
      }

      const res = await axios.get(
        `${API}/bookings/my-bookings/${userId}`
      );

      // ✅ supports both response formats (unchanged)
      const allBookings = res.data.bookings || res.data || [];

      // ✅ last 4 bookings (unchanged)
      setBookings(allBookings.slice(0, 4));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, [userId]);

  /* ✅ EFFECT */
  useEffect(() => {
    fetchRecentBookings();
  }, [fetchRecentBookings]);

  return (
    <div className="ud-container">
      {/* Hero / Welcome Section */}
      <div className="ud-welcome">
        <div className="ud-welcome-text">
          <h1>Welcome back, {user?.name || "Guest"} 👋</h1>
          <p>Track and manage your parking sessions in one place.</p>
        </div>
        <div className="ud-stats-badge">
          <div className="ud-stat">
            <span className="ud-stat-number">{bookings.length}</span>
            <span className="ud-stat-label">Recent</span>
          </div>
          <div className="ud-stat">
            <span className="ud-stat-number">
              {bookings.filter(b => b.status === "Confirmed").length}
            </span>
            <span className="ud-stat-label">Active</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="ud-card">
        <div className="ud-card-header">
          <div>
            <h3>📋 Recent Bookings</h3>
            <p>Your last 4 parking reservations</p>
          </div>
          <span className="ud-badge">Last 4</span>
        </div>

        {/* Table */}
        <div className="ud-table-wrapper">
          <table className="ud-table">
            <thead>
              <tr>
                <th>Parking Location</th>
                <th>Booking Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="3" className="ud-empty">
                    <div className="ud-empty-state">
                      <span className="ud-empty-icon">🅿️</span>
                      <p>No recent bookings found</p>
                      <span className="ud-empty-sub">Start your first parking session now</span>
                    </div>
                   </td>
                </tr>
              ) : (
                bookings.map((b, idx) => (
                  <tr
                    key={b._id}
                    className="ud-table-row ud-mobile-card"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="ud-parking" data-label="Parking">
                      <div className="ud-parking-info">
                        <span className="ud-parking-icon">📍</span>
                        <span>{b.parkingName}</span>
                      </div>
                    </td>
                    <td className="ud-date" data-label="Date & Time">
                      <div className="ud-date-info">
                        <span className="ud-date-icon">📅</span>
                        <span>{new Date(b.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span
                        className={`ud-status ${
                          b.status === "Confirmed"
                            ? "confirmed"
                            : b.status === "Cancelled"
                            ? "cancelled"
                            : "reserved"
                        }`}
                      >
                        {b.status === "Confirmed" && "✓ Confirmed"}
                        {b.status === "Cancelled" && "✗ Cancelled"}
                        {b.status !== "Confirmed" && b.status !== "Cancelled" && "⏳ Reserved"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="ud-actions">
          <button
            className="ud-btn ud-btn-primary"
            onClick={() => navigate("/user/search")}
          >
            🚗 Find Parking Now
          </button>
          <button
            className="ud-btn ud-btn-secondary"
            onClick={() => navigate("/user/bookings")}
          >
            View All Bookings →
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="ud-features">
        <div className="ud-feature">
          <div className="ud-feature-icon">🔍</div>
          <h4>Easy Search</h4>
          <p>Find available parking spots near you</p>
        </div>
        <div className="ud-feature">
          <div className="ud-feature-icon">💳</div>
          <h4>Secure Payments</h4>
          <p>Safe & encrypted payment methods</p>
        </div>
        <div className="ud-feature">
          <div className="ud-feature-icon">🕐</div>
          <h4>24/7 Access</h4>
          <p>Book anytime, anywhere</p>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ud-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 32px;
          background: linear-gradient(135deg, #f5f7fa 0%, #eef2f7 100%);
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        /* Welcome Section */
        .ud-welcome {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .ud-welcome-text h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #2d3a4e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .ud-welcome-text p {
          color: #5b6e8c;
          font-size: 16px;
          font-weight: 500;
        }

        .ud-stats-badge {
          display: flex;
          gap: 16px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          padding: 12px 24px;
          border-radius: 80px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.03);
        }

        .ud-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
        }

        .ud-stat:first-child {
          border-right: 2px solid #e2e8f0;
        }

        .ud-stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #2563eb;
          line-height: 1;
        }

        .ud-stat-label {
          font-size: 12px;
          font-weight: 600;
          color: #5b6e8c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Card */
        .ud-card {
          background: #ffffff;
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 40px;
        }

        .ud-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.2);
        }

        .ud-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 20px;
        }

        .ud-card-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .ud-card-header p {
          font-size: 14px;
          color: #64748b;
        }

        .ud-badge {
          background: linear-gradient(135deg, #2563eb10, #06b6d410);
          color: #2563eb;
          padding: 8px 20px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid #2563eb20;
        }

        /* Table */
        .ud-table-wrapper {
          overflow-x: auto;
          border-radius: 20px;
          margin-bottom: 28px;
        }

        .ud-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .ud-table th {
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: #5b6e8c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .ud-table-row {
          background: #ffffff;
          transition: all 0.2s ease;
          animation: slideUp 0.4s ease forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ud-table-row:hover {
          background: #fefce8;
          transform: scale(1.01);
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
        }

        .ud-table td {
          padding: 18px 16px;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .ud-parking-info, .ud-date-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ud-parking-icon, .ud-date-icon {
          font-size: 18px;
        }

        .ud-parking {
          font-weight: 600;
        }

        .ud-date {
          font-size: 13px;
          color: #475569;
        }

        /* Status */
        .ud-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 18px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
          backdrop-filter: blur(4px);
        }

        .ud-status.confirmed {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 4px 12px rgba(34,197,94,0.3);
        }

        .ud-status.reserved {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 12px rgba(245,158,11,0.3);
        }

        .ud-status.cancelled {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 12px rgba(239,68,68,0.3);
        }

        /* Empty State */
        .ud-empty {
          text-align: center;
          padding: 48px 20px;
        }

        .ud-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .ud-empty-icon {
          font-size: 64px;
          opacity: 0.5;
        }

        .ud-empty-state p {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
        }

        .ud-empty-sub {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Buttons */
        .ud-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .ud-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 60px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .ud-btn-primary {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          box-shadow: 0 8px 20px rgba(37,99,235,0.25);
        }

        .ud-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(37,99,235,0.4);
        }

        .ud-btn-secondary {
          background: white;
          color: #2563eb;
          border: 2px solid #e2e8f0;
        }

        .ud-btn-secondary:hover {
          border-color: #2563eb;
          transform: translateY(-2px);
          background: #f8fafc;
        }

        /* Features */
        .ud-features {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .ud-feature {
          flex: 1;
          background: white;
          padding: 24px 20px;
          border-radius: 28px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.03);
        }

        .ud-feature:hover {
          transform: translateY(-6px);
          background: linear-gradient(135deg, #ffffff, #fefce8);
          box-shadow: 0 20px 35px rgba(0,0,0,0.08);
        }

        .ud-feature-icon {
          font-size: 44px;
          margin-bottom: 16px;
        }

        .ud-feature h4 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .ud-feature p {
          font-size: 13px;
          color: #5b6e8c;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ud-container {
            padding: 20px 16px;
          }

          /* Welcome section improvements */
          .ud-welcome {
            flex-direction: column;
            align-items: flex-start;
          }

          .ud-welcome-text h1 {
            font-size: 24px;
          }

          .ud-stats-badge {
            width: 100%;
            justify-content: center;
          }

          /* Card padding */
          .ud-card {
            padding: 18px;
          }

          .ud-card-header h3 {
            font-size: 20px;
          }

          /* Mobile card layout - hide table header */
          .ud-table thead {
            display: none;
          }

          .ud-table,
          .ud-table tbody,
          .ud-table tr,
          .ud-table td {
            display: block;
            width: 100%;
          }

          .ud-mobile-card {
            background: white;
            border-radius: 18px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          }

          .ud-mobile-card td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border: none;
            border-bottom: 1px solid #e5e7eb;
          }

          .ud-mobile-card td:last-child {
            border-bottom: none;
          }

          .ud-mobile-card td::before {
            content: attr(data-label);
            font-weight: 700;
            color: #64748b;
            margin-right: 15px;
            font-size: 12px;
          }

          .ud-table-wrapper {
            overflow-x: hidden;
          }

          /* Action buttons */
          .ud-actions {
            flex-direction: column;
          }

          .ud-btn {
            width: 100%;
            text-align: center;
            justify-content: center;
          }

          /* Features section */
          .ud-features {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}