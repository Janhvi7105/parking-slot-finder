import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAdminStats } from "../context/AdminStatsContext";

export default function AdminDashboard() {
  const { refreshKey } = useAdminStats();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    availableSlots: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH STATS ================= */
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [token]);

  /* ================= FETCH FEEDBACK ================= */
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/admin/feedback",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedbacks(res.data.feedbacks || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
    fetchFeedback();
  }, [fetchStats, fetchFeedback, refreshKey]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="admin-dashboard">
      {/* Premium Animated Background */}
      <div className="premium-bg">
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        <div className="glow-orb glow-1"></div>
        <div className="glow-orb glow-2"></div>
        <div className="glow-orb glow-3"></div>
      </div>

      <div className="dashboard-container">
        {/* Premium Header */}
        <div className="premium-header">
          <div className="header-gradient-bar"></div>
          <div className="header-content">
            <div className="brand-section">
              <div className="brand-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <h1 className="premium-title">Admin Dashboard</h1>
                <p className="premium-subtitle">Control Panel • Parking Management</p>
              </div>
            </div>
            <div className="header-actions">
              <div className="notification-badge">
                <span>🔔</span>
                <span className="badge-dot"></span>
              </div>
              <div className="admin-profile">
                <div className="profile-avatar">A</div>
                <span>Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Premium Design */}
        <div className="premium-stats">
          <div className="stat-card-premium users-premium">
            <div className="stat-card-inner">
              <div className="stat-front">
                <div className="stat-icon-premium">👥</div>
                <div className="stat-info-premium">
                  <span className="stat-value-premium">{stats.totalUsers}</span>
                  <span className="stat-label-premium">Total Users</span>
                </div>
              </div>
              <div className="stat-back">
                <div className="stat-trend-premium">
                  <span className="trend-up">↑ 12%</span>
                  <span>Growth</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card-premium bookings-premium">
            <div className="stat-card-inner">
              <div className="stat-front">
                <div className="stat-icon-premium">📊</div>
                <div className="stat-info-premium">
                  <span className="stat-value-premium">{stats.totalBookings}</span>
                  <span className="stat-label-premium">Total Bookings</span>
                </div>
              </div>
              <div className="stat-back">
                <div className="stat-trend-premium">
                  <span className="trend-up">↑ 8%</span>
                  <span>Increase</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card-premium slots-premium">
            <div className="stat-card-inner">
              <div className="stat-front">
                <div className="stat-icon-premium">🅿️</div>
                <div className="stat-info-premium">
                  <span className="stat-value-premium">{stats.availableSlots}</span>
                  <span className="stat-label-premium">Available Slots</span>
                </div>
              </div>
              <div className="stat-back">
                <div className="stat-trend-premium">
                  <span className="trend-neutral">→ 3</span>
                  <span>Reserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-grid">
          <div className="analytics-card revenue-analytics">
            <div className="analytics-header">
              <h3>Revenue Analytics</h3>
              <div className="live-indicator">
                <span className="live-pulse"></span>
                Live
              </div>
            </div>
            <div className="analytics-content">
              <div className="metric-large">
                <span className="metric-value">₹{(stats.totalBookings * 150).toLocaleString()}</span>
                <span className="metric-label">Total Revenue</span>
              </div>
              <div className="metrics-row">
                <div className="metric">
                  <span className="metric-number">₹150</span>
                  <span className="metric-desc">Avg. Booking</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric">
                  <span className="metric-number success">94%</span>
                  <span className="metric-desc">Completion</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric">
                  <span className="metric-number">+28%</span>
                  <span className="metric-desc">Growth</span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-card performance-analytics">
            <div className="analytics-header">
              <h3>Quick Stats</h3>
              <span className="info-icon">ℹ️</span>
            </div>
            <div className="performance-stats">
              <div className="performance-item">
                <div className="performance-bar" style={{ width: '78%' }}></div>
                <div className="performance-info">
                  <span>Booking Rate</span>
                  <span>78%</span>
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-bar" style={{ width: '92%' }}></div>
                <div className="performance-info">
                  <span>User Satisfaction</span>
                  <span>92%</span>
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-bar" style={{ width: '65%' }}></div>
                <div className="performance-info">
                  <span>Slot Utilization</span>
                  <span>65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section - Premium Grid */}
        <div className="premium-feedback">
          <div className="feedback-header-premium">
            <div className="feedback-title-premium">
              <span className="title-icon">💬</span>
              <div>
                <h2>Customer Feedback</h2>
                <p>Real reviews from your customers</p>
              </div>
            </div>
            <div className="feedback-stats-premium">
              <div className="rating-summary">
                <div className="avg-rating">
                  <span className="avg-number">
                    {(feedbacks.reduce((acc, f) => acc + (f.feedback?.rating || 0), 0) / (feedbacks.length || 1)).toFixed(1)}
                  </span>
                  <span className="avg-stars">★★★★★</span>
                </div>
                <div className="total-reviews">{feedbacks.length} Reviews</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="premium-loading">
              <div className="loading-ring"></div>
              <p>Loading feedback data...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="premium-empty">
              <div className="empty-illustration">📝</div>
              <h3>No Feedback Yet</h3>
              <p>Customer reviews will appear here once submitted</p>
            </div>
          ) : (
            <div className="feedback-grid-premium">
              {feedbacks.map((b, idx) => (
                <div key={b._id} className="feedback-card-premium" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="card-header-premium">
                    <div className="user-info-premium">
                      <div className="user-avatar-premium">
                        {b.userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="user-name-premium">{b.userName || 'Anonymous User'}</h4>
                        <div className="parking-name-premium">{b.parkingName}</div>
                      </div>
                    </div>
                    <div className="rating-badge">
                      <div className="stars-premium">
                        {renderStars(b.feedback?.rating ?? 0)}
                      </div>
                      <span className="rating-value-premium">{b.feedback?.rating ?? 0}.0</span>
                    </div>
                  </div>
                  <div className="card-body-premium">
                    <div className="quote-mark">"</div>
                    <p className="feedback-text-premium">
                      {b.feedback?.comment || "No comment provided"}
                    </p>
                    <div className="quote-mark close">"</div>
                  </div>
                  <div className="card-footer-premium">
                    <div className="date-premium">
                      <span>📅</span>
                      {formatDate(b.feedback?.givenAt)}
                    </div>
                    <div className="verified-premium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Verified
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-dashboard {
          min-height: 100vh;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow-x: hidden;
        }

        /* Premium Animated Background */
        .premium-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
          overflow: hidden;
          z-index: 0;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: rgba(255,255,255,0.05);
          border-radius: 100% 100% 0 0;
          animation: wave 10s infinite ease-in-out;
        }

        .wave-1 { bottom: 0; height: 120px; opacity: 0.3; animation-delay: 0s; }
        .wave-2 { bottom: 30px; height: 100px; opacity: 0.2; animation-delay: 2s; }
        .wave-3 { bottom: 60px; height: 80px; opacity: 0.1; animation-delay: 4s; }

        @keyframes wave {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-20px) scaleX(1.1); }
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 15s infinite ease-in-out;
        }

        .glow-1 {
          width: 400px;
          height: 400px;
          background: #667eea;
          top: -150px;
          right: -150px;
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          background: #764ba2;
          bottom: -200px;
          left: -200px;
          animation-delay: 5s;
        }

        .glow-3 {
          width: 300px;
          height: 300px;
          background: #f093fb;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px 32px;
          position: relative;
          z-index: 1;
        }

        /* Premium Header */
        .premium-header {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          margin-bottom: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .header-gradient-bar {
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
        }

        .header-content {
          padding: 20px 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .premium-title {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .premium-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-badge {
          position: relative;
          font-size: 22px;
          cursor: pointer;
        }

        .badge-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.15);
          padding: 8px 16px;
          border-radius: 40px;
          cursor: pointer;
        }

        .profile-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        /* Premium Stats Cards - 3D Flip Effect */
        .premium-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card-premium {
          background: transparent;
          perspective: 1000px;
          cursor: pointer;
        }

        .stat-card-inner {
          position: relative;
          width: 100%;
          height: 140px;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          border-radius: 20px;
        }

        .stat-card-premium:hover .stat-card-inner {
          transform: rotateY(180deg);
        }

        .stat-front, .stat-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 20px;
        }

        .stat-front {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          justify-content: space-between;
        }

        .stat-back {
          background: linear-gradient(135deg, #667eea, #764ba2);
          transform: rotateY(180deg);
          justify-content: center;
          color: white;
        }

        .stat-icon-premium {
          font-size: 48px;
        }

        .stat-info-premium {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .stat-value-premium {
          font-size: 36px;
          font-weight: 800;
          color: #1e293b;
        }

        .stat-label-premium {
          font-size: 13px;
          color: #64748b;
        }

        .stat-trend-premium {
          text-align: center;
        }

        .trend-up {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: #22c55e;
        }

        .trend-neutral {
          display: block;
          font-size: 20px;
          font-weight: 800;
          color: #fbbf24;
        }

        /* Analytics Grid */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .analytics-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .analytics-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .analytics-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #22c55e;
        }

        .live-pulse {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        .metric-large {
          text-align: center;
          margin-bottom: 24px;
        }

        .metric-value {
          display: block;
          font-size: 48px;
          font-weight: 800;
          color: #1e293b;
        }

        .metric-label {
          font-size: 14px;
          color: #64748b;
        }

        .metrics-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .metric {
          text-align: center;
        }

        .metric-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .metric-number.success {
          color: #22c55e;
        }

        .metric-desc {
          font-size: 12px;
          color: #64748b;
        }

        .metric-divider {
          width: 1px;
          height: 40px;
          background: #e2e8f0;
        }

        .performance-stats {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .performance-item {
          width: 100%;
        }

        .performance-bar {
          height: 8px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          border-radius: 10px;
          margin-bottom: 8px;
          animation: growBar 1s ease-out;
        }

        @keyframes growBar {
          from { width: 0; }
          to { width: var(--width); }
        }

        .performance-info {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #475569;
        }

        /* Premium Feedback Section */
        .premium-feedback {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 28px;
        }

        .feedback-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f1f5f9;
        }

        .feedback-title-premium {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .title-icon {
          font-size: 32px;
        }

        .feedback-title-premium h2 {
          font-size: 22px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .feedback-title-premium p {
          font-size: 13px;
          color: #64748b;
        }

        .rating-summary {
          text-align: center;
        }

        .avg-rating {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .avg-number {
          font-size: 32px;
          font-weight: 800;
          color: #fbbf24;
        }

        .avg-stars {
          font-size: 14px;
          color: #fbbf24;
        }

        .total-reviews {
          font-size: 12px;
          color: #64748b;
        }

        /* Feedback Grid */
        .feedback-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .feedback-card-premium {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          animation: slideUp 0.4s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feedback-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: #cbd5e0;
        }

        .card-header-premium {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .user-info-premium {
          display: flex;
          gap: 12px;
        }

        .user-avatar-premium {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
        }

        .user-name-premium {
          font-size: 15px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .parking-name-premium {
          font-size: 12px;
          color: #64748b;
        }

        .rating-badge {
          text-align: right;
        }

        .stars-premium {
          display: flex;
          gap: 2px;
          margin-bottom: 4px;
        }

        .star {
          font-size: 14px;
        }

        .star.filled {
          color: #fbbf24;
        }

        .star.empty {
          color: #e2e8f0;
        }

        .rating-value-premium {
          font-size: 11px;
          color: #64748b;
        }

        .card-body-premium {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
        }

        .quote-mark {
          font-size: 32px;
          color: #cbd5e0;
          font-family: serif;
          line-height: 1;
        }

        .quote-mark.close {
          text-align: right;
          margin-top: -10px;
        }

        .feedback-text-premium {
          font-style: italic;
          color: #334155;
          line-height: 1.5;
          margin: 8px 0;
        }

        .card-footer-premium {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .date-premium {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }

        .verified-premium {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
          font-weight: 600;
        }

        /* Loading State */
        .premium-loading {
          text-align: center;
          padding: 60px;
        }

        .loading-ring {
          width: 50px;
          height: 50px;
          border: 3px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .premium-loading p {
          color: #64748b;
        }

        /* Empty State */
        .premium-empty {
          text-align: center;
          padding: 60px;
        }

        .empty-illustration {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .premium-empty h3 {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .premium-empty p {
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .premium-stats {
            grid-template-columns: 1fr;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .feedback-grid-premium {
            grid-template-columns: 1fr;
          }

          .feedback-header-premium {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .brand-section {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}