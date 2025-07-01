// 📦 Required modules
const multer = require("multer"); // Middleware for handling multipart/form-data
const path = require("path");
const fs = require("fs");

// 📁 Define storage location and filename for uploaded files
const storage = multer.diskStorage({
  // 📌 Destination folder
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath); // Store in uploads/
  },

  // 🏷️ Custom filename
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName); // Example: 16867539234-123456789.jpg
  },
});

// 🔒 Optional file filter (to restrict file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);
  if (ext && mime) {
    cb(null, true); // ✅ Accept file
  } else {
    cb(new Error("❌ Seules les images JPEG, PNG et WEBP sont autorisées."));
  }
};

// ⚙️ Create multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 🔺 Limit: 5MB
  fileFilter,
});

// 🧾 Express route handler (for single file upload)
const uploadImage = (req, res) => {
  try {
    // 📤 Return path of uploaded file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Aucun fichier fourni." });
    }

    // ✅ Successful upload
    res.status(200).json({
      message: "Image téléchargée avec succès.",
      filename: file.filename,
      path: file.path,
    });
  } catch (error) {
    // ❌ Handle errors
    res.status(500).json({ error: "Erreur lors du téléchargement de l'image." });
  }
};

// 📤 Export upload middleware and controller function
module.exports = {
  upload,        // Multer middleware to use in the route
  uploadImage,   // Route handler to return response
};
