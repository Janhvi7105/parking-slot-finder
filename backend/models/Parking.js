import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Parking = mongoose.model("Parking", parkingSchema);

export default Parking;
