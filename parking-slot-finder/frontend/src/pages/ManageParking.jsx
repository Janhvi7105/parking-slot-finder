import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAdminStats } from "../context/AdminStatsContext";
import { useNavigate } from "react-router-dom";

/* ================= GOOGLE STYLE RED MARKER ================= */
const googleRedMarker = L.divIcon({
  className: "",
  html: `
    <svg width="32" height="48" viewBox="0 0 24 36">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
        fill="#EA4335"
      />
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -40],
});

/* ================= MAP FLY CONTROLLER ================= */
function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
}

const GEOAPIFY_KEY = "4c66c984c4f44ec4a98c06cf4174acc6";

export default function ManageParking() {
  const { triggerRefresh } = useAdminStats();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
  });

  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]);
  const [marker, setMarker] = useState(null);
  const [parkings, setParkings] = useState([]);

  /* ================= FETCH PARKINGS ================= */
  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/parking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParkings(res.data);
    } catch (err) {
      console.error("Failed to fetch parkings", err);
    }
  };

  /* ================= AUTO LOCATION SEARCH ================= */
  useEffect(() => {
    if (!form.location.trim()) return;

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/search",
          {
            params: {
              text: form.location,
              apiKey: GEOAPIFY_KEY,
            },
          }
        );

        if (res.data.features.length > 0) {
          const lat = res.data.features[0].geometry.coordinates[1];
          const lng = res.data.features[0].geometry.coordinates[0];

          setMapCenter([lat, lng]);
          setMarker([lat, lng]);
        }
      } catch (err) {
        console.error("Location search failed", err);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [form.location]);

  /* ================= ADD PARKING ================= */
  const handleAddParking = async () => {
    if (!marker) return alert("Please select a valid location");

    const data = {
      name: form.name,
      location: form.location,
      capacity: form.capacity,
      price: form.price,
      lat: marker[0],
      lng: marker[1],
    };

    try {
      await axios.post(
        "http://localhost:5000/api/parking/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchParkings();
      triggerRefresh();

      setForm({ name: "", location: "", capacity: "", price: "" });
      setMarker(null);
    } catch (err) {
      console.error("Failed to add parking", err);
    }
  };

  /* ================= DELETE ================= */
  const deleteParking = async (id) => {
    if (!window.confirm("Delete this parking?")) return;

    await axios.delete(
      `http://localhost:5000/api/parking/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchParkings();
    triggerRefresh();
  };

  return (
    <div className="mp-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="mp-content">
        {/* Header */}
        <div className="mp-header">
          <div className="mp-header-left">
            <div className="mp-header-icon">🅿️</div>
            <div>
              <h1 className="mp-title">Manage Parking Slots</h1>
              <p className="mp-subtitle">Add, edit, and manage all parking locations</p>
            </div>
          </div>
          <div className="mp-stats">
            <div className="stat-chip">
              <span className="stat-number">{parkings.length}</span>
              <span className="stat-label">Total Slots</span>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="mp-form-card">
          <div className="form-header">
            <span className="form-icon">➕</span>
            <h3>Add New Parking Slot</h3>
            <span className="form-badge">Location required</span>
          </div>
          
          <div className="mp-form-grid">
            <div className="input-group">
              <label>Parking Name</label>
              <input
                placeholder="e.g., City Center Parking"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Location Search</label>
              <input
                placeholder="Search for location on map"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Capacity</label>
              <input
                placeholder="Number of slots"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Price per Hour (₹)</label>
              <input
                placeholder="Amount in rupees"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleAddParking} className="mp-add-btn">
              <span>➕</span>
              <span>Add Parking Slot</span>
              <span className="btn-arrow">→</span>
            </button>
            {marker && (
              <div className="location-confirm">
                ✓ Location selected on map
              </div>
            )}
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mp-map-card">
          <div className="map-header">
            <div className="map-header-left">
              <span className="map-icon">🗺️</span>
              <h3>Location Preview</h3>
            </div>
            <div className="map-legend">
              <span className="legend-dot red"></span>
              <span>Selected Location</span>
            </div>
          </div>
          <MapContainer center={mapCenter} zoom={13} className="mp-map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FlyToLocation position={mapCenter} />

            {marker && (
              <Marker position={marker} icon={googleRedMarker}>
                <Popup>
                  <div className="custom-popup">
                    <strong>{form.name || "Parking Location"}</strong>
                    <br />
                    <span>📍 {form.location || "Address will appear here"}</span>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* TABLE SECTION */}
        <div className="mp-table-card">
          <div className="table-header">
            <div className="table-header-left">
              <span className="table-icon">📋</span>
              <h3>All Parking Locations</h3>
            </div>
            <div className="table-search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search parking..." />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="mp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Coordinates</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {parkings.map((p, idx) => (
                  <tr key={p._id} className="parking-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                    <td className="parking-name-cell">
                      <div className="name-with-icon">
                        <span className="parking-icon-small">🅿️</span>
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="location-cell">{p.location}</td>
                    <td className="coord-cell">
                      <span className="coord-badge">
                        {parseFloat(p.lat).toFixed(4)}°, {parseFloat(p.lng).toFixed(4)}°
                      </span>
                    </td>
                    <td className="capacity-cell">
                      <span className="capacity-badge">{p.capacity} slots</span>
                    </td>
                    <td className="price-cell">₹{p.price}/hr</td>
                    <td className="actions-cell">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/edit-parking/${p._id}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteParking(p._id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {parkings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      <div className="empty-state">
                        <span className="empty-icon">🏢</span>
                        <p>No parking slots added yet</p>
                        <span className="empty-hint">Use the form above to add your first parking location</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .mp-container {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
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

        .mp-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .mp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 24px 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .mp-header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .mp-header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 10px 20px rgba(16,185,129,0.3);
        }

        .mp-title {
          font-size: 28px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .mp-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.9);
        }

        .stat-chip {
          background: rgba(255,255,255,0.15);
          padding: 12px 20px;
          border-radius: 60px;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
        }

        /* Form Card */
        .mp-form-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-icon {
          font-size: 24px;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .form-badge {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .mp-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .input-group input {
          padding: 12px 16px;
          border-radius: 14px;
          border: 2px solid #e2e8f0;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .input-group input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .mp-add-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 14px 28px;
          border: none;
          border-radius: 60px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .mp-add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16,185,129,0.4);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .mp-add-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        .location-confirm {
          background: #dcfce7;
          color: #16a34a;
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 13px;
          font-weight: 600;
        }

        /* Map Card */
        .mp-map-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          overflow: hidden;
          margin-bottom: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .map-header {
          padding: 16px 24px;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
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
        }

        .map-legend {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.red {
          background: #EA4335;
          box-shadow: 0 0 0 2px white, 0 0 0 4px #EA4335;
        }

        .mp-map {
          height: 420px;
          width: 100%;
        }

        .custom-popup {
          padding: 8px;
        }

        .custom-popup strong {
          font-size: 14px;
          color: #1e293b;
        }

        .custom-popup span {
          font-size: 11px;
          color: #64748b;
        }

        /* Table Card */
        .mp-table-card {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(10px);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .table-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .table-icon {
          font-size: 22px;
        }

        .table-header-left h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .table-search {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
        }

        .table-search input {
          padding: 10px 16px 10px 36px;
          border: 2px solid #e2e8f0;
          border-radius: 40px;
          font-size: 13px;
          width: 250px;
          transition: all 0.3s ease;
        }

        .table-search input:focus {
          outline: none;
          border-color: #10b981;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .mp-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .mp-table thead th {
          text-align: left;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .parking-row {
          background: #ffffff;
          transition: all 0.3s ease;
          animation: slideIn 0.4s ease forwards;
          opacity: 0;
          transform: translateX(-10px);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .parking-row:hover {
          background: #fefce8;
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        .mp-table td {
          padding: 16px;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .parking-name-cell .name-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        .parking-icon-small {
          font-size: 18px;
        }

        .coord-badge {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-family: monospace;
        }

        .capacity-badge {
          background: #e0e7ff;
          color: #4338ca;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .price-cell {
          font-weight: 700;
          color: #16a34a;
        }

        .actions-cell {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .edit-btn {
          background: #fbbf24;
          color: #78350f;
          border: none;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn:hover {
          transform: scale(1.05);
          background: #f59e0b;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          transform: scale(1.05);
          background: #dc2626;
        }

        .empty-table {
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
          font-size: 16px;
          font-weight: 600;
          color: #475569;
        }

        .empty-hint {
          font-size: 13px;
          color: #94a3b8;
        }

        /* Responsive - Tablet */
        @media (max-width: 768px) {
          .mp-content {
            padding: 12px;
          }

          .mp-header {
            flex-direction: column;
            text-align: center;
            padding: 18px;
            border-radius: 20px;
          }

          .mp-header-left {
            flex-direction: column;
            gap: 12px;
          }

          .mp-title {
            font-size: 22px;
          }

          .mp-subtitle {
            font-size: 13px;
          }

          .stat-chip {
            width: 100%;
          }

          .mp-form-card,
          .mp-map-card,
          .mp-table-card {
            padding: 16px;
            border-radius: 20px;
          }

          .form-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .form-badge {
            align-self: flex-start;
          }

          .mp-form-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .input-group input {
            width: 100%;
          }

          .form-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .mp-add-btn {
            width: 100%;
            justify-content: center;
          }

          .location-confirm {
            width: 100%;
            text-align: center;
          }

          .map-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .mp-map {
            height: 300px;
          }

          .table-header {
            flex-direction: column;
            align-items: stretch;
          }

          .table-search {
            width: 100%;
          }

          .table-search input {
            width: 100%;
          }

          .table-wrapper {
            overflow-x: auto;
          }

          .actions-cell {
            flex-direction: column;
          }

          .edit-btn,
          .delete-btn {
            width: 100%;
          }
        }

        /* Responsive - iPhone / Small Screens */
        @media (max-width: 480px) {
          .mp-content {
            padding: 8px;
          }

          .mp-title {
            font-size: 20px;
          }

          .mp-header-icon {
            width: 48px;
            height: 48px;
            font-size: 22px;
          }

          .mp-form-card,
          .mp-map-card,
          .mp-table-card {
            padding: 12px;
          }

          .form-header h3 {
            font-size: 16px;
          }

          .mp-add-btn {
            padding: 12px;
            font-size: 14px;
          }

          .mp-map {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}