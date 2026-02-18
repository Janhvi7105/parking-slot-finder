/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function BookingHistory() {
  const { state } = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const userId = "TEST_USER_ID"; // 🔐 JWT later

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/my-bookings/${userId}`
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (state?.refresh) fetchBookings();
  }, [state]);

  const submitFeedback = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/feedback/${selectedBooking._id}`,
        { rating, comment }
      );

      alert("Feedback submitted ⭐");
      setShowModal(false);
      setRating(0);
      setComment("");
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert("Failed to submit feedback");
    }
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Loading booking history...</p>;
  }

  return (
    <div className="bh-container">
      <h2 className="bh-title">Booking History</h2>

      {bookings.length === 0 ? (
        <p className="bh-empty">No bookings found.</p>
      ) : (
        <div className="bh-list">
          {bookings.map((b) => (
            <div key={b._id} className="bh-card">
              <div className="bh-left">
                <h3 className="bh-parking">{b.parkingName}</h3>
                <p className="bh-date">{b.bookingDate}</p>

                <div className="bh-time">
                  <span><b>From:</b> {b.fromTime}</span>
                  <span><b>To:</b> {b.toTime}</span>
                </div>
              </div>

              <div className="bh-right">
                <div className="bh-amount">₹{b.amount}</div>

                <span
                  className={`bh-status ${
                    b.status === "Confirmed"
                      ? "confirmed"
                      : b.status === "Cancelled"
                      ? "cancelled"
                      : "reserved"
                  }`}
                >
                  {b.status}
                </span>

                {b.status === "Confirmed" && !b.feedbackSubmitted ? (
                  <button
                    className="bh-feedback-btn"
                    onClick={() => {
                      setSelectedBooking(b);
                      setShowModal(true);
                    }}
                  >
                    Give Feedback
                  </button>
                ) : b.feedbackSubmitted ? (
                  <span className="bh-feedback-done">✓ Submitted</span>
                ) : (
                  <span className="bh-feedback-na">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showModal && (
        <div className="bh-overlay">
          <div className="bh-modal">
            <h3>Rate your parking</h3>

            <div className="bh-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "star active" : "star"}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              placeholder="Write your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            <div className="bh-modal-actions">
              <button
                className="bh-submit"
                onClick={submitFeedback}
                disabled={rating === 0}
              >
                Submit
              </button>

              <button
                className="bh-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .bh-container {
          padding: 32px;
          background: linear-gradient(180deg,#f8fafc,#eef2ff);
          min-height: 100vh;
        }

        .bh-title {
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 24px;
        }

        .bh-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .bh-card {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          border-radius: 18px;
          padding: 22px 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 20px 45px rgba(0,0,0,.1);
          transition: 0.3s;
        }

        .bh-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0,0,0,.18);
        }

        .bh-parking {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .bh-date {
          font-size: 13px;
          color: #6b7280;
          margin: 4px 0;
        }

        .bh-time {
          display: flex;
          gap: 20px;
          font-size: 14px;
        }

        .bh-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .bh-amount {
          font-size: 17px;
          font-weight: 800;
        }

        .bh-status {
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
        }

        .bh-status.confirmed { background: #22c55e; }
        .bh-status.reserved { background: #f59e0b; }
        .bh-status.cancelled { background: #ef4444; }

        .bh-feedback-btn {
          background: linear-gradient(135deg,#3b82f6,#6366f1);
          color: #fff;
          border: none;
          padding: 9px 16px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
        }

        .bh-feedback-done {
          color: #16a34a;
          font-weight: 700;
        }

        .bh-feedback-na {
          color: #9ca3af;
        }

        .bh-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .bh-modal {
          background: #fff;
          padding: 30px;
          width: 340px;
          border-radius: 22px;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,.25);
        }

        .bh-stars {
          margin: 14px 0;
        }

        .star {
          font-size: 32px;
          cursor: pointer;
          color: #e5e7eb;
        }

        .star.active {
          color: #facc15;
        }

        .bh-modal textarea {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          margin-top: 10px;
        }

        .bh-modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .bh-submit {
          flex: 1;
          background: #22c55e;
          color: #fff;
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-weight: 600;
        }

        .bh-cancel {
          flex: 1;
          background: #e5e7eb;
          border: none;
          padding: 10px;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
