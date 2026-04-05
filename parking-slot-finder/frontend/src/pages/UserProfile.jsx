import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function UserProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  /* ================= LOAD USER PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
        password: "",
      });
    } catch (err) {
      alert("Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully ✅");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      alert("Profile update failed");
    }
  };

  return (
    <div className="profile-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-icon">👤</div>
            <div className="avatar-ring"></div>
          </div>
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Manage your account details and preferences</p>
        </div>

        <form className="profile-card" onSubmit={handleSubmit}>
          {/* Name Field */}
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
              required
              placeholder="Enter your full name"
              className="field-input"
            />
          </div>

          {/* Email Field */}
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
              required
              placeholder="Enter your email"
              className="field-input"
            />
          </div>

          {/* Password Field */}
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
            <div className="field-hint">Password must be at least 6 characters</div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="update-btn">
              <span className="btn-icon">💾</span>
              <span>Update Profile</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Profile Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">100%</div>
              <div className="stat-label">Profile Complete</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">Verified</div>
              <div className="stat-label">Account Status</div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .profile-page {
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
          background: radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0));
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

        .profile-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .profile-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .profile-avatar {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;
        }

        .avatar-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: 0 20px 40px rgba(16,185,129,0.3);
          position: relative;
          z-index: 2;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .avatar-ring {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          border: 3px solid rgba(16,185,129,0.3);
          border-radius: 50%;
          animation: ring 2s infinite;
        }

        @keyframes ring {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0;
          }
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
          padding: 40px;
          border-radius: 32px;
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

        /* Fields */
        .field {
          margin-bottom: 28px;
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .field-icon {
          font-size: 18px;
        }

        .field-label label {
          font-size: 14px;
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
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16,185,129,0.1);
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

        /* Form Actions */
        .form-actions {
          margin: 24px 0 20px;
        }

        .update-btn {
          width: 100%;
          background: linear-gradient(135deg, #10b981, #059669);
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
          position: relative;
          overflow: hidden;
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
          box-shadow: 0 20px 40px rgba(16,185,129,0.4);
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

        /* Profile Stats */
        .profile-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #f1f5f9;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: #10b981;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: #e2e8f0;
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

          .avatar-icon {
            width: 80px;
            height: 80px;
            font-size: 36px;
          }

          .field-input {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}