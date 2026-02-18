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
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

/* =========================================================
   VERIFY PAYMENT
========================================================= */
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !bookingData
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment or booking details",
      });
    }

    /* ================= SIGNATURE VERIFICATION ================= */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
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
      return res.status(200).json({
        success: true,
        booking: existingBooking,
      });
    }

    /* ================= SAVE BOOKING ================= */
    const booking = await Booking.create({
      userId: bookingData.userId,          // "TEST_USER_ID" (JWT later)
      userName: "Test User",               // ✅ REQUIRED FIELD (TEMP)

      parkingId: bookingData.parkingId,
      parkingName: bookingData.parkingName,
      location: bookingData.location,

      bookingDate: new Date().toDateString(),
      fromTime: bookingData.fromTime,
      toTime: bookingData.toTime,

      amount: bookingData.amount,

      status: "Reserved",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    console.log("📦 Booking saved:", booking._id);

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
