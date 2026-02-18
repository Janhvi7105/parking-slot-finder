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
      <h1 className="mp-title">Manage Parking Slots</h1>

      {/* FORM */}
      <div className="mp-form-card">
        <div className="mp-form-grid">
          <input
            placeholder="Parking Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Search Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
          <input
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        </div>

        <button onClick={handleAddParking} className="mp-add-btn">
          ➕ Add Parking
        </button>
      </div>

      {/* MAP */}
      <div className="mp-map-card">
        <MapContainer center={mapCenter} zoom={13} className="mp-map">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToLocation position={mapCenter} />

          {marker && (
            <Marker position={marker} icon={googleRedMarker}>
              <Popup>{form.name || "Parking Location"}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* TABLE */}
      <div className="mp-table-card">
        <table className="mp-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Lat</th>
              <th>Lng</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parkings.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.location}</td>
                <td>{p.lat}</td>
                <td>{p.lng}</td>
                <td>{p.capacity}</td>
                <td>₹{p.price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/admin/edit-parking/${p._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteParking(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .mp-container { padding: 20px; }
        .mp-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(90deg,#7c3aed,#9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mp-form-card {
          background:#fff;
          padding:22px;
          border-radius:20px;
          box-shadow:0 20px 45px rgba(0,0,0,.1);
          margin-bottom:26px;
        }
        .mp-form-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:14px;
        }
        .mp-form-grid input {
          padding:12px 14px;
          border-radius:10px;
          border:1px solid #e5e7eb;
        }
        .mp-add-btn {
          margin-top:18px;
          background:linear-gradient(135deg,#7c3aed,#9333ea);
          color:#fff;
          padding:12px 22px;
          border:none;
          border-radius:12px;
          cursor:pointer;
          font-weight:600;
        }
        .mp-map-card {
          height:420px;
          border-radius:22px;
          overflow:hidden;
          box-shadow:0 30px 70px rgba(0,0,0,.18);
          margin-bottom:28px;
        }
        .mp-map { height:100%; width:100%; }
        .mp-table-card {
          background:#fff;
          padding:20px;
          border-radius:20px;
          box-shadow:0 20px 45px rgba(0,0,0,.1);
        }
        .mp-table {
          width:100%;
          border-collapse:separate;
          border-spacing:0 12px;
        }
        .mp-table th { text-align:left; font-size:13px; color:#64748b; }
        .mp-table tbody tr {
          background:#f9fafb;
          transition:.25s;
        }
        .mp-table tbody tr:hover {
          transform:translateY(-3px);
          box-shadow:0 18px 40px rgba(0,0,0,.12);
          background:#fff;
        }
        .mp-table td { padding:14px; font-size:14px; }
        .edit-btn {
          background:#facc15;
          border:none;
          padding:6px 12px;
          border-radius:8px;
          margin-right:6px;
          cursor:pointer;
        }
        .delete-btn {
          background:#ef4444;
          color:#fff;
          border:none;
          padding:6px 12px;
          border-radius:8px;
          cursor:pointer;
        }
      `}</style>
    </div>
  );
}
