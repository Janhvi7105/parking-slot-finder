import express from "express";
import {
  getMyBookings,
  getAllBookingsForAdmin,
  confirmBookingByAdmin,
  cancelBookingByAdmin,
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


/* ================= USER ROUTES ================= */
// User booking history
router.get("/my-bookings/:userId", getMyBookings);

/* ================= ADMIN ROUTES ================= */
// Get all reservations (Admin)
router.get("/admin/all", authMiddleware, getAllBookingsForAdmin);

// Confirm booking (Reserved → Confirmed)
router.put(
  "/admin/confirm/:bookingId",
  authMiddleware,
  confirmBookingByAdmin
);

// Cancel booking (Reserved → Cancelled)
router.put(
  "/admin/cancel/:bookingId",
  authMiddleware,
  cancelBookingByAdmin
);

export default router;
