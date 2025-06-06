const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// ✅ Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lina-optic", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// ✅ Configure Multer middleware //
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Seuls les fichiers JPG, PNG et WEBP sont autorisés."));
    }
    cb(null, true);
  },
});

// ✅ POST /api/upload - Upload a single image
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier image reçu.",
      });
    }

    console.log("✅ Image uploaded:", req.file.path);

    res.status(200).json({
      success: true,
      message: "Image téléchargée avec succès.",
      image: req.file.path, // Full Cloudinary URL
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'upload Cloudinary:", error);
    res.status(500).json({
      success: false,
      message: "Échec de l'upload de l'image.",
      error: error.message,
    });
  }
});

module.exports = router;
