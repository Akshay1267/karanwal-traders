const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true, default: "" },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  product: { type: String, required: true },
  quantity: { type: String, required: true },
  requiredSpecs: { type: String, default: "" },
  message: { type: String, default: "" },
  deliveryLocation: { type: String, default: "" },
  status: {
    type: String,
    enum: ["New", "Under Review", "Quotation Sent", "Closed"],
    default: "New"
  },
  adminNotes: { type: String, default: "" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Quote", QuoteSchema);
