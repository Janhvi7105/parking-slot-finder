const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get profile
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
