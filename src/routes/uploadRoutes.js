const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ✅ Multer setup: temporarily stores files in 'uploads/' folder //
const upload = multer({ dest: "uploads/" });

// ✅ Cloudinary configuration using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ POST /api/upload - Upload a single image to Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // ☁️ Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "LinaOptic", // Optional: store under a folder
    });

    // 🧹 Remove temp file from local storage
    fs.unlinkSync(filePath);

    // ✅ Return only the URL (used in AddProduct, UpdateProduct)
    res.status(200).json({
      success: true,
      image: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// ✅ DELETE /api/upload/delete - Remove an image from Cloudinary
router.delete("/delete", async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: "Missing public_id" });
    }

    await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Image delete failed:", error);
    res.status(500).json({ success: false, message: "Image deletion failed" });
  }
});

module.exports = router;
