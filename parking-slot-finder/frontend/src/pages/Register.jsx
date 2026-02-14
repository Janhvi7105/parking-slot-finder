import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminStats } from "../context/AdminStatsContext";

export default function Register() {
  const navigate = useNavigate();
  const { triggerRefresh } = useAdminStats();

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

      triggerRefresh(); // 🔥 LIVE TOTAL USERS UPDATE

      navigate("/user");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl shadow-xl w-96 text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <input
          className="w-full mb-4 p-3 rounded bg-gray-700"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded bg-gray-700"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-6 p-3 rounded bg-gray-700"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 py-3 rounded hover:bg-indigo-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
