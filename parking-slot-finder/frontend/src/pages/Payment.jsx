import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    name,
    basePrice,
    addons = [],
    totalAmount,
  } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [status, setStatus] = useState("idle"); 
  // idle | processing | success

  if (!name) {
    return <p style={{ padding: 20 }}>Invalid payment session</p>;
  }

  const handlePay = () => {
    setStatus("processing");

    // ⏳ simulate payment gateway (like Google Pay)
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <>
      {/* ================= PAGE CONTENT ================= */}
      <div style={{ padding: "40px" }}>
        <h2>Complete Your Payment</h2>

        <div className="payment-card">
          <h3>Booking Summary</h3>

          <p><b>Parking Name:</b> {name}</p>
          <p><b>Base Price:</b> ₹{basePrice}</p>

          <p><b>Addon Services:</b></p>
          {addons.length > 0 ? (
            <ul>
              {addons.map((a, i) => (
                <li key={i}>{a.name} (₹{a.price})</li>
              ))}
            </ul>
          ) : (
            <p>No addon services selected.</p>
          )}

          <hr />
          <h3>Total Amount: ₹{totalAmount}</h3>

          <label>Choose Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Credit / Debit Card</option>
            <option value="upi">UPI</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash on Arrival</option>
          </select>

          <button onClick={handlePay} className="pay-btn">
            {paymentMethod === "cash" ? "Confirm Booking" : "Proceed to Pay"}
          </button>
        </div>
      </div>

      {/* ================= PAYMENT ANIMATION ================= */}
      {status !== "idle" && (
        <div className="overlay">
          <div className="modal">
            {status === "processing" && (
              <>
                <div className="pulse-ring">
                  <div className="spinner"></div>
                </div>
                <p className="status-text">Processing Payment…</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="success-circle">
                  <svg className="checkmark" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" />
                    <path
                      className="checkmark-check"
                      d="M14 27l7 7 17-17"
                    />
                  </svg>
                </div>

                <h2 className="success-title">Booking Confirmed 🎉</h2>
                <p className="success-text">
                  Payment successful. Your slot is booked!
                </p>

                <button
                  className="ok-btn"
                  onClick={() => navigate("/user/bookings")}
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= INLINE STYLES ================= */}
      <style>{`
        .payment-card {
          background: #fff;
          padding: 25px;
          width: 420px;
          border-radius: 8px;
          box-shadow: 0 0 12px rgba(0,0,0,0.1);
        }

        .payment-card select,
        .pay-btn {
          width: 100%;
          padding: 10px;
          margin-top: 12px;
        }

        .pay-btn {
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          backdrop-filter: blur(6px);
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 40px;
          border-radius: 18px;
          width: 360px;
          text-align: center;
          animation: modalPop 0.35s ease-out;
        }

        @keyframes modalPop {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .pulse-ring {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: rgba(34,197,94,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1.4s infinite;
          margin: auto;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); }
          70% { transform: scale(1.1); }
          100% { transform: scale(0.95); }
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #22c55e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-circle {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          animation: successPop 0.4s ease-out;
        }

        @keyframes successPop {
          0% { transform: scale(0.6); }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .checkmark {
          width: 52px;
          height: 52px;
          stroke: white;
          fill: none;
          stroke-width: 4;
        }

        .checkmark-circle {
          stroke-dasharray: 157;
          stroke-dashoffset: 157;
          animation: circleDraw 0.6s forwards;
        }

        .checkmark-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkDraw 0.4s 0.6s forwards;
        }

        @keyframes circleDraw { to { stroke-dashoffset: 0; } }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }

        .ok-btn {
          margin-top: 20px;
          padding: 10px 26px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
