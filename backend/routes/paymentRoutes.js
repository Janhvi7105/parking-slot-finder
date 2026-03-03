import express from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Booking from "../models/Booking.js";

const router = express.Router();

/* =========================================================
   CREATE ORDER
========================================================= */
router.post("/create-order", async (req, res) => {
  try {
    console.log("📥 Create order body:", req.body);

    const { amount } = req.body;

    // ✅ guard (same logic)
    if (!amount || isNaN(amount) || amount <= 0) {
      console.log("❌ Invalid amount:", amount);
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("🧾 Razorpay options:", options);

    const order = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", order?.id);

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error?.error?.description || error.message,
    });
  }
});

/* =========================================================
   VERIFY PAYMENT
========================================================= */
router.post("/verify-payment", async (req, res) => {
  try {
    console.log("📥 Verify payment body:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    // ✅ guard (same logic)
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingData
    ) {
      console.log("❌ Missing payment details");

      return res.status(400).json({
        success: false,
        message: "Missing payment or booking details",
      });
    }

    /* ================= SIGNATURE VERIFICATION ================= */
    // ✅✅✅ FIXED SPELLING HERE
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("🔐 Expected:", expectedSignature);
    console.log("🔐 Received:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch");

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    console.log("✅ Payment verified successfully");

    /* ================= PREVENT DUPLICATE BOOKINGS ================= */
    const existingBooking = await Booking.findOne({
      orderId: razorpay_order_id,
    });

    if (existingBooking) {
      console.log("⚠️ Duplicate booking prevented");

      return res.status(200).json({
        success: true,
        booking: existingBooking,
      });
    }

    /* ================= ⭐ EMAIL CLEAN ================= */
    const cleanedEmail =
      bookingData?.userEmail &&
      String(bookingData.userEmail).trim() !== ""
        ? String(bookingData.userEmail).trim().toLowerCase()
        : "";

    console.log("🚨 EMAIL BEFORE SAVE:", cleanedEmail);

    /* ================= SAVE BOOKING ================= */
    const booking = await Booking.create({
      userId: bookingData.userId,
      userName: "Test User", // unchanged

      // ⭐ CRITICAL — email now saved properly
      userEmail: cleanedEmail,

      parkingId: bookingData.parkingId,
      parkingName: bookingData.parkingName,
      location: bookingData.location,

      vehicleType: bookingData.vehicleType || "2-wheeler",

      bookingDate: new Date().toDateString(),
      fromTime: bookingData.fromTime,
      toTime: bookingData.toTime,

      addons: Array.isArray(bookingData.addons)
        ? bookingData.addons
        : [],

      amount: bookingData.amount,

      status: "Reserved",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    console.log("📦 Booking saved:", booking._id);
    console.log("📧 Saved booking email:", booking.userEmail);

    res.status(200).json({
      success: true,
      message: "Payment successful. Booking reserved.",
      booking,
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

export default router;