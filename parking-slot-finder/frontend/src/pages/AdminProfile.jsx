import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProfile() {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= LOAD PROFILE ================= */
  const fetchProfile = async () => {
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
  };

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

      alert("Profile updated successfully");
      setForm({ ...form, password: "" });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-10 max-w-lg">
      <h2 className="text-2xl mb-6 font-bold">Admin Profile</h2>

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        className="border p-2 mb-4 w-full"
        placeholder="New Password (optional)"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={updateProfile}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Update Profile
      </button>
    </div>
  );
}
