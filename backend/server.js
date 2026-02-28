// ================= LOAD ENV (ABSOLUTE PATH - FINAL FIX) =================
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Always load backend/.env explicitly
dotenv.config({ path: path.join(__dirname, ".env") });

// ================= IMPORTS =================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ================= ROUTES =================
import authRoutes from "./routes/authRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ================= APP SETUP =================
const app = express();

app.use(cors());
app.use(express.json()); // ✅ JSON body parser
app.use(express.urlencoded({ extended: true })); // ✅ keeps your logic

/* =====================================================
   ⭐ SERVE RECEIPTS (UNCHANGED)
===================================================== */
app.use("/receipts", express.static(path.join(__dirname, "receipts")));

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// ================= ENV DEBUG (SAFE LOGGING) =================
console.log("ENV CHECK → RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID || "❌ NOT FOUND");
console.log(
  "ENV CHECK → RAZORPAY_KEY_SECRET LOADED:",
  !!process.env.RAZORPAY_KEY_SECRET
);

// 🚨 EXTRA SAFETY (does NOT change logic)
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn("⚠️ Razorpay keys missing in .env");
}

if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI missing in .env");
}

// ================= DATABASE =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check → http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });