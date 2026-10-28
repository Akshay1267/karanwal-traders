const express = require("express");
const router = express.Router();
const {
  getProducts,
  getFilterOptions,
  getFeaturedProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkImportProducts,
  downloadSampleCSV
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/filters", getFilterOptions);
router.get("/featured", getFeaturedProducts);
router.get("/sample-template", downloadSampleCSV);

router.route("/")
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.post("/bulk-import", protect, adminOnly, upload.single("file"), bulkImportProducts);

router.route("/:identifier")
  .get(getProductByIdentifier);

router.route("/id/:id")
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
