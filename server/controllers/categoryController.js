const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    
    // Attach product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    res.status(200).json({ success: true, count: categories.length, categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc Get single category by slug
// @route GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    const productCount = await Product.countDocuments({ category: category._id });
    res.status(200).json({ success: true, category: { ...category.toObject(), productCount } });
  } catch (error) {
    next(error);
  }
};

// @desc Create category (Admin)
// @route POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, image, description, displayOrder } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const category = await Category.create({
      name,
      slug: catSlug,
      image,
      description,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc Update category (Admin)
// @route PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc Delete category (Admin)
// @route DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const linkedProducts = await Product.countDocuments({ category: category._id });
    if (linkedProducts > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${linkedProducts} products assigned to it.`
      });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category removed successfully." });
  } catch (error) {
    next(error);
  }
};
