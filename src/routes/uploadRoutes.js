// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

// ✅ Ensure 'uploads/' directory exists
const uploadPath = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadPath, { recursive: true });

// ✅ Storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// ✅ Multer file filter (accept images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// ✅ Multer middleware with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ✅ Upload route using controller
router.post("/upload", upload.single("image"), uploadImage);

module.exports = router;
