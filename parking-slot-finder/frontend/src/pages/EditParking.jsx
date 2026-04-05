import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditParking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
  });

  const fetchParking = useCallback(async () => {
    const res = await axios.get(
      `http://localhost:5000/api/parking/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setForm(res.data);
  }, [id, token]);

  useEffect(() => {
    fetchParking();
  }, [fetchParking]);

  const updateParking = async () => {
    await axios.put(
      `http://localhost:5000/api/parking/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/admin/manage-parking");
  };

  return (
    <div className="ep-wrapper">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="ep-container">
        {/* Header Section */}
        <div className="ep-header">
          <div className="header-icon-wrapper">
            <div className="header-icon">✏️</div>
          </div>
          <div>
            <h1 className="ep-title">Edit Parking Slot</h1>
            <p className="ep-subtitle">Update parking details and information</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="ep-card">
          <div className="form-header">
            <div className="form-header-icon">🅿️</div>
            <div>
              <h3>Parking Information</h3>
              <p>Modify the details of this parking location</p>
            </div>
          </div>

          <div className="ep-grid">
            <div className="ep-field">
              <label>
                <span className="field-icon">🏢</span>
                Parking Name
              </label>
              <input
                placeholder="Enter parking name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="ep-field">
              <label>
                <span className="field-icon">📍</span>
                Location
              </label>
              <input
                placeholder="Enter location address"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>

            <div className="ep-field">
              <label>
                <span className="field-icon">📊</span>
                Capacity
              </label>
              <input
                placeholder="Number of slots"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
              />
            </div>

            <div className="ep-field">
              <label>
                <span className="field-icon">💰</span>
                Price (₹)
              </label>
              <input
                placeholder="Price per hour"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>
          </div>

          {/* Preview Card */}
          <div className="preview-card">
            <div className="preview-header">
              <span>📋 Preview</span>
              <span className="preview-badge">Live Preview</span>
            </div>
            <div className="preview-content">
              <div className="preview-item">
                <span className="preview-label">Name:</span>
                <span className="preview-value">{form.name || "Not set"}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Location:</span>
                <span className="preview-value">{form.location || "Not set"}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Capacity:</span>
                <span className="preview-value">{form.capacity || "Not set"} slots</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Price:</span>
                <span className="preview-value price-preview">₹{form.price || "0"}/hr</span>
              </div>
            </div>
          </div>

          <div className="ep-actions">
            <button className="ep-update" onClick={updateParking}>
              <span>💾</span>
              <span>Update Parking</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              className="ep-cancel"
              onClick={() => navigate("/admin/manage-parking")}
            >
              <span>✕</span>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ep-wrapper {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
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

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.25), rgba(255,255,255,0));
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 600px;
          height: 600px;
          bottom: -250px;
          left: -250px;
          animation-delay: 5s;
        }

        .orb-3 {
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

        .ep-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 32px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .ep-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 24px 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .header-icon-wrapper {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(16,185,129,0.3);
        }

        .header-icon {
          font-size: 32px;
        }

        .ep-title {
          font-size: 32px;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .ep-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
        }

        /* Form Card */
        .ep-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
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

        .form-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-header-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .form-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .form-header p {
          font-size: 13px;
          color: #64748b;
        }

        /* Form Grid */
        .ep-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .ep-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ep-field label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .field-icon {
          font-size: 16px;
        }

        .ep-field input {
          padding: 14px 18px;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
          background: #ffffff;
        }

        .ep-field input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
        }

        .ep-field input::placeholder {
          color: #cbd5e1;
        }

        /* Preview Card */
        .preview-card {
          background: linear-gradient(135deg, #f8fafc, #ffffff);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 32px;
          border: 1px solid #e2e8f0;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .preview-header span:first-child {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }

        .preview-badge {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .preview-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .preview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .preview-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .preview-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .price-preview {
          color: #16a34a;
          font-size: 16px;
        }

        /* Action Buttons */
        .ep-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ep-update {
          flex: 1;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 14px 28px;
          border: none;
          border-radius: 60px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ep-update::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .ep-update:hover::before {
          width: 300px;
          height: 300px;
        }

        .ep-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16,185,129,0.4);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .ep-update:hover .btn-arrow {
          transform: translateX(6px);
        }

        .ep-cancel {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          padding: 14px 28px;
          border: none;
          border-radius: 60px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .ep-cancel:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ep-container {
            padding: 20px 16px;
          }

          .ep-header {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .ep-title {
            font-size: 24px;
          }

          .ep-card {
            padding: 24px;
          }

          .ep-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .preview-content {
            grid-template-columns: 1fr;
          }

          .ep-actions {
            flex-direction: column;
          }

          .ep-update, .ep-cancel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}