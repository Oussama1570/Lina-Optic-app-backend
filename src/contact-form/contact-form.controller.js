const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ✅ Your Gmail address
    pass: process.env.EMAIL_PASS, // ✅ App password (not Gmail password)
  },
});

// ✅ Contact form controller
const sendContactEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // 🔎 Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "🚫 Tous les champs sont obligatoires. Veuillez vérifier le formulaire.",
    });
  }

  try {
    // ✅ Prepare HTML email content
    const htmlContent = `
      <h2 style="color:#2a4eaa;">📩 Nouveau message de contact</h2>
      <p><strong>👤 Nom :</strong> ${name}</p>
      <p><strong>📧 Email :</strong> ${email}</p>
      <p><strong>🎯 Sujet :</strong> ${subject}</p>
      <p><strong>💬 Message :</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="font-size:0.9rem; color:#888;">Ce message a été envoyé depuis le site Lina Optic.</p>
    `;

    // ✅ Send email
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `📬 Nouveau message : ${subject}`,
      html: htmlContent,
    });

    // ✅ Success response
    res.status(200).json({
      success: true,
      message: "✅ Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.",
    });
  } catch (error) {
    console.error("❌ Échec de l'envoi de l'email :", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = { sendContactEmail };
