const Order = require("../models/Order");
const Product = require("../models/Product");
const siteConfig = require("../config/site");

// @desc Create a new order
// @route POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items provided." });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: "Incomplete shipping address." });
    }

    // Verify items and calculate subtotal securely from DB prices
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name || item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock} ${product.unit}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        unit: product.unit,
        quantity: item.quantity,
        image: product.images[0] || "",
        total: itemTotal
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // GST is 18% as per statutory Indian aluminium rates
    const gst = Math.round(subtotal * siteConfig.business.gstRate);
    const shipping = subtotal >= siteConfig.business.freeDeliveryThreshold ? 0 : siteConfig.business.standardShippingFee;
    const total = subtotal + gst + shipping;

    // Generate Order Number
    const count = await Order.countDocuments();
    const orderNumber = `ALU-${new Date().getFullYear()}-${String(count + 1001).padStart(5, "0")}`;

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "upi",
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid", // Prototype mock payment
      orderStatus: "Placed",
      subtotal,
      gst,
      shipping,
      total,
      notes: notes || ""
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user orders
// @route GET /api/orders/my
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "slug name images")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc Get single order by ID
// @route GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone companyName")
      .populate("items.product", "slug name images");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Ensure only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this order." });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders (Admin)
// @route GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: new RegExp(search, "i") },
        { "shippingAddress.fullName": new RegExp(search, "i") },
        { "shippingAddress.phone": new RegExp(search, "i") }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, totalCount] = await Promise.all([
      Order.find(query)
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status & tracking (Admin)
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    await order.save();
    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
