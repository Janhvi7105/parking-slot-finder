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
app.use(express.json());

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

// ================= ENV DEBUG (REMOVE IN PROD) =================
console.log("ENV CHECK → RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "ENV CHECK → RAZORPAY_KEY_SECRET LOADED:",
  !!process.env.RAZORPAY_KEY_SECRET
);

// ================= DATABASE =================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
