import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* =====================================================
   GET USER PROFILE
   GET /api/users/profile
===================================================== */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 🔐 from JWT

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/* =====================================================
   UPDATE USER PROFILE
   PUT /api/users/profile
===================================================== */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 🔐 from JWT
    const { name, email, password } = req.body;

    const updateData = { name, email };

    /* 🔐 HASH PASSWORD ONLY IF PROVIDED */
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};
