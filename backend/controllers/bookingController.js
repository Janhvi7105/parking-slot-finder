import Booking from "../models/Booking.js";
import razorpay from "../config/razorpay.js";

/* 🔥 NEW IMPORTS */
import { generateQR } from "../utils/generateQR.js";
import { generateReceiptPDF } from "../utils/generateReceipt.js";
import { sendReceiptMail } from "../utils/sendReceiptMail.js";

/* ⭐ NEW — fallback user lookup */
import User from "../models/User.js";

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

    // ✅ ensures admin receives feedback data
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
      const updatedBooking = booking;

      // ✅ generate QR
      const qrImage = await generateQR(updatedBooking);

      const pdfBuffer = await generateReceiptPDF(
        updatedBooking,
        qrImage
      );

      /* =====================================================
         ⭐⭐⭐ ROBUST EMAIL RESOLUTION ⭐⭐⭐
      ===================================================== */

      let emailToSend = updatedBooking.userEmail;

      // ⭐ FALLBACK — fetch from User collection
      if (!emailToSend || emailToSend === "") {
        try {
          const user = await User.findById(updatedBooking.userId);

          if (user?.email) {
            emailToSend = user.email;
            console.log(
              "📩 Email fetched from User model:",
              emailToSend
            );
          }
        } catch (err) {
          console.log("⚠️ Could not fetch user email");
        }
      }

      // ⭐ FINAL SEND
      if (emailToSend) {
        await sendReceiptMail(emailToSend, pdfBuffer);
        console.log("📧 Receipt email sent");
      } else {
        console.log("❌ No email available — mail skipped");
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

    // ✅ validation
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

    // ✅ only confirmed bookings can submit feedback
    if (booking.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Feedback allowed only for confirmed bookings",
      });
    }

    // ✅ prevent duplicate feedback
    if (booking.feedbackSubmitted) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });
    }

    /* ================= SAVE FEEDBACK ================= */
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