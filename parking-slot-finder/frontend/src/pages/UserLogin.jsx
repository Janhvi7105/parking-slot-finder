import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/user");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>User Login</h2>

        <input
          type="email"
          placeholder="Email"
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

        <button onClick={login}>Login</button>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2563eb, #0f172a);
        }

        .login-card {
          width: 360px;
          padding: 35px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .login-card h2 {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .login-card input {
          padding: 14px 16px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          outline: none;
        }

        .login-card input:focus {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.6);
        }

        .login-card button {
          margin-top: 8px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-card button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(59,130,246,0.6);
        }
      `}</style>
    </div>
  );
}
