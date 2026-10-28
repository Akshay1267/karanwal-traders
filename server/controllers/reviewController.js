const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc Add a review for a product
// @route POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "Please provide product, rating and comment." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment
    });

    // Recalculate average rating for product
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    await review.populate("user", "name companyName");
    res.status(201).json({ success: true, review, rating: product.rating, numReviews: product.numReviews });
  } catch (error) {
    next(error);
  }
};

// @desc Get reviews for a product
// @route GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};
