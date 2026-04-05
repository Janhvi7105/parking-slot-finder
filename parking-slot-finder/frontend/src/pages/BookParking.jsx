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

  // ⭐ NEW — vehicle state (default 2-wheeler)
  const [vehicleType, setVehicleType] = useState("2-wheeler");

  const TOW_PRICE = 300;

  // ⭐ NEW — multiplier map
  const vehicleMultiplier = {
    "2-wheeler": 1,
    "4-wheeler": 1.5,
    bus: 3,
  };

  /* ================= FETCH PARKING ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/parking/${id}`)
      .then((res) => setParking(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!parking) return (
    <div className="bp-loading">
      <div className="loading-spinner"></div>
      <p>Loading parking details...</p>
    </div>
  );

  /* ================= PRICE CALCULATION ================= */
  const hours =
    fromTime && toTime
      ? Math.max(
          1,
          (new Date(toTime) - new Date(fromTime)) / (1000 * 60 * 60)
        )
      : 1;

  const vehiclePrice =
    parking.price * (vehicleMultiplier[vehicleType] || 1);

  const totalAmount =
    Math.round(vehiclePrice * hours) +
    (addonTow ? TOW_PRICE : 0);

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
        vehicleType,
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
      {/* Minimalist Background */}
      <div className="bp-background">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="bp-wrapper">
        {/* Left Side - Parking Info */}
        <div className="bp-info-panel">
          <div className="info-card">
            <div className="info-header">
              <div className="info-icon">🅿️</div>
              <h2>{parking.name}</h2>
              <p className="info-location">{parking.location}</p>
            </div>
            
            <div className="info-details">
              <div className="detail-row">
                <span className="detail-label">Base Price</span>
                <span className="detail-value">₹{parking.price}<small>/hour</small></span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Capacity</span>
                <span className="detail-value">{parking.capacity} slots</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Vehicle Type</span>
                <span className="detail-value vehicle-type">
                  {vehicleType === "2-wheeler" && "🏍️ 2 Wheeler"}
                  {vehicleType === "4-wheeler" && "🚗 4 Wheeler"}
                  {vehicleType === "bus" && "🚌 Bus"}
                </span>
              </div>
            </div>

            <div className="price-preview">
              <div className="preview-row">
                <span>Subtotal</span>
                <span>₹{Math.round(vehiclePrice * hours)}</span>
              </div>
              {addonTow && (
                <div className="preview-row">
                  <span>Towing Service</span>
                  <span>+₹{TOW_PRICE}</span>
                </div>
              )}
              <div className="preview-total">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <div className="bp-form-panel">
          <div className="form-card">
            <h3>Complete Your Booking</h3>
            <p className="form-subtitle">Fill in the details to secure your spot</p>

            {/* Vehicle Selection */}
            <div className="form-group">
              <label>Select Vehicle Type</label>
              <div className="vehicle-group">
                <button
                  className={`vehicle-btn ${vehicleType === "2-wheeler" ? "active" : ""}`}
                  onClick={() => setVehicleType("2-wheeler")}
                >
                  <span>🏍️</span>
                  <span>2 Wheeler</span>
                  <span className="multiplier">{vehicleMultiplier["2-wheeler"]}x</span>
                </button>
                <button
                  className={`vehicle-btn ${vehicleType === "4-wheeler" ? "active" : ""}`}
                  onClick={() => setVehicleType("4-wheeler")}
                >
                  <span>🚗</span>
                  <span>4 Wheeler</span>
                  <span className="multiplier">{vehicleMultiplier["4-wheeler"]}x</span>
                </button>
                <button
                  className={`vehicle-btn ${vehicleType === "bus" ? "active" : ""}`}
                  onClick={() => setVehicleType("bus")}
                >
                  <span>🚌</span>
                  <span>Bus</span>
                  <span className="multiplier">{vehicleMultiplier["bus"]}x</span>
                </button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="form-group">
              <label>Select Duration</label>
              <div className="time-group">
                <div className="time-input-wrapper">
                  <span className="input-icon">📅</span>
                  <input
                    type="datetime-local"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="time-input"
                  />
                </div>
                <div className="time-arrow">→</div>
                <div className="time-input-wrapper">
                  <span className="input-icon">📅</span>
                  <input
                    type="datetime-local"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className="time-input"
                  />
                </div>
              </div>
              {fromTime && toTime && (
                <div className="duration-display">
                  <span>⏱️ Duration: {Math.ceil(hours)} hour{Math.ceil(hours) !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Add-ons */}
            <div className="form-group">
              <label>Add-on Services</label>
              <label className="addon-checkbox-label">
                <input
                  type="checkbox"
                  checked={addonTow}
                  onChange={(e) => setAddonTow(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <div className="addon-info">
                  <span className="addon-title">Tow Service</span>
                  <span className="addon-desc">24/7 roadside assistance</span>
                </div>
                <span className="addon-price">+₹{TOW_PRICE}</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleConfirm}>
                Confirm Booking
                <span className="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .bp-page {
          min-height: 100vh;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f7fa;
        }

        /* Background */
        .bp-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
        }

        .bg-gradient {
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 10% 20%, rgba(0,0,0,0.02) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        /* Wrapper */
        .bp-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          min-height: 100vh;
          align-items: center;
        }

        /* Loading State */
        .bp-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f5f7fa;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Left Panel - Parking Info */
        .bp-info-panel {
          animation: slideLeft 0.5s ease;
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .info-card {
          background: white;
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .info-header {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .info-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .info-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .info-location {
          font-size: 14px;
          color: #64748b;
        }

        .info-details {
          margin-bottom: 28px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px dashed #e2e8f0;
        }

        .detail-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
        }

        .detail-value small {
          font-size: 11px;
          font-weight: 400;
          color: #94a3b8;
        }

        .vehicle-type {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .price-preview {
          background: linear-gradient(135deg, #f8fafc, #ffffff);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #475569;
        }

        .preview-total {
          display: flex;
          justify-content: space-between;
          padding: 12px 0 0 0;
          margin-top: 8px;
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          border-top: 2px solid #e2e8f0;
        }

        .preview-total span:last-child {
          color: #10b981;
          font-size: 24px;
        }

        /* Right Panel - Form */
        .bp-form-panel {
          animation: slideRight 0.5s ease;
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .form-card {
          background: white;
          border-radius: 32px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .form-card h3 {
          font-size: 24px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .form-subtitle {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 28px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        /* Vehicle Buttons */
        .vehicle-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .vehicle-btn {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 14px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .vehicle-btn span:first-child {
          font-size: 28px;
        }

        .vehicle-btn span:nth-child(2) {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .multiplier {
          font-size: 10px;
          color: #94a3b8;
        }

        .vehicle-btn:hover {
          transform: translateY(-2px);
          border-color: #10b981;
        }

        .vehicle-btn.active {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #10b981;
        }

        .vehicle-btn.active span:not(.multiplier) {
          color: white;
        }

        .vehicle-btn.active .multiplier {
          color: rgba(255,255,255,0.8);
        }

        /* Time Inputs */
        .time-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-input-wrapper {
          flex: 1;
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
        }

        .time-input {
          width: 100%;
          padding: 14px 14px 14px 42px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .time-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }

        .time-arrow {
          font-size: 20px;
          color: #94a3b8;
        }

        .duration-display {
          margin-top: 12px;
          padding: 8px 16px;
          background: #fef3c7;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #d97706;
          display: inline-block;
        }

        /* Addon Checkbox */
        .addon-checkbox-label {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .addon-checkbox-label:hover {
          background: #f1f5f9;
        }

        .addon-checkbox-label input {
          display: none;
        }

        .checkbox-custom {
          width: 22px;
          height: 22px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          position: relative;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .addon-checkbox-label input:checked + .checkbox-custom {
          background: #10b981;
          border-color: #10b981;
        }

        .addon-checkbox-label input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
        }

        .addon-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .addon-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .addon-desc {
          font-size: 11px;
          color: #64748b;
        }

        .addon-price {
          font-size: 14px;
          font-weight: 700;
          color: #10b981;
        }

        /* Action Buttons */
        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 28px;
        }

        .btn-cancel {
          flex: 1;
          background: #f1f5f9;
          border: none;
          padding: 14px 20px;
          border-radius: 60px;
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .btn-confirm {
          flex: 2;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          padding: 14px 24px;
          border-radius: 60px;
          font-size: 14px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16,185,129,0.4);
        }

        .btn-icon {
          transition: transform 0.2s ease;
        }

        .btn-confirm:hover .btn-icon {
          transform: translateX(6px);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .bp-wrapper {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 24px;
          }

          .bg-gradient {
            width: 100%;
            clip-path: none;
            opacity: 0.05;
          }

          .bp-info-panel, .bp-form-panel {
            animation: none;
          }
        }

        @media (max-width: 640px) {
          .vehicle-group {
            grid-template-columns: 1fr;
          }

          .time-group {
            flex-direction: column;
          }

          .time-arrow {
            transform: rotate(90deg);
          }

          .form-actions {
            flex-direction: column;
          }

          .info-card, .form-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}