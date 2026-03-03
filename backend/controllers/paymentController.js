import crypto from "crypto";
import Booking from "../models/Booking.js";
import razorpay from "../config/razorpay.js";

/* ⭐ RECEIPT UTILITIES */
import { generateQR } from "../utils/generateQR.js";
import { generateReceiptPDF } from "../utils/generateReceipt.js";
import { sendReceiptMail } from "../utils/sendReceiptMail.js";

/* =====================================================
   VERIFY PAYMENT + SAVE BOOKING
===================================================== */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData = {},
    } = req.body;

    console.log("🔥 FULL req.body:", req.body);
    console.log("📩 verifyPayment bookingData:", bookingData);

    /* 🔐 SIGNATURE VERIFY */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("🔐 Expected signature:", expectedSignature);
    console.log("🔐 Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    /* =====================================================
       ⭐ PREVENT DUPLICATE BOOKINGS
    ===================================================== */
    const existingBooking = await Booking.findOne({
      orderId: razorpay_order_id,
    });

    if (existingBooking) {
      console.log("⚠️ Duplicate booking prevented:", existingBooking._id);

      return res.status(200).json({
        success: true,
        message: "Booking already exists",
        booking: existingBooking,
      });
    }

    /* =====================================================
       ⭐ EMAIL CLEANING
    ===================================================== */
    const cleanedEmail =
      bookingData?.userEmail &&
      String(bookingData.userEmail).trim() !== ""
        ? String(bookingData.userEmail).trim().toLowerCase()
        : "";

    console.log("🧪 FINAL EMAIL TO SAVE:", cleanedEmail);

    const safeVehicle = bookingData?.vehicleType || "2-wheeler";
    const safeAmount = Number(bookingData?.amount || 0);
    const safeAddons = Array.isArray(bookingData?.addons)
      ? bookingData.addons
      : [];

    /* =====================================================
       ✅ BOOKING CREATION
    ===================================================== */
    const bookingPayload = { ...(bookingData || {}) };
    delete bookingPayload.userEmail;

    const newBooking = new Booking({
      ...bookingPayload,
      vehicleType: safeVehicle,
      addons: safeAddons,
      amount: safeAmount,
      userName: bookingData?.userName || "Test User",
      userEmail: cleanedEmail,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Reserved", // ✅ keep reserved (admin will confirm)
      receiptUrl: "",
      feedbackSubmitted: false,
    });

    await newBooking.save();

    console.log("✅ Booking saved after payment:", newBooking._id);

    /* =====================================================
       ⭐ RECEIPT GENERATION (SAFE + NON-BLOCKING)
    ===================================================== */
    try {
      // ⚠️ Only send immediately if you WANT instant receipt
      // Admin confirm will send final receipt again

      if (cleanedEmail && cleanedEmail.includes("@")) {
        console.log("📨 Preparing receipt email...");

        // 🔥 IMPORTANT — convert mongoose → plain object
        const plainBooking = newBooking.toObject();

        const qrImage = await generateQR(plainBooking);
        const pdfBuffer = await generateReceiptPDF(
          plainBooking,
          qrImage
        );

        console.log("📎 Final PDF buffer length:", pdfBuffer?.length);

        if (pdfBuffer && pdfBuffer.length > 1000) {
          await sendReceiptMail(cleanedEmail, pdfBuffer);
          console.log("📧 Receipt email sent from verifyPayment");
        } else {
          console.log("⚠️ PDF invalid — email skipped");
        }
      }
    } catch (mailErr) {
      // ✅ NEVER break booking flow
      console.error("❌ Receipt generation failed:", mailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & booking reserved",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};