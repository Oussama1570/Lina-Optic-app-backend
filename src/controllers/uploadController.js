// controllers/uploadController.js
const path = require("path");

const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    console.log("✅ Image uploaded:", imageUrl);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      image: imageUrl,
    });
  } catch (error) {
    console.error("❌ Image upload failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Image upload failed.",
      error: error.message,
    });
  }
};

module.exports = { uploadImage };
