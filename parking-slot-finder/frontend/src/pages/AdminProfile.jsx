import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function AdminProfile() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  /* ================= LOAD PROFILE ================= */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        name: res.data.name,
        email: res.data.email,
        password: ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/admin/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully ✅");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="admin-profile-wrapper">
      <h2 className="profile-title">Admin Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">👤</div>

        <div className="field">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
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

        <button className="update-btn" onClick={updateProfile}>
          Update Profile
        </button>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .admin-profile-wrapper {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
        }

        .profile-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .profile-card {
          max-width: 460px;
          background: #ffffff;
          padding: 32px;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .profile-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: #fff;
          margin-bottom: 8px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .field input {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          font-size: 15px;
          outline: none;
          transition: 0.25s;
        }

        .field input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
        }

        .update-btn {
          margin-top: 14px;
          padding: 14px;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          transition: 0.3s;
        }

        .update-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px rgba(124,58,237,0.45);
        }
      `}</style>
    </div>
  );
}
