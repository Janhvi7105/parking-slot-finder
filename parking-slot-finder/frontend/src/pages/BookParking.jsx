import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookParking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parking, setParking] = useState(null);
  const [addonTow, setAddonTow] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const TOW_PRICE = 300;

  /* ================= FETCH PARKING ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/parking/${id}`)
      .then((res) => setParking(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!parking) return <p>Loading...</p>;

  const totalAmount = parking.price + (addonTow ? TOW_PRICE : 0);

  /* ================= CONFIRM BOOKING ================= */
  const handleConfirm = () => {
    if (!fromTime || !toTime) {
      alert("Please select From Time and To Time");
      return;
    }

    navigate("/user/payment", {
      state: {
        parkingId: parking._id,
        name: parking.name,
        location: parking.location,
        basePrice: parking.price,
        addons: addonTow
          ? [{ name: "Tow", price: TOW_PRICE }]
          : [],
        totalAmount,
        fromTime,
        toTime,
      },
    });
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px" }}>
      <h2>Book Parking Slot</h2>

      <div style={card}>
        <h4>Parking Slot Details</h4>

        <p><b>Parking Name:</b> {parking.name}</p>
        <p><b>Location:</b> {parking.location}</p>
        <p><b>Base Price:</b> ₹{parking.price}</p>

        <hr />

        <h4>Select Addon Services</h4>

        <label>
          <input
            type="checkbox"
            checked={addonTow}
            onChange={(e) => setAddonTow(e.target.checked)}
          />
          &nbsp; Tow (₹{TOW_PRICE})
        </label>

        <hr />

        <p><b>Total Amount:</b> ₹{totalAmount}</p>

        <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
          <div>
            <label>From Time</label><br />
            <input
              type="datetime-local"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </div>

          <div>
            <label>To Time</label><br />
            <input
              type="datetime-local"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleConfirm} style={confirmBtn}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
};

const confirmBtn = {
  marginTop: "20px",
  background: "#22c55e",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

