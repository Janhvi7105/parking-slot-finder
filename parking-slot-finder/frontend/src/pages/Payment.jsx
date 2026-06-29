import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API from "../api";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    parkingId,
    name,
    location,
    basePrice,
    vehicleType, // ⭐ ADDED (safe)
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
        `${API}/payment/create-order`,
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
              `${API}/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

                // ✅ booking data
                bookingData: {
                  userId: user?._id || "TEST_USER_ID",
                  userName: user?.name || "Test User",
                  userEmail: user?.email || "test@example.com",

                  parkingId,
                  parkingName: name,
                  location,
                  vehicleType, // ⭐ ADDED (critical)

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
      <div className="pay-page">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="gradient-sphere"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
        </div>

        <div className="pay-container">
          <div className="pay-header">
            <div className="pay-icon">💳</div>
            <h2 className="pay-title">Secure Payment</h2>
            <p className="pay-subtitle">Complete your booking with secure payment</p>
          </div>

          <div className="pay-card">
            {/* Booking Summary */}
            <div className="summary-section">
              <div className="section-header">
                <span className="section-icon">📋</span>
                <h4>Booking Summary</h4>
              </div>
              
              <div className="info-grid">
                <div className="info-row">
                  <div className="info-label">
                    <span>🏢</span>
                    <span>Parking</span>
                  </div>
                  <div className="info-value">{name}</div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">
                    <span>📍</span>
                    <span>Location</span>
                  </div>
                  <div className="info-value">{location}</div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">
                    <span>🚗</span>
                    <span>Vehicle Type</span>
                  </div>
                  <div className="info-value vehicle-badge">
                    {vehicleType === "2-wheeler" && "🏍️ 2 Wheeler"}
                    {vehicleType === "4-wheeler" && "🚗 4 Wheeler"}
                    {vehicleType === "bus" && "🚌 Bus"}
                    {!vehicleType && "Not specified"}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">
                    <span>⏰</span>
                    <span>Duration</span>
                  </div>
                  <div className="info-value">
                    {fromTime && toTime ? (
                      <>
                        {new Date(fromTime).toLocaleDateString()}
                        <br />
                        <small>{new Date(fromTime).toLocaleTimeString()} - {new Date(toTime).toLocaleTimeString()}</small>
                      </>
                    ) : "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-section">
              <div className="section-header">
                <span className="section-icon">💰</span>
                <h4>Price Breakdown</h4>
              </div>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Base Price</span>
                  <span>₹{basePrice}/hr</span>
                </div>
                
                {addons.length > 0 && (
                  <div className="addons-list">
                    <div className="price-item addon-header">
                      <span>Add-on Services</span>
                      <span></span>
                    </div>
                    {addons.map((a, i) => (
                      <div key={i} className="price-item addon-item">
                        <span>{a.name}</span>
                        <span>+₹{a.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="total-amount">
                <div className="total-label">
                  <span>Total Amount</span>
                  <span className="total-badge">Including GST</span>
                </div>
                <div className="total-value">₹{amount}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="payment-method">
              <div className="section-header">
                <span className="section-icon">🔒</span>
                <h4>Payment Method</h4>
              </div>
              
              <div className="method-card">
                <div className="method-icon">💳</div>
                <div className="method-info">
                  <div className="method-name">Razorpay Secure Payment</div>
                  <div className="method-desc">Credit/Debit Card • UPI • NetBanking • Wallet</div>
                </div>
                <div className="secure-badge">SSL Secure</div>
              </div>
            </div>

            <button className="pay-btn" onClick={handlePay} disabled={status === "processing"}>
              {status === "processing" ? (
                <>
                  <div className="btn-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>Pay ₹{amount}</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            <div className="secure-footer">
              <span>🔒</span>
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Modal */}
      {status !== "idle" && (
        <div className="modal-overlay">
          <div className="status-modal">
            {status === "processing" && (
              <div className="processing-state">
                <div className="pulse-ring"></div>
                <div className="processing-icon">💳</div>
                <h3>Processing Payment</h3>
                <p>Please wait while we secure your booking...</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="success-state">
                <div className="success-animation">
                  <div className="success-circle">
                    <div className="success-checkmark">✓</div>
                  </div>
                </div>
                <h3>Payment Successful!</h3>
                <p>Your booking has been confirmed and is pending admin approval.</p>
                <div className="booking-details">
                  <div className="detail-item">
                    <span>Booking ID</span>
                    <span className="detail-id">{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                  </div>
                </div>
                <button className="success-btn" onClick={() => navigate("/user/bookings", { replace: true })}>
                  View My Bookings
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .pay-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          padding: 40px 20px;
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

        .gradient-sphere {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0));
          animation: float 20s infinite ease-in-out;
        }

        .gradient-sphere:first-child {
          width: 400px;
          height: 400px;
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .sphere-2 {
          width: 600px;
          height: 600px;
          bottom: -250px;
          left: -250px;
          animation-delay: 5s;
        }

        .sphere-3 {
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

        .pay-container {
          max-width: 550px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .pay-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .pay-icon {
          font-size: 60px;
          margin-bottom: 12px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .pay-title {
          font-size: 36px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
          letter-spacing: -0.02em;
        }

        .pay-subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        /* Main Card */
        .pay-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
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

        /* Sections */
        .summary-section, .price-section, .payment-method {
          margin-bottom: 28px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f1f5f9;
        }

        .section-icon {
          font-size: 20px;
        }

        .section-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        /* Info Grid */
        .info-grid {
          background: #f8fafc;
          border-radius: 20px;
          padding: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          display: flex;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          text-align: right;
        }

        .vehicle-badge {
          background: linear-gradient(135deg, #22c55e20, #16a34a20);
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
        }

        /* Price Breakdown */
        .price-breakdown {
          background: #f8fafc;
          border-radius: 20px;
          padding: 16px;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #475569;
        }

        .addon-header {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #cbd5e1;
          font-weight: 600;
          color: #1e293b;
        }

        .addon-item {
          padding-left: 16px;
          font-size: 13px;
          color: #16a34a;
        }

        .total-amount {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 20px;
          padding: 20px;
          margin-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .total-label span:first-child {
          font-size: 16px;
          font-weight: 700;
          color: white;
        }

        .total-badge {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .total-value {
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        /* Payment Method */
        .method-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #f8fafc, #ffffff);
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .method-card:hover {
          border-color: #22c55e;
          transform: translateX(4px);
        }

        .method-icon {
          font-size: 36px;
        }

        .method-info {
          flex: 1;
        }

        .method-name {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .method-desc {
          font-size: 11px;
          color: #64748b;
        }

        .secure-badge {
          background: #22c55e20;
          color: #16a34a;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        /* Pay Button */
        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 60px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 24px 0 16px;
        }

        .pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(34,197,94,0.4);
        }

        .pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .pay-btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(6px);
        }

        .secure-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #94a3b8;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .status-modal {
          background: white;
          border-radius: 32px;
          padding: 48px 32px;
          text-align: center;
          width: 380px;
          animation: modalSlide 0.4s ease;
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Processing State */
        .processing-state {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .pulse-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(34,197,94,0.2);
          position: relative;
          animation: pulse 1.5s infinite;
        }

        .processing-icon {
          position: absolute;
          font-size: 40px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .processing-state h3 {
          margin: 20px 0 8px;
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
        }

        .processing-state p {
          color: #64748b;
          font-size: 14px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 4px;
          margin-top: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 4px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        /* Success State */
        .success-state h3 {
          margin: 20px 0 8px;
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
        }

        .success-state p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .success-animation {
          margin: 0 auto;
          width: 80px;
          height: 80px;
        }

        .success-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleUp 0.4s ease;
        }

        .success-checkmark {
          font-size: 48px;
          color: white;
          font-weight: 800;
        }

        @keyframes scaleUp {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .booking-details {
          background: #f8fafc;
          border-radius: 16px;
          padding: 12px;
          margin: 16px 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
        }

        .detail-id {
          font-family: monospace;
          font-weight: 700;
          color: #22c55e;
        }

        .success-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 14px 24px;
          border: none;
          border-radius: 60px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .success-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102,126,234,0.4);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .pay-card {
            padding: 24px;
          }

          .pay-title {
            font-size: 28px;
          }

          .total-value {
            font-size: 22px;
          }

          .status-modal {
            width: 90%;
            padding: 32px 24px;
          }
        }
      `}</style>
    </>
  );
}