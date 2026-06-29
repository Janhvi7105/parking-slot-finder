import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.users || []);
    } catch (err) {
      alert("Failed to load users");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API}/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Calculate stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "admin").length;
  const regularUsers = users.filter(u => u.role === "user").length;

  return (
    <div className="users-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="users-container">
        {/* Header Section */}
        <div className="users-header">
          <div className="header-left">
            <div className="header-icon">👥</div>
            <div>
              <h2 className="page-title">User Management</h2>
              <p className="page-subtitle">Manage and monitor all registered users</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card-mini">
              <span className="stat-value">{totalUsers}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-value">{adminCount}</span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-value">{regularUsers}</span>
              <span className="stat-label">Regular</span>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Users Found</h3>
            <p>There are no registered users yet</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((u, idx) => (
              <div className="user-card" key={u._id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="card-header">
                  <div className="user-avatar">
                    {u.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="user-info">
                    <h3>{u.name}</h3>
                    <p>{u.email}</p>
                  </div>
                </div>

                <div className="card-body">
                  <div className="user-details">
                    <div className="detail-item">
                      <span className="detail-icon">🆔</span>
                      <span className="detail-label">User ID</span>
                      <span className="detail-value">{u._id.slice(-8)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👤</span>
                      <span className="detail-label">Role</span>
                      <span className={`role-badge ${u.role === "admin" ? "admin" : "user"}`}>
                        {u.role === "admin" ? "Administrator" : "Regular User"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  {u.role === "admin" ? (
                    <div className="protected-badge">
                      <span>🔒</span>
                      <span>Protected Account</span>
                    </div>
                  ) : (
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(u._id)}
                    >
                      <span>🗑️</span>
                      <span>Delete User</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .users-page {
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

        .users-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 24px 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.2);
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 10px 20px rgba(16,185,129,0.3);
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 6px;
        }

        .page-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
        }

        .header-stats {
          display: flex;
          gap: 16px;
        }

        .stat-card-mini {
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card-mini:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.25);
        }

        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }

        /* Users Grid */
        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .user-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: slideUp 0.4s ease forwards;
          opacity: 0;
          transform: translateY(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .card-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-bottom: 1px solid #f1f5f9;
          background: linear-gradient(135deg, #f8fafc, #ffffff);
        }

        .user-avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 16px rgba(102,126,234,0.3);
        }

        .user-info h3 {
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .user-info p {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .card-body {
          padding: 20px 24px;
          background: white;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-icon {
          font-size: 18px;
          width: 28px;
        }

        .detail-label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          width: 70px;
        }

        .detail-value {
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          font-family: monospace;
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .role-badge.admin {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .role-badge.user {
          background: #dcfce7;
          color: #16a34a;
        }

        .card-footer {
          padding: 20px 24px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }

        .delete-btn {
          width: 100%;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(239,68,68,0.4);
        }

        .protected-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #e2e8f0;
          color: #475569;
          padding: 10px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
        }

        /* Empty State */
        .empty-state {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 60px 40px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .empty-state h3 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-state p {
          font-size: 14px;
          color: #64748b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .users-container {
            padding: 20px;
          }

          .users-header {
            flex-direction: column;
            text-align: center;
          }

          .header-left {
            flex-direction: column;
            text-align: center;
          }

          .page-title {
            font-size: 24px;
          }

          .users-grid {
            grid-template-columns: 1fr;
          }

          .user-avatar {
            width: 52px;
            height: 52px;
            font-size: 22px;
          }

          .detail-item {
            flex-wrap: wrap;
          }

          .detail-label {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}