const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/karanwal_ecommerce";
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
    if (!process.env.MONGO_URI) {
      console.warn("[Database Warning] MONGO_URI is not defined. Please add MONGO_URI in your Render environment variables.");
    }
  }
};

module.exports = connectDB;
