import axios from "axios";
import { useEffect, useState } from "react";

export default function Reservations() {
  const [bookings, setBookings] = useState([]);

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

  return (
    <div style={{ padding: "30px" }}>
      <h2>Reservations</h2>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>User</th>
            <th>Parking</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>{b.userName}</td>
              <td>{b.parkingName}</td>
              <td>₹{b.amount}</td>
              <td>{b.status}</td>

              <td>
                {b.status === "Reserved" && (
                  <>
                    <button
                      onClick={() => confirmBooking(b._id)}
                      style={{
                        marginRight: 8,
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => cancelBooking(b._id)}
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {b.status !== "Reserved" && (
                  <span style={{ color: "#9ca3af" }}>
                    Status Locked
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
