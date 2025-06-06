const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// ✅ Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lina-optic", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

// Do not upload avif images

// ✅ Multer upload middleware
const upload = multer({ storage });

// ✅ POST /api/upload - Upload single image to Cloudinary
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      image: req.file.path, // ✅ Cloudinary URL
    });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
    });
  }
});

module.exports = router;
