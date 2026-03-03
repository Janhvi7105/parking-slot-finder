import Booking from "../models/Booking.js";
import razorpay from "../config/razorpay.js";

/* 🔥 NEW IMPORTS */
import { generateQR } from "../utils/generateQR.js";
import { generateReceiptPDF } from "../utils/generateReceipt.js";
import { sendReceiptMail } from "../utils/sendReceiptMail.js";

/* ⭐ NEW — fallback user lookup */
import User from "../models/User.js";

/* ⭐ IMPORTANT */
import mongoose from "mongoose";

/* =====================================================
USER: GET MY BOOKINGS
===================================================== */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.params.userId?.trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const bookings = await Booking.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
ADMIN: GET ALL BOOKINGS
===================================================== */
export const getAllBookingsForAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch admin bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* =====================================================
ADMIN: CONFIRM BOOKING
===================================================== */
export const confirmBookingByAdmin = async (req, res) => {
  try {
    const bookingId = req.params.bookingId || req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "Reserved") {
      return res.status(400).json({
        success: false,
        message: "Only reserved bookings can be confirmed",
      });
    }

    /* ================= UPDATE STATUS ================= */
    booking.status = "Confirmed";
    booking.confirmedAt = new Date();
    await booking.save();

    /* ================= RECEIPT + EMAIL FLOW ================= */
    try {
      const updatedBooking = {
        ...booking.toObject(),
        vehicleType: booking.vehicleType || "2-wheeler",
      };

      console.log("🚗 Vehicle for receipt:", updatedBooking.vehicleType);

      // ✅ generate QR
      const qrImage = await generateQR(updatedBooking);

      // ✅ generate PDF
      const pdfBuffer = await generateReceiptPDF(
        updatedBooking,
        qrImage
      );

      /* =====================================================
         ⭐⭐⭐ BULLETPROOF EMAIL RESOLUTION ⭐⭐⭐
      ===================================================== */

      let emailToSend = updatedBooking.userEmail?.trim();

      console.log("🔎 booking.userEmail:", updatedBooking.userEmail);
      console.log("🔎 booking.userId:", updatedBooking.userId);

      const normalizedUserId = mongoose.Types.ObjectId.isValid(
        updatedBooking.userId
      )
        ? new mongoose.Types.ObjectId(updatedBooking.userId)
        : updatedBooking.userId;

      if (!emailToSend) {
        try {
          const user = await User.findById(normalizedUserId);
          console.log("🔎 user from DB:", user?.email);

          if (user?.email) {
            emailToSend = user.email.trim().toLowerCase();
            console.log(
              "📩 Email fetched from User model:",
              emailToSend
            );
          }
        } catch (err) {
          console.log("⚠️ Could not fetch user email");
        }
      }

      /* ================= FINAL SAFE GUARD (UPDATED) ================= */
      console.log("📨 FINAL EMAIL TO SEND:", emailToSend);

      if (
        emailToSend &&
        emailToSend.includes("@") &&
        pdfBuffer &&
        pdfBuffer.length > 1000
      ) {
        console.log("📎 Final PDF buffer length:", pdfBuffer.length);
        await sendReceiptMail(emailToSend, pdfBuffer);
        console.log("📧 Receipt email sent");
      } else {
        console.log(
          "⚠️ Skipping email — PDF not ready or email invalid"
        );
      }

      console.log("✅ Confirmation flow completed");
    } catch (mailError) {
      console.error("❌ Receipt/email error:", mailError);
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
    });
  } catch (error) {
    console.error("❌ Admin confirm error:", error);
    res.status(500).json({
      success: false,
      message: "Confirmation failed",
    });
  }
};

/* =====================================================
ADMIN: CANCEL BOOKING
===================================================== */
export const cancelBookingByAdmin = async (req, res) => {
  try {
    const bookingId = req.params.bookingId || req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    /* ================= AUTO REFUND ================= */
    if (booking.paymentId) {
      try {
        const refund = await razorpay.payments.refund(
          booking.paymentId,
          {
            amount: booking.amount * 100,
          }
        );

        console.log("✅ Refund successful:", refund.id);
      } catch (refundError) {
        console.error(
          "❌ Refund failed:",
          refundError?.error?.description || refundError
        );
        console.log("⚠️ Continuing cancellation anyway");
      }
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("❌ Admin cancel error:", error);
    res.status(500).json({
      success: false,
      message: "Cancellation failed",
    });
  }
};

/* =====================================================
USER: SUBMIT FEEDBACK
===================================================== */
export const submitFeedback = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    console.log("📝 Feedback request:", req.body);

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and rating are required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Feedback allowed only for confirmed bookings",
      });
    }

    if (booking.feedbackSubmitted) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });
    }

    booking.feedback = {
      rating,
      comment: comment || "",
      givenAt: new Date(),
    };

    booking.feedbackSubmitted = true;

    await booking.save();

    console.log("✅ Feedback saved:", booking._id);

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Submit feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};