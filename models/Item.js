const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["produce", "dairy", "meat", "pantry", "frozen", "other"],
    default: "other"
  },
  quantity: {
    type: Number,
    default: 1
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["fresh", "expiring-soon", "expired", "used", "wasted"],
    default: "fresh"
  }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);