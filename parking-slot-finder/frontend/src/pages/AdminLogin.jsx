import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/auth/login`,
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
      {/* Animated background particles */}
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>

      {/* Floating shapes */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>

      {/* Main Admin Card */}
      <div className="admin-card">
        {/* Shield Icon - Admin Badge */}
        <div className="shield-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M12 2V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M21 7V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M3 7V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M12 21C9.5 19.5 7 19 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M12 21C14.5 19.5 17 19 19 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h2>Admin Portal</h2>
        <p className="subtitle">Secure access for administrators only</p>

        {/* Input Fields */}
        <div className="input-group">
          <div className="input-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Admin Email Address"
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />
        </div>

        <div className="input-group">
          <div className="input-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />
        </div>

        <div className="options">
          <label className="checkbox">
            <input type="checkbox" />
            <span>Keep me signed in</span>
          </label>
          <button 
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              alert("Contact system administrator to reset password");
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button onClick={login} className="admin-btn">
          <span>Access Dashboard</span>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div className="security-note">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>This area is restricted to authorized personnel only</span>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #4c1d95 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Animated Particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background: rgba(168, 85, 247, 0.3);
          border-radius: 50%;
          animation: floatParticle 15s infinite linear;
        }

        .particle-1 {
          width: 4px;
          height: 4px;
          top: 20%;
          left: 10%;
          animation-duration: 12s;
        }

        .particle-2 {
          width: 6px;
          height: 6px;
          top: 60%;
          left: 85%;
          animation-duration: 18s;
          animation-delay: 2s;
        }

        .particle-3 {
          width: 3px;
          height: 3px;
          top: 80%;
          left: 20%;
          animation-duration: 14s;
          animation-delay: 4s;
        }

        .particle-4 {
          width: 5px;
          height: 5px;
          top: 30%;
          left: 75%;
          animation-duration: 16s;
          animation-delay: 1s;
        }

        .particle-5 {
          width: 7px;
          height: 7px;
          top: 50%;
          left: 15%;
          animation-duration: 20s;
          animation-delay: 3s;
        }

        .particle-6 {
          width: 4px;
          height: 4px;
          top: 10%;
          left: 50%;
          animation-duration: 11s;
          animation-delay: 5s;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }

        /* Floating Shapes */
        .floating-shape {
          position: absolute;
          filter: blur(60px);
          opacity: 0.4;
          animation: floatShape 10s infinite ease-in-out;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #a855f7, #7c3aed);
          top: -150px;
          left: -150px;
          border-radius: 50%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #8b5cf6, #4c1d95);
          bottom: -200px;
          right: -200px;
          border-radius: 50%;
          animation-delay: 3s;
        }

        .shape-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, #c084fc, #6d28d9);
          top: 50%;
          left: 80%;
          border-radius: 50%;
          animation-delay: 6s;
        }

        @keyframes floatShape {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        /* Main Admin Card */
        .admin-card {
          width: 460px;
          padding: 48px 44px;
          background: rgba(20, 10, 40, 0.75);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(168, 85, 247, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.1);
          position: relative;
          z-index: 10;
          animation: slideUp 0.7s cubic-bezier(0.34, 1.2, 0.64, 1);
          transition: all 0.3s ease;
        }

        .admin-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6);
          border-color: rgba(168, 85, 247, 0.5);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Shield Icon */
        .shield-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulseGlow 2s ease-in-out infinite;
          box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.5);
        }

        .shield-icon svg {
          width: 45px;
          height: 45px;
          color: white;
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px -5px rgba(139, 92, 246, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px -5px rgba(139, 92, 246, 0.8);
          }
        }

        /* Typography */
        .admin-card h2 {
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #c084fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .subtitle {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin-bottom: 32px;
        }

        /* Input Groups */
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .admin-card input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 18px;
          font-size: 15px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
          font-weight: 500;
        }

        .admin-card input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .admin-card input:focus {
          border-color: #a855f7;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
        }

        .admin-card input:focus + .input-icon {
          color: #a855f7;
        }

        /* Options */
        .options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }

        .checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #a855f7;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #c084fc;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.3s;
          font-family: inherit;
        }

        .forgot-link:hover {
          color: #e9d5ff;
          text-decoration: underline;
        }

        /* Admin Button */
        .admin-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #a855f7, #6d28d9);
          border: none;
          border-radius: 18px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .admin-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s;
        }

        .admin-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .admin-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -10px rgba(168, 85, 247, 0.6);
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .admin-btn:hover .btn-icon {
          transform: translateX(5px);
        }

        /* Security Note */
        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid rgba(168, 85, 247, 0.2);
        }

        .security-note svg {
          width: 16px;
          height: 16px;
          color: #c084fc;
        }

        .security-note span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 540px) {
          .admin-card {
            width: 92%;
            padding: 36px 24px;
          }
          
          .admin-card h2 {
            font-size: 28px;
          }
          
          .shield-icon {
            width: 65px;
            height: 65px;
          }
          
          .shield-icon svg {
            width: 35px;
            height: 35px;
          }
          
          .options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}