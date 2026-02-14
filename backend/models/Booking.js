import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parking",
    },
    date: String,
    time: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
