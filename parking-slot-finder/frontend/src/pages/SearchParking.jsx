import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

/* ================= GOOGLE STYLE RED MARKER ================= */
const googleRedMarker = L.divIcon({
  className: "",
  html: `
    <svg width="32" height="48" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#EA4335"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
});

/* ================= PARKING MARKER ================= */
const parkingMarker = L.divIcon({
  className: "",
  html: `
    <svg width="34" height="48" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#000"/>
      <circle cx="12" cy="12" r="7" fill="white"/>
      <text x="12" y="16" text-anchor="middle" font-size="12" font-weight="bold">P</text>
    </svg>
  `,
  iconSize: [34, 48],
  iconAnchor: [17, 48],
});

/* ================= DISTANCE ================= */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ================= MAP FLY ================= */
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 1.5 });
  }, [position, map]);
  return null;
}

export default function SearchParking() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchLatLng, setSearchLatLng] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const defaultCenter = [12.2958, 76.6394]; // Mysuru

  /* FETCH PARKINGS */
  useEffect(() => {
    axios
      .get(`${API}/parking`)
      .then((res) => setParkings(res.data))
      .catch(console.error);
  }, []);

  /* SEARCH LOCATION */
  useEffect(() => {
    if (!search.trim()) {
      setSearchLatLng(null);
      return;
    }
    
    setIsSearching(true);
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          { params: { q: search, format: "json", limit: 1 } }
        );
        if (res.data.length > 0) {
          setSearchLatLng([
            parseFloat(res.data[0].lat),
            parseFloat(res.data[0].lon),
          ]);
        } else {
          setSearchLatLng(null);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchLatLng(null);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  /* FILTER NEARBY */
  const nearbyParkings = searchLatLng
    ? parkings
        .map((p) => ({
          ...p,
          distance: getDistanceKm(
            searchLatLng[0],
            searchLatLng[1],
            Number(p.lat),
            Number(p.lng)
          ),
        }))
        .filter((p) => p.distance <= 20)
        .sort((a, b) => a.price - b.price)
    : [];

  return (
    <div className="search-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect Parking Spot
            <span className="hero-accent"> 🚗</span>
          </h1>
          <p className="hero-subtitle">
            Search, compare, and book the best parking spaces near you
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-icon">🔍</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a location (e.g., Mysuru Palace, MG Road, City Center)..."
            className="search-input"
          />
          {isSearching && <div className="search-loader"></div>}
        </div>
        
        {search && searchLatLng && (
          <div className="search-result-badge">
            ✅ Showing parking spots near "{search}"
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {searchLatLng && nearbyParkings.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <span className="stat-value">{nearbyParkings.length}</span>
              <span className="stat-label">Parking Spots Found</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <span className="stat-value">
                ₹{Math.min(...nearbyParkings.map(p => p.price))}
              </span>
              <span className="stat-label">Lowest Price</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-info">
              <span className="stat-value">
                {Math.min(...nearbyParkings.map(p => p.distance)).toFixed(1)} km
              </span>
              <span className="stat-label">Closest Spot</span>
            </div>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className="map-card">
        <div className="map-header">
          <div className="map-header-left">
            <span className="map-icon">🗺️</span>
            <h3>Interactive Map View</h3>
          </div>
          <div className="map-legend">
            <span className="legend-item">
              <span className="legend-marker red"></span> Your Location
            </span>
            <span className="legend-item">
              <span className="legend-marker black"></span> Parking Spots
            </span>
          </div>
        </div>
        <MapContainer center={defaultCenter} zoom={12} style={{ height: "450px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {searchLatLng && <FlyToLocation position={searchLatLng} />}
          {searchLatLng && (
            <Marker position={searchLatLng} icon={googleRedMarker}>
              <Popup>
                <div className="custom-popup">
                  <strong>📍 {search}</strong>
                  <br />
                  Your searched location
                </div>
              </Popup>
            </Marker>
          )}
          {nearbyParkings.map((p) => (
            <Marker key={p._id} position={[p.lat, p.lng]} icon={parkingMarker}>
              <Popup>
                <div className="parking-popup">
                  <h4>{p.name}</h4>
                  <p>{p.location}</p>
                  <div className="popup-price">₹{p.price}</div>
                  <div className="popup-distance">{p.distance.toFixed(2)} km away</div>
                  <button 
                    className="popup-book-btn"
                    onClick={() => navigate(`/user/book/${p._id}`)}
                  >
                    Book Now →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* TABLE SECTION */}
      <div className="parking-card">
        <div className="card-header">
          <div className="header-left">
            <h3>🅿️ Available Parking Spots</h3>
            <p>Showing results sorted by price (lowest to highest)</p>
          </div>
          {nearbyParkings.length > 0 && (
            <div className="result-count">{nearbyParkings.length} spots available</div>
          )}
        </div>

        <div className="table-wrapper">
          <table className="parking-table">
            <thead>
              <tr>
                <th>🏢 Parking Name</th>
                <th>📍 Location</th>
                <th>📏 Distance</th>
                <th>💰 Price</th>
                <th>⚡ Action</th>
              </tr>
            </thead>
            <tbody>
              {nearbyParkings.map((p, idx) => (
                <tr key={p._id} className="parking-row" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="parking-name">
                    <div className="name-with-icon">
                      <span>🅿️</span>
                      <span className="name-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="parking-location">{p.location}</td>
                  <td className="parking-distance">
                    <div className="distance-badge">
                      {p.distance.toFixed(2)} km
                    </div>
                  </td>
                  <td className="price">
                    <div className="price-tag">
                      ₹{p.price}
                      <span className="price-unit">/hr</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="book-btn"
                      onClick={() => navigate(`/user/book/${p._id}`)}
                    >
                      Book Now
                      <span className="btn-arrow">→</span>
                    </button>
                  </td>
                </tr>
              ))}
              {nearbyParkings.length === 0 && searchLatLng && (
                <tr>
                  <td colSpan="5" className="no-data">
                    <div className="empty-state">
                      <div className="empty-icon">🅿️</div>
                      <p>No parking spots found within 20km</p>
                      <span className="empty-hint">Try searching for a different location</span>
                    </div>
                  </td>
                </tr>
              )}
              {!searchLatLng && (
                <tr>
                  <td colSpan="5" className="no-data">
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <p>Search for a location to see parking spots</p>
                      <span className="empty-hint">Enter a city, landmark, or address above</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .search-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 32px;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        /* Hero Section */
        .hero-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.1);
          letter-spacing: -0.02em;
        }

        .hero-accent {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 18px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
        }

        /* Search Section */
        .search-section {
          max-width: 800px;
          margin: 0 auto 32px auto;
        }

        .search-container {
          position: relative;
          background: white;
          border-radius: 60px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }

        .search-container:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .search-icon {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 20px 60px 20px 60px;
          font-size: 16px;
          border: none;
          border-radius: 60px;
          outline: none;
          background: white;
          font-weight: 500;
          color: #1e293b;
        }

        .search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .search-loader {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }

        .search-result-badge {
          margin-top: 16px;
          text-align: center;
          padding: 12px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          border-radius: 60px;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          max-width: 1000px;
          margin: 0 auto 40px auto;
        }

        .stat-card {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .stat-icon {
          font-size: 40px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin-top: 4px;
        }

        /* Map Card */
        .map-card {
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          margin-bottom: 32px;
        }

        .map-header {
          padding: 20px 24px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .map-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .map-icon {
          font-size: 28px;
        }

        .map-header-left h3 {
          font-size: 20px;
          font-weight: 700;
        }

        .map-legend {
          display: flex;
          gap: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .legend-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }

        .legend-marker.red {
          background: #EA4335;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #EA4335;
        }

        .legend-marker.black {
          background: #000;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
        }

        /* Parking Card */
        .parking-card {
          background: white;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .header-left h3 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .header-left p {
          font-size: 13px;
          color: #64748b;
        }

        .result-count {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 8px 20px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 700;
        }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
        }

        .parking-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .parking-table thead th {
          text-align: left;
          padding: 16px;
          font-size: 13px;
          font-weight: 700;
          color: #5b6e8c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .parking-row {
          background: #ffffff;
          transition: all 0.3s ease;
          animation: slideUp 0.4s ease forwards;
          opacity: 0;
          transform: translateY(10px);
          border-radius: 16px;
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .parking-row:hover {
          background: #fefce8;
          transform: translateX(4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .parking-table td {
          padding: 18px 16px;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .parking-name .name-with-icon {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
        }

        .parking-location {
          color: #475569;
        }

        .distance-badge {
          display: inline-block;
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .price-tag {
          font-weight: 800;
          color: #16a34a;
          font-size: 18px;
        }

        .price-unit {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          margin-left: 2px;
        }

        .book-btn {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          padding: 10px 24px;
          border-radius: 40px;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .book-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(37,99,235,0.4);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .book-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Empty State */
        .no-data {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-icon {
          font-size: 64px;
          opacity: 0.5;
        }

        .empty-state p {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
        }

        .empty-hint {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Popup Styles */
        .parking-popup {
          padding: 8px;
          min-width: 180px;
        }

        .parking-popup h4 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .parking-popup p {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .popup-price {
          font-size: 20px;
          font-weight: 800;
          color: #16a34a;
          margin-bottom: 4px;
        }

        .popup-distance {
          font-size: 11px;
          color: #475569;
          margin-bottom: 12px;
        }

        .popup-book-btn {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        /* Responsive - Tablet */
        @media (max-width: 768px) {
          .search-page {
            padding: 12px;
          }

          .hero-title {
            font-size: 28px;
            line-height: 1.2;
          }

          .hero-subtitle {
            font-size: 14px;
          }

          .search-input {
            padding: 16px 50px;
            font-size: 14px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 22px;
          }

          .map-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .map-legend {
            flex-wrap: wrap;
            gap: 10px;
          }

          .parking-card {
            padding: 16px;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .parking-table {
            min-width: 700px;
          }

          .book-btn {
            padding: 8px 14px;
            font-size: 12px;
          }

          .parking-table td,
          .parking-table th {
            padding: 10px;
            font-size: 12px;
          }
        }

        /* Responsive - iPhone / Small Screens */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 24px;
          }

          .hero-subtitle {
            font-size: 13px;
          }

          .search-container {
            border-radius: 20px;
          }

          .search-input {
            border-radius: 20px;
          }

          .search-result-badge {
            font-size: 12px;
            padding: 10px;
          }

          .map-header-left h3 {
            font-size: 16px;
          }

          .legend-item {
            font-size: 11px;
          }

          .stat-icon {
            font-size: 28px;
          }

          .result-count {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}