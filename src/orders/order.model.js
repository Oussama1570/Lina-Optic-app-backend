const mongoose = require("mongoose");

// 📦 Define the Order Schema
const OrderSchema = new mongoose.Schema(
  {
    // 🧑 Customer Information
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // 📍 Shipping Address
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipcode: { type: String, required: true },
    },

    // 🛒 Ordered Products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        color: {
          colorName: {
            en: { type: String, required: true },
            fr: { type: String, required: true },
            ar: { type: String, required: true },
          },
          image: { type: String, required: true },
        },
      },
    ],

    // 💰 Total Order Price
    totalPrice: { type: Number, required: true },

    // ✅ Status
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },

    // 🔄 Product progress (by productKey)
    productProgress: {
      type: Map,
      of: Number, // example: "productId|color": 60
      default: {},
    },
  },
  { timestamps: true }
);

// 🧾 Create the model
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
