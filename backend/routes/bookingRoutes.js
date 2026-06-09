import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔥 DEBUG — REMOVE AFTER CONFIRMING */
console.log(
  "📦 bookingController keys:",
  Object.keys(bookingController)
);

/* =====================================================
   ================= USER =================
===================================================== */

// USER BOOKINGS
router.get(
  "/my-bookings/:userId",
  bookingController.getMyBookings
);

/* =====================================================
   ================= QR ENTRY / EXIT =================
===================================================== */

// QR ENTRY SCAN
router.put(
  "/scan-entry/:id",
  authMiddleware,
  bookingController.scanEntry
);

// QR EXIT SCAN
router.put(
  "/scan-exit/:id",
  authMiddleware,
  bookingController.scanExit
);

/* =====================================================
   ================= ADMIN =================
===================================================== */

// GET ALL BOOKINGS
router.get(
  "/admin/all",
  authMiddleware,
  bookingController.getAllBookingsForAdmin
);

// CONFIRM BOOKING
router.put(
  "/admin/confirm/:bookingId",
  authMiddleware,
  bookingController.confirmBookingByAdmin
);

// CANCEL BOOKING
router.put(
  "/admin/cancel/:bookingId",
  authMiddleware,
  bookingController.cancelBookingByAdmin
);

/* =====================================================
   ================= FEEDBACK =================
===================================================== */

// SUBMIT FEEDBACK
router.post(
  "/feedback",
  authMiddleware,
  bookingController.submitFeedback
);

export default router;