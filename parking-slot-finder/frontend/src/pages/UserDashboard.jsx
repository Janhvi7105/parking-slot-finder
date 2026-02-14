export default function UserDashboard() {
  return (
    <div>

      {/* PAGE TITLE */}
      <h2 style={{ marginBottom: "20px" }}>User Dashboard</h2>

      {/* CARD */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Recent Bookings</h3>

        {/* TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px"
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
              <th style={{ padding: "10px" }}>Parking Name</th>
              <th style={{ padding: "10px" }}>Booking Date</th>
              <th style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>Kuvempunagar Complex</td>
              <td style={{ padding: "10px" }}>2025-04-18 18:58:12</td>
              <td style={{ padding: "10px" }}>
                <span
                  style={{
                    background: "#1abc9c",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}
                >
                  Confirmed
                </span>
              </td>
            </tr>

            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "10px" }}>DreamBuzz Solutions</td>
              <td style={{ padding: "10px" }}>2025-04-14 12:06:40</td>
              <td style={{ padding: "10px" }}>
                <span
                  style={{
                    background: "#1abc9c",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}
                >
                  Confirmed
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ACTION BUTTON */}
        <button
          style={{
            background: "#3498db",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Find Parking
        </button>
      </div>

    </div>
  );
}
