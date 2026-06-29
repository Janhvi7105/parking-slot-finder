import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

// Custom marker icon
const customMarker = L.divIcon({
  className: "",
  html: `
    <svg width="32" height="48" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#10b981"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
});

export default function UserHome() {
  const [parkings, setParkings] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);
  const navigate = useNavigate();

  // 🔐 AUTH CHECK
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/user-login");
    }
  }, [navigate]);

  // ✅ FETCH PARKINGS
  useEffect(() => {
    axios
      .get(`${API}/parking`)
      .then((res) => setParkings(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ LOGOUT → HOME PAGE
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="user-home">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-section">
            <div className="logo-icon">🚗</div>
            <div>
              <h2 className="logo-text">ParkSmart</h2>
              <p className="logo-sub">Parking Slot Finder</p>
            </div>
          </div>

          <button onClick={logout} className="logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-icon">🅿️</div>
            <div>
              <h3 className="sidebar-title">Available Parkings</h3>
              <p className="sidebar-count">{parkings.length} locations found</p>
            </div>
          </div>

          <div className="parkings-list">
            {parkings.map((p) => (
              <div
                key={p._id}
                className={`parking-item ${selectedParking === p._id ? 'active' : ''}`}
                onClick={() => setSelectedParking(p._id)}
              >
                <div className="parking-header">
                  <div className="parking-icon">🏢</div>
                  <div className="parking-info">
                    <h4 className="parking-name">{p.name}</h4>
                    <p className="parking-location">{p.location}</p>
                  </div>
                </div>
                <div className="parking-details">
                  <div className="detail-chip">
                    <span>💰</span>
                    <span>₹{p.price}/hr</span>
                  </div>
                  <div className="detail-chip">
                    <span>📊</span>
                    <span>{p.capacity} slots</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="map-section">
          <div className="map-header">
            <div className="map-header-left">
              <span className="map-icon">🗺️</span>
              <h3>Interactive Map View</h3>
            </div>
            <div className="map-legend">
              <span className="legend-dot"></span>
              <span>Parking Locations</span>
            </div>
          </div>
          <MapContainer
            center={[18.5204, 73.8567]}
            zoom={13}
            className="map-container"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {parkings.map((p) => (
              <Marker key={p._id} position={[p.lat, p.lng]} icon={customMarker}>
                <Popup>
                  <div className="custom-popup">
                    <strong className="popup-title">{p.name}</strong>
                    <div className="popup-location">📍 {p.location}</div>
                    <div className="popup-details">
                      <span>📊 Slots: {p.capacity}</span>
                      <span>💰 ₹{p.price}/hr</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .user-home {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.25), rgba(255,255,255,0));
          animation: float 20s infinite ease-in-out;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          top: -150px;
          right: -150px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 600px;
          height: 600px;
          bottom: -250px;
          left: -250px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(10deg); }
        }

        /* Navbar */
        .navbar {
          position: relative;
          z-index: 10;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 16px rgba(16,185,129,0.3);
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }

        .logo-sub {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(239,68,68,0.4);
        }

        /* Main Container */
        .main-container {
          display: flex;
          height: calc(100vh - 80px);
          position: relative;
          z-index: 1;
        }

        /* Sidebar */
        .sidebar {
          width: 380px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 10px 0 30px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .sidebar-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .sidebar-count {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .parkings-list {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .parking-item {
          background: white;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .parking-item:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          border-color: #10b98120;
        }

        .parking-item.active {
          border-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4, #ffffff);
        }

        .parking-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .parking-icon {
          font-size: 28px;
        }

        .parking-info {
          flex: 1;
        }

        .parking-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .parking-location {
          font-size: 12px;
          color: #64748b;
          margin: 0;
        }

        .parking-details {
          display: flex;
          gap: 12px;
        }

        .detail-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }

        /* Map Section */
        .map-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          margin: 16px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .map-header {
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .map-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .map-icon {
          font-size: 22px;
        }

        .map-header-left h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .map-legend {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #10b98140;
        }

        .map-container {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        /* Custom Popup */
        .custom-popup {
          padding: 8px;
          min-width: 180px;
        }

        .popup-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          display: block;
          margin-bottom: 6px;
        }

        .popup-location {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .popup-details {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 600;
          color: #10b981;
        }

        /* Scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
            height: auto;
          }

          .sidebar {
            width: 100%;
            max-height: 400px;
          }

          .map-section {
            margin: 16px;
            height: 500px;
          }

          .nav-container {
            padding: 12px 20px;
          }

          .logo-text {
            font-size: 18px;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}