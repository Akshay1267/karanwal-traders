const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const siteConfig = require("./config/site");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Security & Parsing Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://client-one-self-85.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local dev prototype
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate Limiting (Relaxed for prototype development)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", apiLimiter);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Global Public Site Config Route
app.get("/api/site-config", (req, res) => {
  res.status(200).json({
    success: true,
    brand: siteConfig.brand,
    owner: siteConfig.owner,
    contact: siteConfig.contact,
    business: siteConfig.business
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Base route for health check
app.get("/", (req, res) => {
  res.json({
    status: "online",
    brand: siteConfig.brand.name,
    message: "Aluminium Trading E-commerce REST API is running."
  });
});

// 404 & Global Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] ${siteConfig.brand.name} Backend running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
