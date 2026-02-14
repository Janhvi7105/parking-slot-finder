import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView() {
  return (
    <MapContainer center={[28.61, 77.23]} zoom={13} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[28.61, 77.23]}>
        <Popup>Parking Slot Available</Popup>
      </Marker>
    </MapContainer>
  );
}
