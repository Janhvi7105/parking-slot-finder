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

      navigate("/admin"); // ✅ ADMIN REDIRECT
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full bg-gray-700 text-white p-3 mb-4 rounded"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-gray-700 text-white p-3 mb-4 rounded"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          onClick={login}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Login as Admin
        </button>

      </div>
    </div>
  );
}
