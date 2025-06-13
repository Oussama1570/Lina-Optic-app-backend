const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ✅ Multer setup to temporarily store files in 'uploads/' folder
const upload = multer({ dest: "uploads/" });

// ✅ Cloudinary configuration using env variables (make sure .env has correct keys)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ POST - Upload a single image to Cloudinary
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path; // 🖼️ Path to uploaded temp image

    // ☁️ Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "LinaOptic", // Optional: folder name in Cloudinary
    });

    // 🧹 Delete the temp file from 'uploads/' after successful upload
    fs.unlinkSync(filePath);

    // ✅ Return image URL and public_id
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
});

// ✅ DELETE - Remove image from Cloudinary by public_id
router.delete("/delete-image", async (req, res) => {
  try {
    const { public_id } = req.body;

    // ☁️ Delete the image from Cloudinary
    await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Error:", error);
    res.status(500).json({ success: false, message: "Image deletion failed" });
  }
});

module.exports = router;
