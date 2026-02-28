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
      lowercase: true, // ✅ ensures consistent email
      default: "",     // ✅ keeps your existing behavior
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
      index: true, // ✅ helps admin search payments
    },

    orderId: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      sparse: true,
    },

    /* ================= BOOKING STATUS ================= */
    status: {
      type: String,
      enum: ["Reserved", "Confirmed", "Cancelled"],
      default: "Reserved",
      index: true, // ✅ faster filtering in admin panel
    },

    confirmedAt: {
      type: Date,
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
        default: null, // ✅ prevents undefined issues
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
      index: true, // ✅ admin can filter who gave feedback
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
   ⭐ SAFE JSON TRANSFORM (prevents frontend issues)
===================================================== */
bookingSchema.set("toJSON", {
  transform: function (doc, ret) {
    // ensure feedback object always exists
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