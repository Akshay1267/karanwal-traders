const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Quote = require("../models/Quote");
const Category = require("../models/Category");

// @desc Get comprehensive admin dashboard analytics
// @route GET /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalQuotes,
      lowStockProducts,
      recentOrders,
      recentQuotes,
      categories
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Quote.countDocuments(),
      Product.find({ stock: { $lte: 20 } }).select("name sku stock price unit").limit(8),
      Order.find().populate("user", "name email phone").sort({ createdAt: -1 }).limit(6),
      Quote.find().sort({ createdAt: -1 }).limit(6),
      Category.find()
    ]);

    // Calculate total revenue from non-cancelled orders
    const revenueAggregate = await Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, totalSales: { $sum: "$total" }, totalGST: { $sum: "$gst" } } }
    ]);

    const totalSales = revenueAggregate[0]?.totalSales || 0;
    const totalGST = revenueAggregate[0]?.totalGST || 0;

    // Monthly orders & revenue aggregation for chart
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalSales,
        totalGST,
        totalOrders,
        totalProducts,
        totalUsers,
        totalQuotes,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders,
      recentQuotes,
      monthlySales,
      statusBreakdown
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all registered users (Admin)
// @route GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};
