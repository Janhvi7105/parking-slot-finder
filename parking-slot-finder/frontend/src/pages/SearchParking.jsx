import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ================= GOOGLE STYLE RED MARKER (SEARCH LOCATION) ================= */
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
});

/* ================= PARKING (P) MARKER ================= */
const parkingMarker = L.divIcon({
  className: "",
  html: `
    <svg width="34" height="48" viewBox="0 0 24 36">
      <path
        d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z"
        fill="#000000"
      />
      <circle cx="12" cy="12" r="7" fill="white"/>
      <text
        x="12"
        y="16"
        text-anchor="middle"
        font-size="12"
        font-weight="bold"
        fill="black"
      >
        P
      </text>
    </svg>
  `,
  iconSize: [34, 48],
  iconAnchor: [17, 48],
  popupAnchor: [0, -40],
});

/* ================= DISTANCE CALCULATION ================= */
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

/* ================= MAP CONTROLLER ================= */
function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
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

  /* ================= FETCH ALL PARKINGS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/parking")
      .then((res) => setParkings(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ================= AUTO LOCATION SEARCH ================= */
  useEffect(() => {
    if (!search.trim()) return;

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: search,
              format: "json",
              limit: 1,
            },
          }
        );

        if (res.data.length > 0) {
          const lat = parseFloat(res.data[0].lat);
          const lon = parseFloat(res.data[0].lon);
          setSearchLatLng([lat, lon]);
        }
      } catch (err) {
        console.error("Geocoding error", err);
      }
    }, 600);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  /* ================= FILTER + SORT NEARBY ================= */
  const NEARBY_RADIUS_KM = 20;

  const nearbyParkings = searchLatLng
    ? parkings
        .map((p) => {
          const distance = getDistanceKm(
            searchLatLng[0],
            searchLatLng[1],
            Number(p.lat),
            Number(p.lng)
          );
          return { ...p, distance };
        })
        .filter((p) => p.distance <= NEARBY_RADIUS_KM)
        .sort((a, b) => a.price - b.price)
    : [];

  return (
    <div>
      <h2>Search & Compare Parking</h2>

      {/* SEARCH INPUT */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Enter location"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      {/* MAP */}
      <div style={{ height: "400px", marginBottom: "20px" }}>
        <MapContainer
          center={defaultCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {searchLatLng && <FlyToLocation position={searchLatLng} />}

          {/* 🔴 SEARCH LOCATION */}
          {searchLatLng && (
            <Marker position={searchLatLng} icon={googleRedMarker}>
              <Popup>{search}</Popup>
            </Marker>
          )}

          {/* ⚫ AVAILABLE PARKINGS */}
          {nearbyParkings.map((p) => (
            <Marker
              key={p._id}
              position={[p.lat, p.lng]}
              icon={parkingMarker}
            >
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
      <h3>Available Parking Spots (Near You)</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#111827", color: "#fff" }}>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Distance (km)</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {nearbyParkings.map((p) => (
            <tr key={p._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{p.name}</td>
              <td>{p.location}</td>
              <td>{p.distance.toFixed(2)}</td>
              <td>₹{p.price}</td>
              <td>
                <button
                  onClick={() => navigate(`/user/book/${p._id}`)}
                  style={{
                    background: "#0ea5e9",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Book Now
                </button>
              </td>
            </tr>
          ))}

          {nearbyParkings.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: "15px" }}>
                No nearby parking found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
