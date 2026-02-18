import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function AdminReservations() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH ALL BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/admin/all",
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
  const confirmBooking = async (id) => {
    await axios.put(
      `http://localhost:5000/api/bookings/admin/confirm/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "Confirmed" } : b
      )
    );
  };

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async (id) => {
    await axios.put(
      `http://localhost:5000/api/bookings/admin/cancel/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBookings((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, status: "Cancelled" } : b
      )
    );
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Loading reservations...</p>;
  }

  return (
    <div className="ar-container">
      <h2 className="ar-title">📋 Booking Reservations</h2>

      <div className="ar-table">
        <div className="ar-head">
          <span>User</span>
          <span>Parking Spot</span>
          <span>From</span>
          <span>To</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {bookings.map((b) => (
          <div key={b._id} className="ar-row">
            <span className="user">{b.userName || "Test User"}</span>
            <span>{b.parkingName}</span>
            <span>{b.fromTime}</span>
            <span>{b.toTime}</span>
            <span className="ar-amount">₹{b.amount}</span>

            <span
              className={`ar-status ${
                b.status === "Confirmed"
                  ? "confirmed"
                  : b.status === "Cancelled"
                  ? "cancelled"
                  : "reserved"
              }`}
            >
              {b.status}
            </span>

            <span className="ar-actions">
              {b.status === "Reserved" ? (
                <>
                  <button
                    className="btn confirm"
                    onClick={() => confirmBooking(b._id)}
                  >
                    ✔ Confirm
                  </button>
                  <button
                    className="btn cancel"
                    onClick={() => cancelBooking(b._id)}
                  >
                    ✖ Cancel
                  </button>
                </>
              ) : (
                <span className="locked">🔒 Locked</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ================= STYLES (UI ONLY) ================= */}
      <style>{`
        .ar-container {
          padding: 40px;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
          min-height: 100vh;
        }

        .ar-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(90deg, #0f172a, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ar-table {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12);
          overflow: hidden;
          animation: fadeUp 0.4s ease;
        }

        .ar-head,
        .ar-row {
          display: grid;
          grid-template-columns: 1.4fr 1.5fr 1.6fr 1.6fr 1fr 1.2fr 2fr;
          align-items: center;
          padding: 16px 22px;
        }

        .ar-head {
          background: linear-gradient(90deg, #020617, #0f172a);
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: .4px;
        }

        .ar-row {
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          transition: all 0.25s ease;
        }

        .ar-row:hover {
          background: #f9fafb;
          transform: translateY(-2px);
        }

        .user {
          font-weight: 600;
          color: #0f172a;
        }

        .ar-amount {
          font-weight: 800;
          color: #16a34a;
        }

        .ar-status {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          width: fit-content;
          color: #fff;
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

        .ar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .btn.confirm {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
        }

        .btn.confirm:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 28px rgba(34,197,94,.45);
        }

        .btn.cancel {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
        }

        .btn.cancel:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 28px rgba(239,68,68,.45);
        }

        .locked {
          color: #94a3b8;
          font-weight: 700;
          font-size: 13px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
