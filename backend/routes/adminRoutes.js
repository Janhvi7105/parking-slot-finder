import express from "express";
import {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getAdminStats,
  getAllUsers,
  deleteUserByAdmin,
  getAllFeedbackForAdmin,
  confirmBooking,        // ⭐ NEW (safe)
  cancelBooking,         // ⭐ NEW (safe)
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN LOGIN (PUBLIC) ================= */
router.post("/login", adminLogin);

/* ================= ADMIN PROFILE ================= */
router.get("/profile", authMiddleware, getAdminProfile);
router.put("/profile", authMiddleware, updateAdminProfile);

/* ================= ADMIN DASHBOARD ================= */
router.get("/stats", authMiddleware, getAdminStats);

/* ================= ADMIN USERS ================= */
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, deleteUserByAdmin);

/* ================= ADMIN FEEDBACK ================= */
// ✅ Get all user feedback (rating + comment)
router.get("/feedback", authMiddleware, getAllFeedbackForAdmin);

/* =====================================================
   ⭐ ADMIN BOOKING ACTIONS (NEW — SAFE)
===================================================== */

// ✅ Confirm booking
router.put("/confirm/:id", authMiddleware, confirmBooking);

// ✅ Cancel booking + refund
router.put("/cancel/:id", authMiddleware, cancelBooking);

export default router;