import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "../api";

export default function AdminReservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/bookings/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
      alert("Unauthorized or session expired");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= CONFIRM BOOKING ================= */
  const confirmBooking = async (id, status) => {
    if (status !== "Reserved") return;

    try {
      await axios.put(
        `${API}/admin/confirm/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Confirmed" } : b
        )
      );
    } catch (err) {
      console.error("Confirm booking error:", err);
      alert("Failed to confirm booking");
    }
  };

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async (id, status) => {
    if (status !== "Reserved") return;

    try {
      await axios.put(
        `${API}/admin/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
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

  if (loading) {
    return (
      <div className="ar-loading">
        <div className="loading-spinner"></div>
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="ar-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="ar-content">
        {/* Header Section */}
        <div className="ar-header">
          <div className="header-left">
            <div className="header-icon">📋</div>
            <div>
              <h2 className="ar-title">Booking Reservations</h2>
              <p className="ar-subtitle">Manage and track all customer bookings</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-badge total">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-badge confirmed">
              <span className="stat-number">{stats.confirmed}</span>
              <span className="stat-label">Confirmed</span>
            </div>
            <div className="stat-badge reserved">
              <span className="stat-number">{stats.reserved}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="ar-filters">
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
        <div className="ar-table">
          <div className="ar-head">
            <span>👤 User</span>
            <span>🅿️ Parking Spot</span>
            <span>📅 From</span>
            <span>📅 To</span>
            <span>💰 Amount</span>
            <span>📊 Status</span>
            <span>⚡ Actions</span>
          </div>

          <div className="ar-body">
            {filteredBookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No reservations found</p>
                <span>Try adjusting your filters or search term</span>
              </div>
            ) : (
              filteredBookings.map((b, idx) => (
                <div key={b._id} className="ar-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                  <span className="user-cell">
                    <div className="user-avatar">
                      {b.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{b.userName || "Test User"}</span>
                  </span>
                  <span className="parking-cell">
                    <span className="parking-icon">🏢</span>
                    {b.parkingName}
                  </span>
                  <span className="date-cell">{b.fromTime}</span>
                  <span className="date-cell">{b.toTime}</span>
                  <span className="amount-cell">₹{b.amount}</span>
                  <span className="status-cell">
                    <span
                      className={`ar-status ${
                        b.status === "Confirmed"
                          ? "confirmed"
                          : b.status === "Cancelled"
                          ? "cancelled"
                          : "reserved"
                      }`}
                    >
                      <span className="status-dot"></span>
                      {b.status === "Reserved" ? "Pending" : b.status}
                    </span>
                  </span>
                  <span className="actions-cell">
                    {b.status === "Reserved" ? (
                      <div className="action-buttons">
                        <button
                          className="btn confirm"
                          onClick={() => confirmBooking(b._id, b.status)}
                        >
                          <span>✓</span>
                          Confirm
                        </button>
                        <button
                          className="btn cancel"
                          onClick={() => cancelBooking(b._id, b.status)}
                        >
                          <span>✗</span>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="locked-badge">
                        <span>🔒</span>
                        Locked
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ar-container {
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

        .ar-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        /* Loading State */
        .ar-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .ar-header {
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

        .ar-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .ar-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
        }

        .header-stats {
          display: flex;
          gap: 16px;
        }

        .stat-badge {
          background: rgba(255,255,255,0.15);
          padding: 10px 20px;
          border-radius: 60px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-badge:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.25);
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
        }

        /* Filters */
        .ar-filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        /* Table */
        .ar-table {
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

        .ar-head {
          display: grid;
          grid-template-columns: 1.8fr 1.8fr 1.4fr 1.4fr 1fr 1.2fr 1.8fr;
          align-items: center;
          padding: 18px 24px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .ar-body {
          max-height: 600px;
          overflow-y: auto;
        }

        .ar-row {
          display: grid;
          grid-template-columns: 1.8fr 1.8fr 1.4fr 1.4fr 1fr 1.2fr 1.8fr;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          transition: all 0.3s ease;
          animation: fadeInRow 0.4s ease forwards;
          opacity: 0;
          transform: translateX(-10px);
        }

        @keyframes fadeInRow {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .ar-row:hover {
          background: #f8fafc;
          transform: translateX(4px);
        }

        /* Cell Styles */
        .user-cell {
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
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
        }

        .parking-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .parking-icon {
          font-size: 18px;
        }

        .date-cell {
          color: #475569;
          font-size: 13px;
        }

        .amount-cell {
          font-weight: 800;
          color: #16a34a;
          font-size: 16px;
        }

        .status-cell {
          display: flex;
          align-items: center;
        }

        .ar-status {
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

        .ar-status.confirmed {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .ar-status.reserved {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .ar-status.cancelled {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .actions-cell {
          display: flex;
          align-items: center;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
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

        .btn.confirm {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
        }

        .btn.confirm:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(34,197,94,0.4);
        }

        .btn.cancel {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .btn.cancel:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(239,68,68,0.4);
        }

        .locked-badge {
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
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }

        .empty-state span {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Custom Scrollbar for Table Body */
        .ar-body::-webkit-scrollbar {
          width: 8px;
        }

        .ar-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .ar-body::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .ar-head, .ar-row {
            grid-template-columns: 1.5fr 1.5fr 1.2fr 1.2fr 0.8fr 1fr 1.5fr;
            gap: 8px;
          }
        }

        @media (max-width: 768px) {
          .ar-content {
            padding: 20px;
          }

          .ar-header {
            flex-direction: column;
            text-align: center;
          }

          .header-left {
            flex-direction: column;
          }

          .ar-filters {
            flex-direction: column;
          }

          .search-input {
            width: 100%;
          }

          .ar-head {
            display: none;
          }

          .ar-row {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 20px;
            margin-bottom: 16px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
          }

          .user-cell, .parking-cell, .date-cell, .amount-cell, .status-cell, .actions-cell {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .user-cell::before {
            content: "👤 User";
            font-weight: 600;
            color: #64748b;
          }

          .parking-cell::before {
            content: "🅿️ Parking";
            font-weight: 600;
            color: #64748b;
          }

          .date-cell::before {
            content: "📅 Date";
            font-weight: 600;
            color: #64748b;
          }

          .amount-cell::before {
            content: "💰 Amount";
            font-weight: 600;
            color: #64748b;
          }

          .status-cell::before {
            content: "📊 Status";
            font-weight: 600;
            color: #64748b;
          }

          .actions-cell::before {
            content: "⚡ Actions";
            font-weight: 600;
            color: #64748b;
          }
        }
      `}</style>
    </div>
  );
}