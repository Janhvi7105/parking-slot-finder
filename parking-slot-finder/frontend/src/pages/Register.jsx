import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/user");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-bg">
      <form className="register-card" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>

      {/* ================= STYLES ================= */}
      <style>{`
        .register-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #064e3b, #022c22);
        }

        .register-card {
          width: 380px;
          padding: 38px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          box-shadow: 0 35px 70px rgba(0,0,0,0.45);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .register-card h2 {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          color: #ecfdf5;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .register-card input {
          padding: 14px 16px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          outline: none;
        }

        .register-card input:focus {
          box-shadow: 0 0 0 3px rgba(34,197,94,0.6);
        }

        .register-card button {
          margin-top: 10px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .register-card button:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 35px rgba(34,197,94,0.6);
        }
      `}</style>
    </div>
  );
}
