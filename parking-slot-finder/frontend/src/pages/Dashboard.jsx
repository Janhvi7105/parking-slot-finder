export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    window.location.href = "/user-login";
    return null;
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      <div className="dashboard-container">
        {/* Welcome Card */}
        <div className="welcome-card">
          <div className="card-glow"></div>
          
          <div className="card-header">
            <div className="welcome-badge">
              <span className="badge-icon">✨</span>
              <span>Welcome Back</span>
            </div>
            <div className="user-avatar">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>

          <div className="card-body">
            <h1 className="welcome-title">
              <span className="wave-emoji">👋</span>
              Hello, {user.name || "User"}!
            </h1>
            
            <p className="welcome-subtitle">
              You are logged in as
              <span className="email-highlight">{user.email}</span>
            </p>

            <div className="user-stats">
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-value">Active</span>
                  <span className="stat-label">Account Status</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-icon">🕐</div>
                <div className="stat-info">
                  <span className="stat-value">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="stat-label">Current Time</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <span className="stat-value">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                  <span className="stat-label">Today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/user-login";
              }}
              className="logout-button"
            >
              <span className="btn-icon">🚪</span>
              <span>Logout</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">🅿️</div>
            <h3>Find Parking</h3>
            <p>Search for available parking spots near you</p>
            <button className="action-btn" onClick={() => window.location.href = "/user/search"}>
              Go Now →
            </button>
          </div>
          <div className="action-card">
            <div className="action-icon">📋</div>
            <h3>My Bookings</h3>
            <p>View and manage your parking reservations</p>
            <button className="action-btn" onClick={() => window.location.href = "/user/bookings"}>
              View All →
            </button>
          </div>
          <div className="action-card">
            <div className="action-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your account information</p>
            <button className="action-btn" onClick={() => window.location.href = "/user/profile"}>
              Edit Profile →
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

        .dashboard-page {
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

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 32px;
          position: relative;
          z-index: 1;
        }

        /* Welcome Card */
        .welcome-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
          margin-bottom: 40px;
          position: relative;
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

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(16,185,129,0.1), transparent);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .welcome-card:hover .card-glow {
          opacity: 1;
        }

        .card-header {
          padding: 32px 32px 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          padding: 8px 20px;
          border-radius: 40px;
          color: white;
          font-size: 13px;
          font-weight: 700;
        }

        .badge-icon {
          font-size: 14px;
        }

        .user-avatar {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: white;
          box-shadow: 0 10px 20px rgba(102,126,234,0.3);
        }

        .card-body {
          padding: 24px 32px;
        }

        .welcome-title {
          font-size: 36px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wave-emoji {
          animation: wave 2s infinite;
          display: inline-block;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }

        .welcome-subtitle {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 28px;
        }

        .email-highlight {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
          margin-left: 8px;
        }

        .user-stats {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .stat-icon {
          font-size: 28px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 800;
          color: #1e293b;
        }

        .stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: #e2e8f0;
        }

        .card-footer {
          padding: 0 32px 32px 32px;
        }

        .logout-button {
          width: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 60px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .logout-button::before {
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

        .logout-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .logout-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(239,68,68,0.4);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .logout-button:hover .btn-arrow {
          transform: translateX(6px);
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .action-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 28px;
          text-align: center;
          transition: all 0.3s ease;
          animation: slideUp 0.5s ease;
          animation-fill-mode: backwards;
        }

        .action-card:nth-child(1) { animation-delay: 0.1s; }
        .action-card:nth-child(2) { animation-delay: 0.2s; }
        .action-card:nth-child(3) { animation-delay: 0.3s; }

        .action-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .action-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .action-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .action-card p {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .action-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102,126,234,0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 20px;
          }

          .welcome-title {
            font-size: 28px;
          }

          .card-header {
            padding: 24px 24px 0 24px;
          }

          .card-body {
            padding: 20px 24px;
          }

          .user-stats {
            flex-direction: column;
          }

          .stat-divider {
            width: 100%;
            height: 1px;
          }

          .stat-item {
            width: 100%;
          }

          .card-footer {
            padding: 0 24px 24px 24px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}