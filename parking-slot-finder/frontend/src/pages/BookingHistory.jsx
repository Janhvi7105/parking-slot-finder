/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
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

  // ✅ BULLETPROOF SAFE PARSE (fixes "undefined is not valid JSON")
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

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = useCallback(async () => {
    try {
      if (!user?._id) {
        console.warn("⚠️ No user found in localStorage");
        setBookings([]);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/bookings/my-bookings/${user._id}`
      );

      setBookings(res.data.bookings || res.data || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  /* ================= LOAD BOOKINGS ================= */
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (state?.refresh) fetchBookings();
  }, [state, fetchBookings]);

  /* ================= FEEDBACK FUNCTION ================= */
  const submitFeedback = async () => {
    try {
      if (!selectedBooking) return;

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/bookings/feedback",
        {
          bookingId: selectedBooking._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      alert("Feedback submitted successfully");

      // CLOSE MODAL
      setShowModal(false);

      // RESET STATES
      setSelectedBooking(null);
      setRating(0);
      setComment("");

      // REFRESH BOOKINGS
      fetchBookings();

    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Feedback failed");
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

                {/* ✅ ROBUST FEEDBACK LOGIC (unchanged) */}
                {b.status?.toLowerCase() === "confirmed" &&
                !b.feedbackSubmitted ? (
                  <button
                    className="bh-feedback-btn"
                    onClick={() => {
                      console.log("🟢 Opening feedback for:", b._id);
                      setSelectedBooking(b);
                      setShowModal(true);
                    }}
                  >
                    Give Feedback
                  </button>
                ) : b.feedbackSubmitted ? (
                  <div className="bh-feedback-done">
                    ✓ Submitted

                    {b.feedback?.rating && (
                      <div style={{ marginTop: 4, fontSize: 13 }}>
                        ⭐ {b.feedback.rating}/5
                      </div>
                    )}

                    {b.feedback?.comment && (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 12,
                          color: "#6b7280",
                        }}
                      >
                        “{b.feedback.comment}”
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="bh-feedback-na">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= FEEDBACK MODAL ================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
              background: "#fff",
              padding: "30px",
              width: "90%",
              maxWidth: "340px",
              borderRadius: "22px",
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(0,0,0,.25)",
            }}
          >
            <h3>Rate your parking</h3>

            <div className="bh-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`star ${star <= rating ? "active" : ""}`}
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
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                marginTop: "10px",
              }}
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={submitFeedback}
                disabled={rating === 0}
                style={{
                  flex: 1,
                  background: "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  position: "relative",
                  zIndex: 10001,
                  cursor: "pointer",
                }}
              >
                Submit
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBooking(null);
                  setRating(0);
                  setComment("");
                }}
                style={{
                  flex: 1,
                  background: "#e5e7eb",
                  border: "none",
                  padding: "10px",
                  borderRadius: "12px",
                  position: "relative",
                  zIndex: 10001,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ YOUR STYLES — UPDATED WITH MOBILE RESPONSIVENESS */}
      <style>{`
        .bh-container {
          padding: 32px;
          background: linear-gradient(180deg,#f8fafc,#eef2ff);
          min-height: 100vh;
        }
        .bh-title { font-size: 30px; font-weight: 800; margin-bottom: 24px; }
        .bh-list { display: flex; flex-direction: column; gap: 18px; }
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
        .bh-parking { margin: 0; font-size: 18px; font-weight: 700; }
        .bh-date { font-size: 13px; color: #6b7280; margin: 4px 0; }
        .bh-time { display: flex; gap: 20px; font-size: 14px; }
        .bh-right { display: flex; align-items: center; gap: 16px; }
        .bh-amount { font-size: 17px; font-weight: 800; }
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
        .bh-feedback-done { color: #16a34a; font-weight: 700; text-align: right; }
        .bh-feedback-na { color: #9ca3af; }
        .bh-stars { margin: 14px 0; }
        .star { font-size: 32px; cursor: pointer; color: #e5e7eb; }
        .star.active { color: #facc15; }

        /* Responsive - Tablet */
        @media (max-width: 768px) {
          .bh-container {
            padding: 16px;
          }

          .bh-title {
            font-size: 24px;
            text-align: center;
          }

          .bh-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
            padding: 18px;
          }

          .bh-right {
            width: 100%;
            flex-wrap: wrap;
            justify-content: flex-start;
            gap: 10px;
          }

          .bh-time {
            flex-direction: column;
            gap: 6px;
          }

          .bh-feedback-done {
            text-align: left;
          }
        }

        /* Responsive - iPhone / Small Screens */
        @media (max-width: 480px) {
          .bh-title {
            font-size: 22px;
          }

          .bh-parking {
            font-size: 16px;
          }

          .bh-amount {
            font-size: 15px;
          }

          .bh-status {
            font-size: 11px;
            padding: 6px 12px;
          }

          .bh-feedback-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}