const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

let resetTokens = {};

// ✅ Request password reset
router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    resetTokens[token] = { email, expires: Date.now() + 3600000 };

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log(`🔗 Password reset link: ${resetLink}`);

    res.status(200).json({ message: "Password reset link sent" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
