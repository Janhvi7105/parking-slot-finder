import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    parkingId,
    name,
    location,
    basePrice,
    addons = [],
    totalAmount,
    fromTime,
    toTime,
  } = state || {};

  const [status, setStatus] = useState("idle"); // idle | processing | success

  // ✅ SAFE ADDITION — get logged-in user
let user = null;
try {
  user = JSON.parse(localStorage.getItem("user") || "null");
} catch (err) {
  console.warn("⚠️ Invalid user in localStorage");
  user = null;
}
  const amount =
    typeof totalAmount === "string"
      ? Number(totalAmount.replace("₹", "").trim())
      : Number(totalAmount);

  if (!name) {
    return <p style={{ padding: 20 }}>Invalid payment session</p>;
  }

  /* ================= LOAD RAZORPAY ================= */
  const loadRazorpay = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject("Razorpay SDK failed");
      document.body.appendChild(script);
    });

  /* ================= HANDLE PAYMENT ================= */
  const handlePay = async () => {
    try {
      if (!amount || amount <= 0) {
        alert("Invalid payment amount");
        return;
      }

      setStatus("processing");

      // ✅ load SDK
      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      // ✅ CREATE ORDER
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount }
      );

      console.log("🧾 Order response:", data);

      const order = data;

      if (!order?.id) {
        console.error("❌ Order object missing:", data);
        throw new Error("Order creation failed");
      }

      const options = {
        key: "rzp_test_SGJDv8CpSvpMfO",
        amount: order.amount,
        currency: "INR",
        name: "Parking Slot Finder",
        description: "Parking Booking",
        order_id: order.id,

        handler: async (response) => {
          try {
            console.log("💳 Razorpay success response:", response);

            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                // ✅ ONLY FIX — real logged-in user
                bookingData: {
                  userId: user?._id || "TEST_USER_ID",
                  userName: user?.name || "Test User",
                  userEmail: user?.email || "test@example.com",

                  parkingId,
                  parkingName: name,
                  location,
                  fromTime,
                  toTime,
                  addons,
                  amount,
                },
              }
            );

            console.log("✅ Verify response:", verifyRes.data);

            if (verifyRes.data.success) {
              setStatus("success");
            } else {
              throw new Error("Verification failed");
            }
          } catch (err) {
            console.error(
              "🚨 VERIFY ERROR:",
              err.response?.data || err.message
            );
            alert("Payment verification failed");
            setStatus("idle");
          }
        },

        modal: { ondismiss: () => setStatus("idle") },

        // ✅ professional prefill (no UI change)
        prefill: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          contact: "9999999999",
        },

        theme: { color: "#22c55e" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (err) => {
        console.error("❌ Razorpay payment failed:", err);
        setStatus("idle");
      });

      rzp.open();
    } catch (err) {
      console.error(
        "🚨 PAYMENT FLOW ERROR:",
        err.response?.data || err.message
      );
      alert("Payment failed. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <>
      {/* ================= PAYMENT PAGE ================= */}
      <div className="pay-page">
        <div className="pay-card">
          <h2 className="pay-title">Complete Your Payment</h2>

          <div className="info">
            <span>Parking</span>
            <b>{name}</b>
          </div>

          <div className="info">
            <span>Location</span>
            <b>{location}</b>
          </div>

          <div className="info">
            <span>Base Price</span>
            <b>₹{basePrice}</b>
          </div>

          <div className="addons">
            <span>Add-on Services</span>
            {addons.length ? (
              addons.map((a, i) => (
                <div key={i} className="addon-row">
                  <span>{a.name}</span>
                  <b>₹{a.price}</b>
                </div>
              ))
            ) : (
              <p className="muted">No add-on services selected</p>
            )}
          </div>

          <div className="total">
            <span>Total Amount</span>
            <strong>₹{amount}</strong>
          </div>

          <button className="pay-btn" onClick={handlePay}>
            Pay with Razorpay
          </button>
        </div>
      </div>

      {/* ================= PAYMENT STATUS MODAL ================= */}
      {status !== "idle" && (
        <div className="overlay">
          <div className="modal">
            {status === "processing" && (
              <>
                <div className="spinner"></div>
                <p>Processing Payment…</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="success">✓</div>
                <h3>Booking Reserved</h3>
                <p>Waiting for admin confirmation</p>

                <button
                  className="ok-btn"
                  onClick={() =>
                    navigate("/user/bookings", { replace: true })
                  }
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= STYLES (UNCHANGED) ================= */}
      <style>{`
        .pay-page {
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(180deg,#f8fafc,#eef2ff);
        }

        .pay-card {
          width:420px;
          background:#fff;
          padding:32px;
          border-radius:24px;
          box-shadow:0 30px 70px rgba(0,0,0,.18);
          animation:fadeUp .4s ease;
        }

        .pay-title {
          text-align:center;
          font-size:22px;
          font-weight:800;
          margin-bottom:22px;
          background:linear-gradient(90deg,#16a34a,#22c55e);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .info {
          display:flex;
          justify-content:space-between;
          padding:10px 0;
          font-size:15px;
          border-bottom:1px dashed #e5e7eb;
        }

        .addons {
          margin:14px 0;
        }

        .addon-row {
          display:flex;
          justify-content:space-between;
          font-size:14px;
          margin-top:6px;
        }

        .muted {
          color:#9ca3af;
          font-size:14px;
        }

        .total {
          display:flex;
          justify-content:space-between;
          margin:20px 0;
          padding:14px;
          border-radius:16px;
          background:linear-gradient(135deg,#16a34a,#22c55e);
          color:#fff;
          font-size:18px;
          font-weight:800;
        }

        .pay-btn {
          width:100%;
          padding:14px;
          border:none;
          border-radius:14px;
          font-size:16px;
          font-weight:700;
          background:linear-gradient(135deg,#22c55e,#16a34a);
          color:#fff;
          cursor:pointer;
          transition:.3s;
        }

        .pay-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 18px 40px rgba(34,197,94,.45);
        }

        .overlay {
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.6);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }

        .modal {
          background:#fff;
          padding:40px;
          border-radius:22px;
          text-align:center;
          width:320px;
        }

        .spinner {
          width:50px;
          height:50px;
          border:5px solid #eee;
          border-top:5px solid #22c55e;
          border-radius:50%;
          animation:spin 1s linear infinite;
          margin:auto;
        }

        .success {
          font-size:64px;
          color:#22c55e;
        }

        .ok-btn {
          margin-top:20px;
          padding:10px 30px;
          border:none;
          background:#6366f1;
          color:#fff;
          border-radius:12px;
          cursor:pointer;
        }

        @keyframes spin { to { transform:rotate(360deg);} }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(15px); }
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </>
  );
}