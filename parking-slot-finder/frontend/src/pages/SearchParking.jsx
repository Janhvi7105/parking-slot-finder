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
  const debounceRef = useRef(null);
  const defaultCenter = [12.2958, 76.6394]; // Mysuru

  /* FETCH PARKINGS */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/parking")
      .then((res) => setParkings(res.data))
      .catch(console.error);
  }, []);

  /* SEARCH LOCATION */
  useEffect(() => {
    if (!search.trim()) return;
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        { params: { q: search, format: "json", limit: 1 } }
      );
      if (res.data.length > 0) {
        setSearchLatLng([
          parseFloat(res.data[0].lat),
          parseFloat(res.data[0].lon),
        ]);
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
      <h2 className="search-title">Search & Compare Parking</h2>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search location (e.g. Pune)"
        className="search-input"
      />

      {/* MAP */}
      <div className="map-card">
        <MapContainer center={defaultCenter} zoom={12} style={{ height: "400px" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {searchLatLng && <FlyToLocation position={searchLatLng} />}
          {searchLatLng && (
            <Marker position={searchLatLng} icon={googleRedMarker}>
              <Popup>{search}</Popup>
            </Marker>
          )}
          {nearbyParkings.map((p) => (
            <Marker key={p._id} position={[p.lat, p.lng]} icon={parkingMarker}>
              <Popup>
                <strong>{p.name}</strong><br />
                {p.location}<br />
                ₹{p.price}<br />
                {p.distance.toFixed(2)} km away
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* TABLE */}
      <div className="parking-card">
        <h3>Available Parking Spots (Near You)</h3>

        <table className="parking-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Distance</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {nearbyParkings.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.location}</td>
                <td>{p.distance.toFixed(2)} km</td>
                <td className="price">₹{p.price}</td>
                <td>
                  <button
                    className="book-btn"
                    onClick={() => navigate(`/user/book/${p._id}`)}
                  >
                    Book Now
                  </button>
                </td>
              </tr>
            ))}
            {nearbyParkings.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">
                  No nearby parking found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .search-page {
          padding: 30px;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
          min-height: 100vh;
        }

        .search-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 18px;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-input {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          margin-bottom: 22px;
          outline: none;
          transition: 0.3s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .search-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
        }

        .map-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0,0,0,0.15);
          margin-bottom: 28px;
          background: #fff;
        }

        .parking-card {
          background: #fff;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.12);
        }

        .parking-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .parking-table tbody tr {
          background: #f9fafb;
          border-radius: 14px;
          transition: 0.25s;
        }

        .parking-table tbody tr:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.12);
        }

        .parking-table th,
        .parking-table td {
          padding: 14px;
          text-align: left;
        }

        .price {
          font-weight: 700;
          color: #16a34a;
        }

        .book-btn {
          background: linear-gradient(135deg, #2563eb, #06b6d4);
          color: #fff;
          padding: 8px 18px;
          border-radius: 999px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .book-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 30px rgba(37,99,235,0.45);
        }

        .no-data {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
