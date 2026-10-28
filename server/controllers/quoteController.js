const Quote = require("../models/Quote");

// @desc Submit bulk quotation enquiry
// @route POST /api/quotes
exports.createQuote = async (req, res, next) => {
  try {
    const { name, company, phone, email, product, quantity, requiredSpecs, message, deliveryLocation } = req.body;

    if (!name || !phone || !email || !product || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (Name, Phone, Email, Product, Quantity)."
      });
    }

    const quote = await Quote.create({
      name,
      company: company || "",
      phone,
      email: email.toLowerCase(),
      product,
      quantity,
      requiredSpecs: requiredSpecs || "",
      message: message || "",
      deliveryLocation: deliveryLocation || ""
    });

    res.status(201).json({
      success: true,
      message: "Quotation request submitted successfully. Our sales team will revert within 2 hours.",
      quote
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all quotes (Admin)
// @route GET /api/quotes
exports.getAllQuotes = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const quotes = await Quote.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotes.length, quotes });
  } catch (error) {
    next(error);
  }
};

// @desc Update quote status (Admin)
// @route PUT /api/quotes/:id/status
exports.updateQuoteStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ success: false, message: "Quote enquiry not found." });
    }

    if (status) quote.status = status;
    if (adminNotes !== undefined) quote.adminNotes = adminNotes;

    await quote.save();
    res.status(200).json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};
