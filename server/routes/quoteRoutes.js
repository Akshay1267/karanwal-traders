const express = require("express");
const router = express.Router();
const {
  createQuote,
  getAllQuotes,
  updateQuoteStatus
} = require("../controllers/quoteController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/")
  .post(createQuote)
  .get(protect, adminOnly, getAllQuotes);

router.put("/:id/status", protect, adminOnly, updateQuoteStatus);

module.exports = router;
