const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const admin = require("../utils/firebaseAdmin"); // Firebase Admin SDK

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

/**
 * ✅ Admin Login (MongoDB only)
 */
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminUser = await User.findOne({ username });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    const isPasswordValid = adminUser.password === password; // In production: use bcrypt.compare
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password!" });
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
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Failed to login as admin" });
  }
});

/**
 * ✅ Count MongoDB Admin Users
 */
router.get("/admin/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error("User count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Firebase: Send Reset Password Email to Firebase Users
 */
const sendEmail = require("../utils/sendEmail");

router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;

  try {
    const actionCodeSettings = {
  url: "https://lina-optic-app-frontend-khav.vercel.app/login", // ✅ or your real login/reset page
  handleCodeInApp: true,
};

const resetLink = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);


    console.log("🔗 Firebase reset link:", resetLink);

    // 📧 Improved email content
    const subject = "🔐 Réinitialisation de votre mot de passe - Lina Optic";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #c9202a;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Pour continuer, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #c9202a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;" target="_blank">
            Réinitialiser le mot de passe
          </a>
        </p>
        <p>⚠️ Ce lien est valable pendant une durée limitée (1 heure). Si vous n'avez pas fait cette demande, vous pouvez ignorer ce message en toute sécurité.</p>
        <br />
        <p>Merci pour votre confiance,<br><strong>L'équipe Lina Optic</strong></p>
      </div>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      message: "📩 Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception."
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email Firebase:", error.message);
    res.status(404).json({
      message: "❌ Impossible d’envoyer le lien. Vérifiez que l’adresse email est correcte ou réessayez plus tard."
    });
  }
});



module.exports = router;

