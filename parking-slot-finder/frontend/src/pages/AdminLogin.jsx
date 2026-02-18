import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      if (res.data.user.role !== "admin") {
        alert("This is not an Admin account");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="admin-bg">
      <div className="admin-card">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button onClick={login}>Login as Admin</button>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #7c3aed, #2e1065);
        }

        .admin-card {
          width: 380px;
          padding: 38px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          box-shadow: 0 35px 70px rgba(0,0,0,0.45);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-card h2 {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          color: #f5f3ff;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .admin-card input {
          padding: 14px 16px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          outline: none;
        }

        .admin-card input:focus {
          box-shadow: 0 0 0 3px rgba(168,85,247,0.6);
        }

        .admin-card button {
          margin-top: 10px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #a855f7, #6d28d9);
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .admin-card button:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 35px rgba(168,85,247,0.6);
        }
      `}</style>
    </div>
  );
}
