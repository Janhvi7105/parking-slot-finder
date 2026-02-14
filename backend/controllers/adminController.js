import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Parking from "../models/Parking.js";
import bcrypt from "bcryptjs";

/* ================= ADMIN PROFILE ================= */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ================= UPDATE ADMIN PROFILE ================= */
export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const admin = await User.findById(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= ADMIN DASHBOARD STATS ================= */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const result = await Parking.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: "$capacity" },
        },
      },
    ]);

    const availableSlots =
      result.length > 0 ? result[0].totalCapacity : 0;

    res.json({
      totalUsers,
      totalBookings,
      availableSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

/* ================= GET ALL USERS (ADMIN USERS PAGE) ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users" });
  }
};
/* ================= DELETE USER BY ADMIN ================= */
export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};