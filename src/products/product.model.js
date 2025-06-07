const mongoose = require("mongoose");

// ✅ Color schema with multilingual colorName and multiple images
const ColorSchema = new mongoose.Schema({
  colorName: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    ar: { type: String, required: true },
  },
  images: [{ type: String, required: true }], // ✅ Multiple images per color
  stock: { type: Number, required: true, default: 0 }, // ✅ Stock per color
});

// ✅ Product schema
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    translations: {
      en: { title: String, description: String },
      fr: { title: String, description: String },
      ar: { title: String, description: String },
    },

    mainCategory: { type: String, required: true },
    subCategory: { type: String, required: true },
    frameType: { type: String, required: false },

    coverImage: { type: String, required: true },

    colors: {
      type: [ColorSchema],
      required: true,
    },

    brand: { type: String, required: false },

    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },

    stockQuantity: { type: Number, required: true },

    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
