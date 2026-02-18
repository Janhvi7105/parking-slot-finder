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

  if (!parking) return <p style={{ padding: 30 }}>Loading...</p>;

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
    <div className="bp-page">
      <h2 className="bp-title">Book Parking Slot</h2>

      <div className="bp-card">
        {/* DETAILS */}
        <div className="bp-section">
          <h4>Parking Slot Details</h4>
          <div className="bp-row">
            <span>Parking Name</span>
            <b>{parking.name}</b>
          </div>
          <div className="bp-row">
            <span>Location</span>
            <b>{parking.location}</b>
          </div>
          <div className="bp-row">
            <span>Base Price</span>
            <b className="price">₹{parking.price}</b>
          </div>
        </div>

        {/* ADDONS */}
        <div className="bp-section">
          <h4>Add-on Services</h4>
          <label className="bp-addon">
            <input
              type="checkbox"
              checked={addonTow}
              onChange={(e) => setAddonTow(e.target.checked)}
            />
            <span>Tow Service (+₹{TOW_PRICE})</span>
          </label>
        </div>

        {/* TOTAL */}
        <div className="bp-total">
          Total Amount: <span>₹{totalAmount}</span>
        </div>

        {/* TIME */}
        <div className="bp-time">
          <div>
            <label>From Time</label>
            <input
              type="datetime-local"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            />
          </div>

          <div>
            <label>To Time</label>
            <input
              type="datetime-local"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            />
          </div>
        </div>

        <button className="bp-confirm" onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .bp-page {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
        }

        .bp-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(90deg, #16a34a, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .bp-card {
          max-width: 650px;
          background: #fff;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
          animation: fadeUp 0.4s ease;
        }

        .bp-section {
          margin-bottom: 22px;
        }

        .bp-section h4 {
          font-size: 17px;
          margin-bottom: 12px;
          color: #1f2933;
        }

        .bp-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed #e5e7eb;
          font-size: 15px;
        }

        .price {
          color: #16a34a;
        }

        .bp-addon {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          cursor: pointer;
        }

        .bp-total {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff;
          padding: 14px;
          border-radius: 14px;
          font-size: 18px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 22px;
        }

        .bp-total span {
          font-size: 20px;
        }

        .bp-time {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        .bp-time label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 6px;
          display: block;
        }

        .bp-time input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .bp-confirm {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .bp-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(34,197,94,0.45);
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
