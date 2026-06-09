import axios from "axios";
import { useEffect, useState } from "react";

export default function Reservations() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= FETCH ALL BOOKINGS (ADMIN) ================= */
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token"); // 🔐 ADMIN TOKEN

      const res = await axios.get(
        "http://localhost:5000/api/bookings/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // backend sends { success, bookings }
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Admin bookings error:", err);
      alert("Unauthorized. Please login again.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= CONFIRM BOOKING ================= */
  const confirmBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/bookings/admin/confirm/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔄 update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Confirmed" } : b
        )
      );
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Failed to confirm booking");
    }
  };

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/bookings/admin/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking");
    }
  };

  // Filter and search logic
  const filteredBookings = bookings.filter(booking => {
    if (filter !== "all" && booking.status !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (booking.userName?.toLowerCase() || "").includes(searchLower) ||
        (booking.parkingName?.toLowerCase() || "").includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === "Confirmed").length,
    reserved: bookings.filter(b => b.status === "Reserved").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  return (
    <div className="reservations-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="reservations-container">
        {/* Header Section */}
        <div className="reservations-header">
          <div className="header-left">
            <div className="header-icon">📋</div>
            <div>
              <h2 className="page-title">Reservations Management</h2>
              <p className="page-subtitle">Manage and track all customer bookings</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card-mini total">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card-mini confirmed">
              <span className="stat-value">{stats.confirmed}</span>
              <span className="stat-label">Confirmed</span>
            </div>
            <div className="stat-card-mini reserved">
              <span className="stat-value">{stats.reserved}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === "Reserved" ? "active" : ""}`}
              onClick={() => setFilter("Reserved")}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === "Confirmed" ? "active" : ""}`}
              onClick={() => setFilter("Confirmed")}
            >
              Confirmed
            </button>
            <button 
              className={`filter-btn ${filter === "Cancelled" ? "active" : ""}`}
              onClick={() => setFilter("Cancelled")}
            >
              Cancelled
            </button>
          </div>
          <div className="search-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by user or parking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-container">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Reservations Found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>👤 User</th>
                    <th>🅿️ Parking</th>
                    <th>💰 Amount</th>
                    <th>📊 Status</th>
                    <th>⚡ Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b, idx) => (
                    <tr key={b._id} className="table-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                      <td className="user-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            {b.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="user-name">{b.userName}</span>
                        </div>
                       </td>
                      <td className="parking-cell">
                        <div className="parking-info">
                          <span className="parking-icon">🏢</span>
                          <span>{b.parkingName}</span>
                        </div>
                       </td>
                      <td className="amount-cell">₹{b.amount}</td>
                      <td className="status-cell">
                        <span className={`status-badge ${b.status.toLowerCase()}`}>
                          <span className="status-dot"></span>
                          {b.status === "Reserved" ? "Pending" : b.status}
                        </span>
                       </td>
                      <td className="actions-cell">
                        {b.status === "Reserved" ? (
                          <div className="action-buttons">
                            <button
                              className="action-btn confirm"
                              onClick={() => confirmBooking(b._id)}
                            >
                              <span>✓</span>
                              Confirm
                            </button>
                            <button
                              className="action-btn cancel"
                              onClick={() => cancelBooking(b._id)}
                            >
                              <span>✗</span>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="locked-status">
                            <span>🔒</span>
                            <span>Locked</span>
                          </div>
                        )}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .reservations-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.25), rgba(255,255,255,0));
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 600px;
          height: 600px;
          bottom: -250px;
          left: -250px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(10deg); }
        }

        .reservations-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .reservations-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 24px 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.2);
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 10px 20px rgba(16,185,129,0.3);
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .page-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
        }

        .header-stats {
          display: flex;
          gap: 16px;
        }

        .stat-card-mini {
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card-mini:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.25);
        }

        .stat-card-mini.total .stat-value { color: white; }
        .stat-card-mini.confirmed .stat-value { color: #22c55e; }
        .stat-card-mini.reserved .stat-value { color: #f59e0b; }

        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 800;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        /* Filters */
        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 40px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-color: transparent;
        }

        .search-group {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
        }

        .search-input {
          padding: 10px 16px 10px 42px;
          border: none;
          border-radius: 40px;
          font-size: 14px;
          width: 260px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.3);
        }

        /* Table Container */
        .table-container {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .reservations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .reservations-table thead {
          background: linear-gradient(135deg, #1e293b, #0f172a);
        }

        .reservations-table th {
          padding: 18px 20px;
          text-align: left;
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .table-row {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease forwards;
          opacity: 0;
          transform: translateX(-10px);
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .table-row:hover {
          background: #f8fafc;
          transform: translateX(4px);
        }

        .reservations-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #1e293b;
        }

        /* Cell Styles */
        .user-cell .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 14px;
        }

        .user-name {
          font-weight: 600;
        }

        .parking-cell .parking-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .parking-icon {
          font-size: 18px;
        }

        .amount-cell {
          font-weight: 800;
          color: #16a34a;
        }

        .status-cell {
          display: flex;
          align-items: center;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 700;
          color: white;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
        }

        .status-badge.confirmed {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .status-badge.reserved {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .status-badge.cancelled {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .actions-cell .action-buttons {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 40px;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.confirm {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .action-btn.confirm:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(34,197,94,0.4);
        }

        .action-btn.cancel {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .action-btn.cancel:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(239,68,68,0.4);
        }

        .locked-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e2e8f0;
          padding: 6px 14px;
          border-radius: 40px;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 40px;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .empty-state h3 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #64748b;
        }

        /* Responsive - Tablet */
        @media (max-width: 768px) {
          .reservations-container {
            padding: 12px;
          }

          .reservations-header {
            flex-direction: column;
            text-align: center;
            padding: 18px;
            border-radius: 20px;
          }

          .header-left {
            flex-direction: column;
            gap: 12px;
          }

          .header-stats {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .page-title {
            font-size: 22px;
          }

          .page-subtitle {
            font-size: 13px;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            justify-content: center;
          }

          .search-group {
            width: 100%;
          }

          .search-input {
            width: 100%;
          }

          .table-container {
            border-radius: 18px;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .reservations-table {
            min-width: 700px;
          }

          .actions-cell .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }

        /* Responsive - iPhone / Small Screens */
        @media (max-width: 480px) {
          .reservations-container {
            padding: 8px;
          }

          .page-title {
            font-size: 20px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
            font-size: 22px;
          }

          .stat-card-mini {
            padding: 10px 14px;
          }

          .stat-value {
            font-size: 22px;
          }

          .filter-btn {
            flex: 1;
            text-align: center;
          }

          .filter-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}