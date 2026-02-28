import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAdminStats } from "../context/AdminStatsContext";

export default function AdminDashboard() {
  const { refreshKey } = useAdminStats();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    availableSlots: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= FETCH STATS ================= */
  const fetchStats = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/stats",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setStats(res.data);
  }, [token]);

  /* ================= FETCH FEEDBACK ================= */
  const fetchFeedback = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/feedback",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setFeedbacks(res.data.feedbacks || []);
  }, [token]);

  useEffect(() => {
    fetchStats();
    fetchFeedback();
  }, [fetchStats, fetchFeedback, refreshKey]);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* ================= STATS ================= */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <p>Total Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="stat-card bookings">
          <div className="stat-icon">📄</div>
          <p>Total Bookings</p>
          <h2>{stats.totalBookings}</h2>
        </div>

        <div className="stat-card slots">
          <div className="stat-icon">🅿️</div>
          <p>Available Parking Slots</p>
          <h2>{stats.availableSlots}</h2>
        </div>
      </div>

      {/* ================= USER FEEDBACK ================= */}
      <h2 className="feedback-title">User Feedback</h2>

      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedback submitted yet.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((b) => (
            <div key={b._id} className="feedback-card">
              <h4>{b.parkingName}</h4>

              {/* ⭐ SAFE FEEDBACK RENDER */}
              <p className="rating">
                ⭐ {b.feedback?.rating ?? 0}/5
              </p>

              <p className="comment">
                “{b.feedback?.comment || "No comment"}”
              </p>

              <p className="meta">
                👤 {b.userName} • 🕒{" "}
                {b.feedback?.givenAt
                  ? new Date(b.feedback.givenAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-dashboard {
          padding: 10px;
        }

        .admin-title {
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 28px;
          background: linear-gradient(90deg, #7c3aed, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 26px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 20px 45px rgba(0,0,0,0.1);
        }

        .stat-icon {
          font-size: 34px;
          margin-bottom: 12px;
        }

        .stat-card.users { border-left: 6px solid #6366f1; }
        .stat-card.bookings { border-left: 6px solid #22c55e; }
        .stat-card.slots { border-left: 6px solid #f59e0b; }

        .feedback-title {
          margin-top: 40px;
          font-size: 22px;
          font-weight: 800;
        }

        .feedback-list {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }

        .feedback-card {
          background: #fff;
          padding: 20px;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,.08);
        }

        .rating {
          margin: 6px 0;
          font-weight: 700;
          color: #facc15;
        }

        .comment {
          font-style: italic;
          color: #374151;
        }

        .meta {
          margin-top: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .no-feedback {
          margin-top: 10px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}