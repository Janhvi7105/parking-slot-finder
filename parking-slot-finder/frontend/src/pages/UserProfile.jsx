import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function UserProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  /* ================= LOAD USER PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        name: res.data.user.name,
        email: res.data.user.email,
        password: "",
      });
    } catch (err) {
      alert("Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/users/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully ✅");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      alert("Profile update failed");
    }
  };

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </div>

        <div className="field">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Optional"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        <button type="submit" className="update-btn">
          Update Profile
        </button>
      </form>

      {/* ================= UI STYLES ONLY ================= */}
      <style>{`
        .profile-page {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
        }

        .profile-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
        }

        .profile-card {
          max-width: 520px;
          background: rgba(255, 255, 255, 0.96);
          padding: 36px;
          border-radius: 22px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 22px;
          animation: slideUp 0.4s ease;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .field input {
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          outline: none;
          background: #f9fafb;
          transition: all 0.25s ease;
        }

        .field input:focus {
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
        }

        .update-btn {
          margin-top: 10px;
          padding: 15px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .update-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 45px rgba(37,99,235,0.45);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
