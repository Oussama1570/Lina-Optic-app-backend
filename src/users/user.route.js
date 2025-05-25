const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

let resetTokens = {}; // In-memory store

// ✅ Admin login
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminUser = await User.findOne({ username });
    if (!adminUser) {
      return res.status(404).send({ message: "Admin not found!" });
    }

    const isPasswordValid = adminUser.password === password; // use bcrypt in prod
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: adminUser._id, username: adminUser.username, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Failed to login as admin", error);
    return res.status(500).send({ message: "Failed to login as admin" });
  }
});

// ✅ User count
router.get("/admin/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Request reset password
router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ username: email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  resetTokens[token] = { email, expires: Date.now() + 3600000 };

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  console.log(`🔗 Reset link: ${resetLink}`);

  res.json({ message: "Password reset link sent" });
});

// ✅ Handle reset password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const user = await User.findOne({ username: data.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  delete resetTokens[token];

  res.json({ message: "Password has been reset successfully" });
});

module.exports = router;
