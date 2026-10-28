const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Quote = require("../models/Quote");
const Review = require("../models/Review");

const seedDB = async () => {
  try {
    await connectDB();
    console.log("[Seed] Connected to MongoDB. Clearing existing collections...");

    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Quote.deleteMany({});
    await Review.deleteMany({});

    const seedRaw = JSON.parse(fs.readFileSync(path.join(__dirname, "seedData.json"), "utf8"));

    console.log(`[Seed] Inserting ${seedRaw.categories.length} categories...`);
    const createdCategories = await Category.insertMany(seedRaw.categories);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`[Seed] Inserting ${seedRaw.products.length} products...`);
    const productDocs = seedRaw.products.map(p => ({
      ...p,
      category: categoryMap[p.categorySlug]
    }));
    const createdProducts = await Product.insertMany(productDocs);

    console.log("[Seed] Creating admin and customer users...");
    const adminUser = await User.create({
      name: "Shubh Karanwal",
      email: "admin@alutrade.com",
      phone: "+91 98970 12345",
      password: "Admin@123",
      role: "admin",
      companyName: "ALUEX METALS Private Limited",
      gstNumber: "09AAACH7492K1Z8",
      addresses: [
        {
          street: "D-5, Sarvodaya Colony",
          city: "Saket, Meerut",
          state: "Uttar Pradesh",
          pincode: "250001",
          country: "India",
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: "Rohit Sharma",
      email: "customer@alutrade.com",
      phone: "+91 98111 22334",
      password: "Customer@123",
      role: "customer",
      companyName: "Apex Fabrications & Engineering Works",
      gstNumber: "07AAAAA0000A1Z5",
      addresses: [
        {
          street: "Plot 42, Sector 58, Industrial Area",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301",
          country: "India",
          isDefault: true
        }
      ]
    });

    console.log("[Seed] Creating sample orders...");
    const p1 = createdProducts[0];
    const p2 = createdProducts[3];

    const subtotal = (p1.price * 50) + (p2.price * 20);
    const gst = Math.round(subtotal * 0.18);
    const shipping = 0;
    const total = subtotal + gst + shipping;

    await Order.create({
      orderNumber: "ALU-2026-01001",
      user: customerUser._id,
      items: [
        {
          product: p1._id,
          name: p1.name,
          sku: p1.sku,
          price: p1.price,
          unit: p1.unit,
          quantity: 50,
          image: p1.images[0],
          total: p1.price * 50
        },
        {
          product: p2._id,
          name: p2.name,
          sku: p2.sku,
          price: p2.price,
          unit: p2.unit,
          quantity: 20,
          image: p2.images[0],
          total: p2.price * 20
        }
      ],
      shippingAddress: {
        fullName: "Rohit Sharma",
        phone: "+91 98111 22334",
        email: "customer@alutrade.com",
        companyName: "Apex Fabrications",
        gstNumber: "07AAAAA0000A1Z5",
        street: "Plot 42, Sector 58, Industrial Area",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        country: "India"
      },
      paymentMethod: "upi",
      paymentStatus: "paid",
      orderStatus: "Processing",
      subtotal,
      gst,
      shipping,
      total,
      trackingNumber: "TRK-NCR-892147",
      notes: "Please pack with extra moisture-barrier plastic film."
    });

    console.log("[Seed] Creating sample quote enquiries...");
    await Quote.create({
      name: "Amitabh Singhal",
      company: "Singhal Aluminium Fabricators",
      phone: "+91 98290 55443",
      email: "amitabh@singhalfab.com",
      product: "Aluminium Plate 6061-T6 (20mm)",
      quantity: "2.5 Metric Tonnes",
      requiredSpecs: "Cut to size: 500mm x 500mm squares, ultrasonic tested",
      message: "Need urgent delivery at Ghaziabad factory. Please send wholesale price per kg including 18% GST.",
      deliveryLocation: "Ghaziabad, Uttar Pradesh",
      status: "New"
    });

    await Quote.create({
      name: "Vikram Chauhan",
      company: "Surya Solar EPC Ltd",
      phone: "+91 94120 77889",
      email: "vikram@suryasolar.in",
      product: "Solar Panel Mounting Rail Profile (4200mm)",
      quantity: "500 Pieces (Approx. 2.1 km)",
      requiredSpecs: "Anodized 15 micron natural silver, with end clamps and mid clamps",
      message: "Quote needed for a 500kW rooftop installation near Partapur Meerut.",
      deliveryLocation: "Meerut, Uttar Pradesh",
      status: "Under Review"
    });

    console.log("==================================================");
    console.log("[Seed Success] MongoDB populated successfully!");
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log(`- Admin User: admin@alutrade.com / Admin@123`);
    console.log(`- Customer User: customer@alutrade.com / Customer@123`);
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("[Seed Error]", error);
    process.exit(1);
  }
};

seedDB();
