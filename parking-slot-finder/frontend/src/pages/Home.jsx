import { Link } from "react-router-dom";
import bg from "../assets/bg.jpg";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Enhanced Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80" />

      {/* Main content wrapper */}
      <div className="relative min-h-screen flex flex-col backdrop-blur-[2px]">
        
        {/* Navbar with glass morphism effect - UPDATED */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-12 lg:px-20 py-5 md:py-6">
          {/* Logo section with icon */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg transform transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17h18M5 9h14M7 5h10" />
              </svg>
            </div>
            <h2 className="text-white text-base sm:text-lg md:text-2xl font-black tracking-wider text-center md:text-left bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PARKING SLOT FINDER
            </h2>
          </div>

          {/* Button group with enhanced styling - UPDATED */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full md:w-auto">
            {/* USER LOGIN */}
            <Link
              to="/user-login"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 px-3 md:px-5 py-2 text-xs md:text-base rounded-xl font-semibold text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            {/* ADMIN LOGIN */}
            <Link
              to="/admin-login"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 px-3 md:px-5 py-2 text-xs md:text-base rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            {/* REGISTER */}
            <Link
              to="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-500 px-3 md:px-5 py-2 text-xs md:text-base rounded-xl font-semibold text-white shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Center Content with enhanced design */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center animate-fadeInUp">
            {/* Main title with glass morphism and glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
              <h1 className="relative text-white text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                  PARKING SLOT
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  FINDER SYSTEM
                </span>
              </h1>
            </div>

            {/* Decorative badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-white/90 text-sm font-medium">Smart Parking Available</span>
            </div>

            {/* Description with glass card effect */}
            <div className="max-w-2xl mx-auto">
              <div className="backdrop-blur-md bg-black/30 rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
                <p className="text-gray-100 text-base md:text-lg leading-relaxed">
                  Find and reserve parking slots easily using our smart parking management system.
                  Save time, avoid traffic and park smarter.
                </p>
                
                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Real-time Availability
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Instant Booking
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure Payments
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats or decorative element - UPDATED */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:gap-6 text-white/60 text-xs">
              <span>✓ 500+ Parking Spots</span>
              <span>✓ 24/7 Support</span>
              <span>✓ Easy Access</span>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="pb-4 text-center text-white/40 text-xs">
          © 2024 Parking Slot Finder | Smart Parking Solution
        </div>
      </div>

      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}