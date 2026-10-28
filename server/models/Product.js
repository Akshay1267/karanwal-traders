const mongoose = require("mongoose");

const SpecSchema = new mongoose.Schema({
  alloyGrade: { type: String, default: "Commercial" }, // e.g., 6061, 5052, 1050, 7075
  temper: { type: String, default: "Mill" },          // e.g., T6, H14, O, H32, T651
  thickness: { type: String, default: "N/A" },       // e.g., 2.0 mm
  width: { type: String, default: "N/A" },           // e.g., 1250 mm
  length: { type: String, default: "N/A" },          // e.g., 2500 mm or 6000 mm
  finish: { type: String, default: "Mill Finish" },  // e.g., Mill Finish, Anodized, Polished
  standard: { type: String, default: "IS / ASTM" },  // e.g., ASTM B209, IS 737
  weight: { type: String, default: "Per unit" }      // e.g., 2.71 g/cm³ or 8.5 kg/pc
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  price: { type: Number, required: true, min: 0 },
  mrp: { type: Number, default: 0 },
  unit: { type: String, required: true, enum: ["kg", "piece", "metre", "sheet", "bundle", "coil", "tonne"], default: "kg" },
  stock: { type: Number, required: true, default: 100 },
  minOrderQty: { type: Number, default: 1 },
  specs: { type: SpecSchema, default: () => ({}) },
  applications: [{ type: String }],
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Text indexing for rapid search across name, sku, description, alloyGrade, and tags
ProductSchema.index({
  name: "text",
  description: "text",
  sku: "text",
  "specs.alloyGrade": "text",
  tags: "text"
});

module.exports = mongoose.model("Product", ProductSchema);
