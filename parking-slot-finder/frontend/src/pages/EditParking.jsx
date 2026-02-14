import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditParking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    price: "",
  });

  useEffect(() => {
    fetchParking();
  }, []);

  const fetchParking = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/parking/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setForm(res.data);
  };

  const updateParking = async () => {
    await axios.put(
      `http://localhost:5000/api/parking/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    navigate("/admin/manage-parking");
  };

  return (
    <div className="p-8 bg-white rounded shadow max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Edit Parking Slot</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) =>
            setForm({ ...form, capacity: e.target.value })
          }
        />

        <input
          className="border p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />
      </div>

      <div className="mt-6 space-x-4">
        <button
          onClick={updateParking}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Update Parking
        </button>

        <button
          onClick={() => navigate("/admin/manage-parking")}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
