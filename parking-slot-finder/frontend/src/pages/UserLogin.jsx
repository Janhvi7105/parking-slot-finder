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
      {/* Animated gradient orbs */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>
      
      {/* Grid pattern overlay */}
      <div className="grid-overlay"></div>

      {/* Main Card */}
      <div className="login-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 17h18M5 9h14M7 5h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to access your parking dashboard</p>
        </div>

        {/* Form Fields */}
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type="password"
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
        </div>

        <div className="options">
          <label className="checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button 
            className="forgot-link"
            onClick={(e) => {
              e.preventDefault();
              // Handle forgot password logic here
              alert("Password reset link will be sent to your email");
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button onClick={login} className="login-btn">
          <span>Sign In</span>
          <svg className="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn google">
            <svg viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="social-btn apple">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.36 3 13.75 3 10.92c0-4.22 2.72-6.44 5.39-6.44 1.41 0 2.58.96 3.47.96.88 0 2.26-1.18 3.81-1.01.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.27-2.15 3.78.03 2.96 2.59 3.95 2.62 3.96-.02.06-.41 1.41-1.35 2.79zM15.05 3c.66-.84 1.14-2.02 1-3-.95.05-2.11.64-2.78 1.44-.62.73-1.13 1.86-.99 2.95 1.04.08 2.1-.56 2.77-1.39z"/>
            </svg>
            Apple
          </button>
        </div>

        <p className="signup-prompt">
          New to Parking Slot Finder? <a href="/register">Create an account</a>
        </p>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(125deg, #0F172A 0%, #1E1B4B 50%, #2E1065 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Animated Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
          animation: float 12s infinite ease-in-out;
        }

        .orb1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #FF6B6B, #FF8E53);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #4FACFE, #00F2FE);
          bottom: -250px;
          right: -250px;
          animation-delay: 2s;
        }

        .orb3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #FA709A, #FEE140);
          top: 50%;
          left: 70%;
          animation-delay: 4s;
        }

        .orb4 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #A18CD1, #FBC2EB);
          bottom: 20%;
          left: -150px;
          animation-delay: 1s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
          }
        }

        /* Grid Overlay */
        .grid-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Login Card */
        .login-card {
          width: 480px;
          padding: 48px 44px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 10;
          animation: slideUp 0.7s cubic-bezier(0.34, 1.2, 0.64, 1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6);
          border-color: rgba(255, 255, 255, 0.25);
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

        /* Brand Header */
        .brand-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .brand-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
        }

        .brand-icon svg {
          width: 38px;
          height: 38px;
          color: white;
          stroke-width: 1.8;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 20px 35px -8px rgba(102, 126, 234, 0.6);
          }
        }

        .brand-header h2 {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #FFFFFF, #A78BFA);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 8px;
        }

        .brand-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        /* Form Groups */
        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .input-wrapper input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 18px;
          font-size: 15px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
          font-weight: 500;
        }

        .input-wrapper input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .input-wrapper input:focus {
          border-color: #8B5CF6;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
        }

        .input-wrapper input:focus + .input-icon {
          color: #8B5CF6;
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
          font-size: 14px;
        }

        .checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #8B5CF6;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #A78BFA;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s;
          font-family: inherit;
        }

        .forgot-link:hover {
          color: #C4B5FD;
          text-decoration: underline;
        }

        /* Login Button */
        .login-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #8B5CF6, #6D28D9);
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

        .login-btn::before {
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

        .login-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -10px rgba(139, 92, 246, 0.6);
        }

        .btn-arrow {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .login-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        /* Divider */
        .divider {
          text-align: center;
          position: relative;
          margin-bottom: 24px;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 70px);
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .divider span {
          background: transparent;
          padding: 0 12px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Social Buttons */
        .social-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-btn {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 14px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .social-btn svg {
          width: 20px;
          height: 20px;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Signup Prompt */
        .signup-prompt {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }

        .signup-prompt a {
          color: #A78BFA;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .signup-prompt a:hover {
          color: #C4B5FD;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 540px) {
          .login-card {
            width: 92%;
            padding: 36px 24px;
          }
          
          .brand-header h2 {
            font-size: 28px;
          }
          
          .social-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}