import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    /* ================= USER DETAILS ================= */
    userId: {
      type: String,              // ✅ TEMP string (JWT ObjectId later)
      required: true,
      index: true,
    },

    userName: {
      type: String,              // 👤 Admin reservation view
      required: true,
      trim: true,
    },

    /* ================= PARKING DETAILS ================= */
    parkingId: {
      type: String,
      required: true,
      index: true,
    },

    parkingName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    /* ================= TIME DETAILS ================= */
    bookingDate: {
      type: String,
      default: () => new Date().toDateString(),
    },

    fromTime: {
      type: String,
      required: true,
    },

    toTime: {
      type: String,
      required: true,
    },

    /* ================= ADDON SERVICES ================= */
    addons: [
      {
        name: { type: String, trim: true },
        price: { type: Number, default: 0 },
      },
    ],
    default: [],

    /* ================= PAYMENT DETAILS ================= */
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentId: {
      type: String,
      trim: true,
    },

    orderId: {
      type: String,
      trim: true,
      unique: true,              // 🔥 PREVENT DUPLICATE BOOKINGS
      index: true,
    },

    /* ================= BOOKING STATUS ================= */
    status: {
      type: String,
      enum: ["Reserved", "Confirmed", "Cancelled"],
      default: "Reserved",
    },

    confirmedAt: {
      type: Date,
    },

    /* ================= FEEDBACK ================= */
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
      givenAt: {
        type: Date,
      },
    },

    feedbackSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Booking", bookingSchema);
