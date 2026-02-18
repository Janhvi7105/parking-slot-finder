import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER PROFILE ================= */

// GET logged-in user profile
router.get("/profile", authMiddleware, getUserProfile);

// UPDATE logged-in user profile
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
