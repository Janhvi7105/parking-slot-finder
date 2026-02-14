import { Link } from "react-router-dom";
import bg from "../assets/bg.jpg";

export default function Home() {
  return (
    <div
      className="h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="h-full bg-black/60">

        {/* Navbar */}
        <div className="flex justify-between items-center px-10 py-6 text-white">
          <h2 className="text-2xl font-bold tracking-wide">
            PARKING SLOT FINDER
          </h2>

          <div className="space-x-4">

            {/* USER LOGIN */}
            <Link
              to="/user-login"
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              User Login
            </Link>

            {/* ADMIN LOGIN */}
            <Link
              to="/admin-login"
              className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Admin Login
            </Link>

            {/* REGISTER */}
            <Link
              to="/register"
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Register
            </Link>

          </div>
        </div>

        {/* Center Content */}
        <div className="flex items-center justify-center h-[80%] text-center">
          <div>
            <h1 className="text-white text-5xl font-extrabold bg-black/50 px-12 py-6 rounded-xl mb-6">
              PARKING SLOT <br /> FINDER SYSTEM
            </h1>

            <p className="text-gray-200 text-lg max-w-xl mx-auto">
              Find and reserve parking slots easily using our smart parking management system.
              Save time, avoid traffic and park smarter.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
