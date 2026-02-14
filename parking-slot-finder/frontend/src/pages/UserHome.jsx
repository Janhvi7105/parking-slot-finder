import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const [parkings, setParkings] = useState([]);
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
      .get("http://localhost:5000/api/parking")
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
    <div className="h-screen flex flex-col">

      {/* NAVBAR */}
      <div className="bg-slate-900 text-white flex justify-between items-center px-8 py-4 shadow">
        <h2 className="text-2xl font-bold">🚗 Parking Slot Finder</h2>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <div className="w-72 bg-gray-100 p-6 border-r overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Available Parkings</h3>

          <ul className="space-y-3">
            {parkings.map((p) => (
              <li
                key={p._id}
                className="bg-white p-3 rounded shadow hover:shadow-md"
              >
                <b>{p.name}</b>
                <p className="text-sm text-gray-600">{p.location}</p>
                <p className="font-semibold">₹ {p.price}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* MAP */}
        <div className="flex-1">
          <MapContainer
            center={[18.5204, 73.8567]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {parkings.map((p) => (
              <Marker key={p._id} position={[p.lat, p.lng]}>
                <Popup>
                  <b>{p.name}</b><br />
                  {p.location}<br />
                  Slots: {p.capacity}<br />
                  Price: ₹{p.price}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}
