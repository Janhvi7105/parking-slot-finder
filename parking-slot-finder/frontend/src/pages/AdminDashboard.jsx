import { useEffect, useState } from "react";
import axios from "axios";
import { useAdminStats } from "../context/AdminStatsContext";

export default function AdminDashboard() {
  const { refreshKey } = useAdminStats(); // ✅ SAME

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    availableSlots: 0,
  });

  const fetchStats = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setStats(res.data);
  };

  useEffect(() => {
    fetchStats();
  }, [refreshKey]); // 🔥 SAME

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="stats-grid">
        {/* USERS */}
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <p>Total Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        {/* BOOKINGS */}
        <div className="stat-card bookings">
          <div className="stat-icon">📄</div>
          <p>Total Bookings</p>
          <h2>{stats.totalBookings}</h2>
        </div>

        {/* SLOTS */}
        <div className="stat-card slots">
          <div className="stat-icon">🅿️</div>
          <p>Available Parking Slots</p>
          <h2>{stats.availableSlots}</h2>
        </div>
      </div>

      {/* ================= STYLES (UI ONLY) ================= */}
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
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::after {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.08;
          background: radial-gradient(circle at top left, #7c3aed, transparent);
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 70px rgba(0,0,0,0.15);
        }

        .stat-icon {
          font-size: 34px;
          margin-bottom: 12px;
        }

        .stat-card p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .stat-card h2 {
          font-size: 32px;
          font-weight: 800;
          color: #020617;
        }

        .stat-card.users {
          border-left: 6px solid #6366f1;
        }

        .stat-card.bookings {
          border-left: 6px solid #22c55e;
        }

        .stat-card.slots {
          border-left: 6px solid #f59e0b;
        }
      `}</style>
    </div>
  );
}
