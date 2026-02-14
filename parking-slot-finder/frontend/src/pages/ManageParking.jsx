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

  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]); // Pune
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

  /* ================= AUTO LOCATION SEARCH (LIKE USER MAP) ================= */
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Parking Slots</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-4">
        <div className="grid grid-cols-4 gap-4">
          <input
            placeholder="Parking Name"
            className="border p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Search Location"
            className="border p-2"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />
          <input
            placeholder="Capacity"
            className="border p-2"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />
          <input
            placeholder="Price"
            className="border p-2"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddParking}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Add Parking
        </button>
      </div>

      {/* MAP */}
      <div className="bg-white rounded shadow mb-6" style={{ height: 420 }}>
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
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
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
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
            <tr key={p._id} className="text-center border">
              <td>{p.name}</td>
              <td>{p.location}</td>
              <td>{p.lat}</td>
              <td>{p.lng}</td>
              <td>{p.capacity}</td>
              <td>{p.price}</td>
              <td className="space-x-2">
                <button
                  onClick={() => navigate(`/admin/edit-parking/${p._id}`)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteParking(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
