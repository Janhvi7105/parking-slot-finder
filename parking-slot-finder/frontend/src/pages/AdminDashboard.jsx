import { useEffect, useState } from "react";
import axios from "axios";
import { useAdminStats } from "../context/AdminStatsContext";

export default function AdminDashboard() {
  const { refreshKey } = useAdminStats(); // ✅ ADD

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
  }, [refreshKey]); // 🔥 LIVE UPDATE

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p>Total Users</p>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Total Bookings</p>
          <h2>{stats.totalBookings}</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Available Parking Slots</p>
          <h2>{stats.availableSlots}</h2>
        </div>
      </div>
    </div>
  );
}
