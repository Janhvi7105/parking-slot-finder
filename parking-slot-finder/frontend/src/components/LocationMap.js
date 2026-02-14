import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// red pin icon
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
});

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center]);

  return null;
}

export default function LocationMap({ position }) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "350px", width: "100%", borderRadius: "10px" }}
    >
      <ChangeView center={position} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={markerIcon} />
    </MapContainer>
  );
}
