const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chocolateType: {
    type: String,
    required: true,
    enum: ["milk", "dark", "white", "dark_sugar_free"],
  },
  message: {
    type: String,
    required: true,
    maxlength: 20,
  },
  toppings: {
    type: [String],
    default: [],
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  receiverName: {
    type: String,
    required: true,
  },
  receiverNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
