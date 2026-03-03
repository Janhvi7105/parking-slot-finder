import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import { sendReceiptMail } from "../utils/sendReceiptMail.js";

/* ⭐ NEW — REQUIRED FOR RECEIPT */
import { generateQR } from "../utils/generateQR.js";
import { generateReceiptPDF } from "../utils/generateReceipt.js";

/* =====================================================
   ⭐ SAFE LAZY RAZORPAY (PREVENTS STARTUP CRASH)
===================================================== */
let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("❌ Razorpay keys missing in environment");
      throw new Error("Razorpay keys missing in environment");
    }

    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
};

/* ================= ADMIN LOGIN ================= */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Admin login failed",
    });
  }
};

/* ================= ADMIN PROFILE ================= */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error("❌ Admin profile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
};

/* ================= UPDATE ADMIN PROFILE ================= */
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("❌ Update admin error:", err);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* ================= ADMIN DASHBOARD STATS ================= */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBookings = await Booking.countDocuments();

    const capacityResult = await Parking.aggregate([
      { $group: { _id: null, total: { $sum: "$capacity" } } },
    ]);

    const availableSlots =
      capacityResult.length > 0 ? capacityResult[0].total : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalBookings,
      availableSlots,
    });
  } catch (err) {
    console.error("❌ Admin stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

/* ================= DELETE USER ================= */
export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete admin",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* =====================================================
   ⭐ ADMIN CONFIRM BOOKING (FINAL FIX)
===================================================== */
export const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ ORIGINAL LOGIC
    booking.status = "Confirmed";
    booking.confirmedAt = new Date();
    await booking.save();

    // ✅ RECEIPT FLOW (SAFE)
    try {
      if (booking.userEmail && booking.userEmail.includes("@")) {
        console.log("📨 Preparing receipt for:", booking.userEmail);

        const qrImage = await generateQR(booking);
        const pdfBuffer = await generateReceiptPDF(booking, qrImage);

        console.log("📎 Final PDF buffer length:", pdfBuffer?.length);

        if (pdfBuffer && pdfBuffer.length > 1000) {
          await sendReceiptMail(booking.userEmail, pdfBuffer);
          console.log("📧 Receipt email sent");
        } else {
          console.log("⚠️ PDF invalid — email skipped");
        }
      }
    } catch (e) {
      console.error("❌ Receipt flow failed:", e.message);
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed",
    });
  } catch (err) {
    console.error("❌ Confirm booking error:", err);
    res.status(500).json({
      success: false,
      message: "Confirm failed",
    });
  }
};

/* =====================================================
   ⭐ ADMIN CANCEL + REFUND
===================================================== */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.paymentId) {
      return res.status(400).json({
        success: false,
        message: "No payment found for refund",
      });
    }

    const razorpay = getRazorpay();

    const refund = await razorpay.payments.refund(booking.paymentId, {
      amount: booking.amount * 100,
    });

    booking.status = "Cancelled";
    booking.refundId = refund.id;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled & refunded",
    });
  } catch (err) {
    console.error("❌ Cancel booking error:", err);
    res.status(500).json({
      success: false,
      message: "Refund failed",
    });
  }
};

/* =====================================================
   ✅ ADMIN: GET ALL FEEDBACK
===================================================== */
export const getAllFeedbackForAdmin = async (req, res) => {
  try {
    const feedbacks = await Booking.find({
      feedbackSubmitted: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      feedbacks,
    });
  } catch (err) {
    console.error("❌ Fetch feedback error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};