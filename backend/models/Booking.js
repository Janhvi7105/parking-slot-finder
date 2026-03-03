import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    /* ================= USER DETAILS ================= */
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    // ⭐ HARDENED EMAIL FIELD (no logic change)
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      index: true,
    },

    /* ================= PARKING DETAILS ================= */
    parkingId: {
      type: String,
      required: true,
      index: true,
      trim: true,
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

    /* ================= ⭐ VEHICLE TYPE ================= */
    vehicleType: {
      type: String,
      enum: ["2-wheeler", "4-wheeler", "bus"],
      required: true,
      default: "2-wheeler", // ✅ DEFAULT UPDATED (your requirement)
      index: true,
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

    /* ================= PAYMENT DETAILS ================= */
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentId: {
      type: String,
      trim: true,
      index: true,
    },

    orderId: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      sparse: true,
    },

    // ⭐ NEW — supports refund tracking (no logic break)
    refundId: {
      type: String,
      trim: true,
      index: true,
    },

    /* ================= BOOKING STATUS ================= */
    status: {
      type: String,
      enum: ["Reserved", "Confirmed", "Cancelled"],
      default: "Reserved",
      index: true,
    },

    // ⭐ safer audit field
    confirmedAt: {
      type: Date,
      default: null,
    },

    /* ================= RECEIPT ================= */
    receiptUrl: {
      type: String,
      default: "",
    },

    /* ================= FEEDBACK ================= */
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        trim: true,
        default: "",
      },
      givenAt: {
        type: Date,
      },
    },

    feedbackSubmitted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ⭐ PERFORMANCE INDEX (SAFE — NO LOGIC CHANGE)
===================================================== */
bookingSchema.index({ parkingId: 1, fromTime: 1, toTime: 1 });

/* =====================================================
   ⭐ SAFE JSON TRANSFORM (prevents frontend issues)
===================================================== */
bookingSchema.set("toJSON", {
  transform: function (doc, ret) {
    if (!ret.feedback) {
      ret.feedback = {
        rating: null,
        comment: "",
        givenAt: null,
      };
    }
    return ret;
  },
});

export default mongoose.model("Booking", bookingSchema);