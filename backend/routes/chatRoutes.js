import express from "express";
import { chatWithAI } from "../controllers/chatController.js";

const router = express.Router();

/* ================= CHAT ROUTE ================= */

// ✅ POST /api/chat
router.post("/", async (req, res, next) => {
  try {
    console.log("📩 Chat request received:", req.body.message); // debug

    await chatWithAI(req, res);

  } catch (error) {
    console.error("❌ Chat Route Error:", error);

    res.status(500).json({
      reply: "⚠️ Chat service temporarily unavailable. Please try again."
    });
  }
});

/* ================= TEST ROUTE (OPTIONAL BUT USEFUL) ================= */

// 👉 Check if route is working
router.get("/test", (req, res) => {
  res.json({ message: "Chat route working with Gemini ✅" });
});

export default router;