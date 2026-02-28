import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🔥 DEBUG — REMOVE AFTER CONFIRMING */
console.log(
  "📦 bookingController keys:",
  Object.keys(bookingController)
);

/* ================= USER ================= */
router.get(
  "/my-bookings/:userId",
  bookingController.getMyBookings
);

/* ================= ADMIN ================= */
router.get(
  "/admin/all",
  authMiddleware,
  bookingController.getAllBookingsForAdmin
);

router.put(
  "/admin/confirm/:bookingId",
  authMiddleware,
  bookingController.confirmBookingByAdmin
);

router.put(
  "/admin/cancel/:bookingId",
  authMiddleware,
  bookingController.cancelBookingByAdmin
);

/* ================= FEEDBACK ================= */
router.post(
  "/feedback",
  authMiddleware,
  bookingController.submitFeedback
);

export default router;