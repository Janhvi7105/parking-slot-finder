import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        `http://localhost:5000/api/bookings/my-bookings/${userId}`
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
      {/* TITLE */}
      <h2 className="ud-title">User Dashboard</h2>

      {/* CARD */}
      <div className="ud-card">
        <div className="ud-card-header">
          <h3>Recent Bookings</h3>
          <span>Last 4</span>
        </div>

        {/* TABLE */}
        <table className="ud-table">
          <thead>
            <tr>
              <th>Parking Name</th>
              <th>Booking Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="3" className="ud-empty">
                  No recent bookings
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td className="ud-parking">{b.parkingName}</td>
                  <td className="ud-date">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span
                      className={`ud-status ${
                        b.status === "Confirmed"
                          ? "confirmed"
                          : b.status === "Cancelled"
                          ? "cancelled"
                          : "reserved"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ACTION */}
        <button
          className="ud-btn"
          onClick={() => navigate("/user/search")}
        >
          🚗 Find Parking
        </button>
      </div>

      {/* ================= STYLES ONLY (UNCHANGED) ================= */}
      <style>{`
        .ud-container {
          padding: 30px;
          background: linear-gradient(180deg, #f8fafc, #ffffff);
          min-height: 100vh;
        }

        .ud-title {
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 22px;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ud-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12);
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ud-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .ud-card-header h3 {
          font-size: 20px;
          font-weight: 700;
        }

        .ud-card-header span {
          background: #eef2ff;
          color: #4338ca;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .ud-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 10px;
        }

        .ud-table th {
          text-align: left;
          font-size: 13px;
          color: #64748b;
          padding-bottom: 8px;
        }

        .ud-table tbody tr {
          background: #ffffff;
          border-radius: 14px;
          transition: all 0.25s ease;
        }

        .ud-table tbody tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .ud-table td {
          padding: 14px 12px;
          font-size: 14px;
        }

        .ud-parking {
          font-weight: 600;
          color: #0f172a;
        }

        .ud-date {
          color: #475569;
          font-size: 13px;
        }

        .ud-status {
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
        }

        .ud-status.confirmed {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 0 10px rgba(34,197,94,0.45);
        }

        .ud-status.reserved {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 0 10px rgba(245,158,11,0.45);
        }

        .ud-status.cancelled {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 0 10px rgba(239,68,68,0.45);
        }

        .ud-empty {
          text-align: center;
          padding: 20px;
          color: #94a3b8;
        }

        .ud-btn {
          margin-top: 22px;
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: #fff;
          padding: 14px 26px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .ud-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(37,99,235,0.45);
        }
      `}</style>
    </div>
  );
}