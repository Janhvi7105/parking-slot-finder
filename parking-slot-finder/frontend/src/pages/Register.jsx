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

      console.log("✅ Register response:", res.data);

      // ✅ SAFETY CHECK (unchanged)
      if (!res.data?.user || !res.data?.token) {
        console.error("❌ Missing user/token from backend");
        alert(res.data?.message || "Registration failed");
        return;
      }

      // ✅ SAFE STORAGE (unchanged)
      try {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (storageErr) {
        console.error("❌ localStorage error:", storageErr);
      }

      // ✅ SUCCESS ALERT (UI same)
      alert("User registered successfully");

      // ⭐ FINAL RELIABLE NAVIGATION
      requestAnimationFrame(() => {
        navigate("/user", { replace: true });
      });

    } catch (err) {
      console.error("Registration error:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
          "Registration failed. Try different email."
      );
    }
  };

  return (
    <div className="register-bg">
      {/* Animated background elements */}
      <div className="animated-leaves">
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>
        <div className="leaf leaf-3"></div>
        <div className="leaf leaf-4"></div>
        <div className="leaf leaf-5"></div>
      </div>

      {/* Floating gradient orbs */}
      <div className="orb orb-green-1"></div>
      <div className="orb orb-green-2"></div>
      <div className="orb orb-green-3"></div>

      {/* Main Register Card */}
      <form className="register-card" onSubmit={handleRegister}>
        {/* Brand Icon */}
        <div className="brand-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 17h18M5 9h14M7 5h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>

        <h2>Create Account</h2>
        <p className="subtitle">Join us for smarter parking solutions</p>

        {/* Input Fields with Icons */}
        <div className="input-group">
          <div className="input-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <div className="input-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Password strength indicator (visual only) */}
        {password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div 
                className={`strength-fill ${
                  password.length < 6 ? 'weak' : 
                  password.length < 10 ? 'medium' : 'strong'
                }`}
                style={{ width: `${Math.min((password.length / 16) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="strength-text">
              {password.length < 6 ? 'Weak' : password.length < 10 ? 'Medium' : 'Strong'} password
            </span>
          </div>
        )}

        <button type="submit" className="register-btn">
          <span>Get Started</span>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div className="divider">
          <span>Already have an account?</span>
        </div>

        <button 
          type="button" 
          className="login-link-btn"
          onClick={() => navigate("/user-login")}
        >
          Sign In Instead
        </button>

        <p className="terms">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-bg {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2b1d 0%, #064e3b 50%, #022c22 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Animated Leaves */
        .animated-leaves {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .leaf {
          position: absolute;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 80% 0 80% 0;
          animation: floatLeaf 12s infinite ease-in-out;
        }

        .leaf-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: -40px;
          transform: rotate(45deg);
          animation-duration: 14s;
        }

        .leaf-2 {
          width: 60px;
          height: 60px;
          bottom: 15%;
          right: -30px;
          transform: rotate(-30deg);
          animation-duration: 11s;
          animation-delay: 2s;
        }

        .leaf-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          left: -50px;
          transform: rotate(60deg);
          animation-duration: 16s;
          animation-delay: 4s;
        }

        .leaf-4 {
          width: 50px;
          height: 50px;
          top: 30%;
          right: 10%;
          transform: rotate(-15deg);
          animation-duration: 13s;
          animation-delay: 1s;
        }

        .leaf-5 {
          width: 70px;
          height: 70px;
          bottom: 40%;
          right: -35px;
          transform: rotate(25deg);
          animation-duration: 15s;
          animation-delay: 3s;
        }

        @keyframes floatLeaf {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          25% {
            opacity: 0.4;
          }
          50% {
            transform: translate(30px, -30px) rotate(10deg);
            opacity: 0.6;
          }
          75% {
            opacity: 0.4;
          }
        }

        /* Floating Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: floatOrb 10s infinite ease-in-out;
        }

        .orb-green-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #22c55e, #16a34a);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb-green-2 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, #10b981, #059669);
          bottom: -150px;
          right: -150px;
          animation-delay: 3s;
        }

        .orb-green-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, #34d399, #22c55e);
          top: 50%;
          left: 70%;
          animation-delay: 6s;
        }

        @keyframes floatOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }

        /* Main Register Card */
        .register-card {
          width: 480px;
          padding: 48px 44px;
          background: rgba(6, 78, 59, 0.75);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(34, 197, 94, 0.1);
          position: relative;
          z-index: 10;
          animation: slideUp 0.7s cubic-bezier(0.34, 1.2, 0.64, 1);
          transition: all 0.3s ease;
        }

        .register-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6);
          border-color: rgba(34, 197, 94, 0.5);
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

        /* Brand Icon */
        .brand-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulseGlow 2s ease-in-out infinite;
          box-shadow: 0 10px 30px -5px rgba(34, 197, 94, 0.5);
        }

        .brand-icon svg {
          width: 38px;
          height: 38px;
          color: white;
        }

        @keyframes pulseGlow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px -5px rgba(34, 197, 94, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px -5px rgba(34, 197, 94, 0.8);
          }
        }

        /* Typography */
        .register-card h2 {
          text-align: center;
          font-size: 34px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff, #86efac);
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

        .register-card input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 18px;
          font-size: 15px;
          color: white;
          transition: all 0.3s ease;
          outline: none;
          font-weight: 500;
        }

        .register-card input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .register-card input:focus {
          border-color: #22c55e;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
        }

        .register-card input:focus + .input-icon {
          color: #22c55e;
        }

        /* Password Strength */
        .password-strength {
          margin-top: -8px;
          margin-bottom: 16px;
        }

        .strength-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-fill.weak {
          background: linear-gradient(90deg, #ef4444, #f97316);
          width: 33%;
        }

        .strength-fill.medium {
          background: linear-gradient(90deg, #f59e0b, #eab308);
          width: 66%;
        }

        .strength-fill.strong {
          background: linear-gradient(90deg, #22c55e, #10b981);
          width: 100%;
        }

        .strength-text {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Register Button */
        .register-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
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

        .register-btn::before {
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

        .register-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px -10px rgba(34, 197, 94, 0.6);
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .register-btn:hover .btn-icon {
          transform: translateX(5px);
        }

        /* Divider */
        .divider {
          text-align: center;
          position: relative;
          margin-bottom: 16px;
        }

        .divider span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        /* Login Link Button */
        .login-link-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          border: 1px solid rgba(34, 197, 94, 0.4);
          border-radius: 18px;
          color: #86efac;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .login-link-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          transform: translateY(-2px);
        }

        /* Terms */
        .terms {
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          line-height: 1.4;
        }

        /* Responsive Design */
        @media (max-width: 540px) {
          .register-card {
            width: 92%;
            padding: 36px 24px;
          }
          
          .register-card h2 {
            font-size: 28px;
          }
          
          .brand-icon {
            width: 60px;
            height: 60px;
          }
          
          .brand-icon svg {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </div>
  );
}