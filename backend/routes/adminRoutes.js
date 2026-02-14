import express from "express";
import {
  getAdminProfile,
  updateAdminProfile,
  getAdminStats,
  getAllUsers,
  deleteUserByAdmin 
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN PROFILE ================= */
router.get("/profile", authMiddleware, getAdminProfile);
router.put("/profile", authMiddleware, updateAdminProfile);

/* ================= ADMIN DASHBOARD ================= */
router.get("/stats", authMiddleware, getAdminStats);

/* ================= ADMIN USERS ================= */
router.get("/users", authMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, deleteUserByAdmin);

export default router;
