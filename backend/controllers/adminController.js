import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= ADMIN LOGIN ================= */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 VALIDATION
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

    // 🔐 Update password only if provided
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

/* ================= GET ALL USERS (ADMIN + USER) ================= */
export const getAllUsers = async (req, res) => {
  try {
    // 🔥 SHOW BOTH ADMIN & USERS
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

    // ❌ ADMIN PROTECTION
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
