const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Transporter setup with TLS bypass
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🚨 Fix for "self-signed certificate" error
  },
});

// 📩 Contact form handler
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("📩 Envoi d'un message de contact :", { name, email, subject, message });

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Tous les champs sont requis." });
  }

  try {
    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Nouveau message de contact : ${subject}`,
      text: `Nom : ${name}\nEmail : ${email}\nSujet : ${subject}\nMessage : ${message}`,
    });

    res.status(200).json({ success: true, message: "Message envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Échec de l'envoi de l'email :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi du message." });
  }
};

module.exports = { sendContactEmail };
