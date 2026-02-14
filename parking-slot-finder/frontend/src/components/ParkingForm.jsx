import { useState } from "react";
import axios from "axios";

export default function ParkingForm() {
  const [slot, setSlot] = useState({ slotNumber:"", lat:"", lng:"" });

  const addSlot = async () => {
    await axios.post("http://localhost:5000/api/parking/add", {
      slotNumber: slot.slotNumber,
      location: { latitude: slot.lat, longitude: slot.lng }
    });
    alert("Slot Added");
  };

  return (
    <div>
      <input placeholder="Slot Number" onChange={e=>setSlot({...slot,slotNumber:e.target.value})}/>
      <input placeholder="Latitude" onChange={e=>setSlot({...slot,lat:e.target.value})}/>
      <input placeholder="Longitude" onChange={e=>setSlot({...slot,lng:e.target.value})}/>
      <button onClick={addSlot}>Add Slot</button>
    </div>
  );
}
