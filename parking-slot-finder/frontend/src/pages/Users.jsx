import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
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
        `http://localhost:5000/api/admin/users/${id}`,
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

  return (
    <div className="users-page">
      <h2 className="page-title">Manage Users</h2>

      {users.length === 0 ? (
        <div className="empty-state">No users found</div>
      ) : (
        <div className="users-grid">
          {users.map((u) => (
            <div className="user-card" key={u._id}>
              <div className="user-info">
                <h3>{u.name}</h3>
                <p>{u.email}</p>
              </div>

              <div className="user-actions">
                <span
                  className={`role ${
                    u.role === "admin" ? "admin" : "user"
                  }`}
                >
                  {u.role}
                </span>

                {u.role === "admin" ? (
                  <span className="locked">Protected</span>
                ) : (
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .users-page {
          padding: 30px;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
          min-height: 100vh;
        }

        .page-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .user-card {
          background: #fff;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: 0.25s;
        }

        .user-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .user-info h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .user-info p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #64748b;
        }

        .user-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .role {
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
        }

        .role.admin {
          background: #6366f1;
        }

        .role.user {
          background: #22c55e;
        }

        .delete-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        .locked {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 600;
        }

        .empty-state {
          background: #fff;
          padding: 40px;
          border-radius: 16px;
          text-align: center;
          color: #64748b;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
