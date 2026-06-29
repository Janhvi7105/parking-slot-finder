import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API from "../api";

export default function AdminProfile() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  /* ================= LOAD PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API}/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        name: res.data.name,
        email: res.data.email,
        password: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      await axios.put(
        `${API}/admin/profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully ✅");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="admin-profile-wrapper">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="header-badge">Admin Access</div>
          <h2 className="profile-title">Admin Profile</h2>
          <p className="profile-subtitle">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section with Animation */}
          <div className="avatar-section">
            <div className="avatar-ring"></div>
            <div className="profile-avatar">
              {form.name ? form.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="avatar-status">
              <span className="status-dot"></span>
              Active
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            <div className="field">
              <div className="field-label">
                <span className="field-icon">👤</span>
                <label>Full Name</label>
              </div>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className="field-input"
              />
            </div>

            <div className="field">
              <div className="field-label">
                <span className="field-icon">📧</span>
                <label>Email Address</label>
              </div>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter your email"
                className="field-input"
              />
            </div>

            <div className="field">
              <div className="field-label">
                <span className="field-icon">🔒</span>
                <label>New Password</label>
              </div>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="field-input"
              />
              <div className="field-hint">
                Password must be at least 6 characters
              </div>
            </div>
          </div>

          {/* Admin Stats */}
          <div className="admin-stats">
            <div className="stat-item">
              <div className="stat-value">Admin</div>
              <div className="stat-label">Role</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">Full Access</div>
              <div className="stat-label">Permissions</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">Active</div>
              <div className="stat-label">Status</div>
            </div>
          </div>

          {/* Action Buttons */}
          <button className="update-btn" onClick={updateProfile}>
            <span className="btn-icon">💾</span>
            <span>Update Profile</span>
            <span className="btn-arrow">→</span>
          </button>

          {/* Security Notice */}
          <div className="security-notice">
            <span className="security-icon">🔐</span>
            <div className="security-text">
              <strong>Secure Connection</strong>
              <p>Your information is encrypted and secure</p>
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

        .admin-profile-wrapper {
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
          left: 20%;
          animation-delay: 10s;
        }

        .orb-4 {
          width: 250px;
          height: 250px;
          bottom: 20%;
          right: 10%;
          animation-delay: 15s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(10deg); }
        }

        .profile-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 32px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .profile-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .header-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 6px 16px;
          border-radius: 40px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .profile-title {
          font-size: 36px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.2);
          letter-spacing: -0.02em;
        }

        .profile-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        /* Profile Card */
        .profile-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 40px;
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

        /* Avatar Section */
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
          position: relative;
        }

        .avatar-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110px;
          height: 110px;
          border: 2px solid rgba(16,185,129,0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.5;
          }
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 42px;
          font-weight: 700;
          color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          position: relative;
          z-index: 2;
        }

        .avatar-status {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #10b981;
          padding: 4px 12px;
          border-radius: 40px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          margin-top: 12px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Form Fields */
        .form-fields {
          margin-bottom: 24px;
        }

        .field {
          margin-bottom: 24px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .field-icon {
          font-size: 16px;
        }

        .field-label label {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .field-input {
          width: 100%;
          padding: 14px 18px;
          font-size: 15px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          outline: none;
          background: #ffffff;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .field-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
        }

        .field-input::placeholder {
          color: #cbd5e1;
        }

        .field-hint {
          margin-top: 6px;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Admin Stats */
        .admin-stats {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #f8fafc;
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 28px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 800;
          color: #667eea;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: #e2e8f0;
        }

        /* Update Button */
        .update-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 60px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .update-btn::before {
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

        .update-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .update-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(102,126,234,0.4);
        }

        .btn-icon {
          font-size: 18px;
          position: relative;
          z-index: 1;
        }

        .btn-arrow {
          transition: transform 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .update-btn:hover .btn-arrow {
          transform: translateX(6px);
        }

        /* Security Notice */
        .security-notice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f0fdf4;
          border-radius: 16px;
          border: 1px solid #bbf7d0;
        }

        .security-icon {
          font-size: 24px;
        }

        .security-text strong {
          display: block;
          font-size: 12px;
          color: #166534;
          margin-bottom: 2px;
        }

        .security-text p {
          font-size: 10px;
          color: #15803d;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .profile-container {
            padding: 20px 16px;
          }

          .profile-title {
            font-size: 28px;
          }

          .profile-card {
            padding: 28px 24px;
          }

          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 34px;
          }

          .avatar-ring {
            width: 90px;
            height: 90px;
          }

          .field-input {
            padding: 12px 16px;
          }

          .admin-stats {
            flex-direction: column;
            gap: 12px;
          }

          .stat-divider {
            width: 100%;
            height: 1px;
          }
        }
      `}</style>
    </div>
  );
}