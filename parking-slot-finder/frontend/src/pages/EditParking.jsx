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
    <div className="ep-wrapper">
      <h1 className="ep-title">Edit Parking Slot</h1>

      <div className="ep-card">
        <div className="ep-grid">
          <div className="ep-field">
            <label>Parking Name</label>
            <input
              placeholder="Parking name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label>Location</label>
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label>Capacity</label>
            <input
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) =>
                setForm({ ...form, capacity: e.target.value })
              }
            />
          </div>

          <div className="ep-field">
            <label>Price (₹)</label>
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>
        </div>

        <div className="ep-actions">
          <button className="ep-update" onClick={updateParking}>
            Update Parking
          </button>

          <button
            className="ep-cancel"
            onClick={() => navigate("/admin/manage-parking")}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .ep-wrapper {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc, #eef2ff);
        }

        .ep-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 25px;
          background: linear-gradient(90deg, #7c3aed, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ep-card {
          max-width: 900px;
          background: #ffffff;
          padding: 32px;
          border-radius: 22px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.12);
          animation: fadeUp 0.4s ease;
        }

        .ep-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .ep-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ep-field label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .ep-field input {
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          outline: none;
          transition: 0.25s;
        }

        .ep-field input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.15);
        }

        .ep-actions {
          margin-top: 32px;
          display: flex;
          gap: 16px;
        }

        .ep-update {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          padding: 14px 28px;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .ep-update:hover {
          transform: scale(1.05);
          box-shadow: 0 16px 40px rgba(34,197,94,0.45);
        }

        .ep-cancel {
          background: #e5e7eb;
          color: #374151;
          padding: 14px 28px;
          border: none;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .ep-cancel:hover {
          background: #d1d5db;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
