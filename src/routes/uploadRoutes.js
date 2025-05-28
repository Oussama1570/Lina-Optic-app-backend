const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ✅ Ensure the /uploads directory exists
const uploadPath = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadPath, { recursive: true });

// ✅ Multer disk storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Multer upload handler
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ✅ POST /api/upload
router.post("/upload", upload.single("image"), (req, res) => {
  // 🔐 Enforce CORS headers manually
  res.setHeader("Access-Control-Allow-Origin", "*"); // You can restrict this in production
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded.",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log("📸 Uploaded:", imageUrl);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      image: imageUrl,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
    });
  }
});

module.exports = router;
