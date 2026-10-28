const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const xlsx = require("xlsx");

// @desc Get products with extensive filters, search, sorting, and pagination
// @route GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      alloyGrade,
      temper,
      finish,
      minPrice,
      maxPrice,
      inStock,
      sort = "newest",
      featured
    } = req.query;

    const query = {};

    // Category filter (support slug or ObjectId)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Specifications filters
    if (alloyGrade) {
      query["specs.alloyGrade"] = new RegExp(`^${alloyGrade}$`, "i");
    }
    if (temper) {
      query["specs.temper"] = new RegExp(`^${temper}$`, "i");
    }
    if (finish) {
      query["specs.finish"] = new RegExp(`^${finish}$`, "i");
    }

    // Stock availability filter
    if (inStock === "true" || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured only
    if (featured === "true" || featured === true) {
      query.isFeatured = true;
    }

    // Search query across name, sku, alloyGrade, description
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { "specs.alloyGrade": searchRegex },
        { description: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1 };
    else if (sort === "name-asc") sortOption = { name: 1 };
    else if (sort === "popularity") sortOption = { numReviews: -1, rating: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalCount,
      totalPages,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get distinct filter options (alloy grades, tempers, finishes, price range)
// @route GET /api/products/filters
exports.getFilterOptions = async (req, res, next) => {
  try {
    const [alloyGrades, tempers, finishes, minMaxPrice] = await Promise.all([
      Product.distinct("specs.alloyGrade"),
      Product.distinct("specs.temper"),
      Product.distinct("specs.finish"),
      Product.aggregate([
        {
          $group: {
            _id: null,
            min: { $min: "$price" },
            max: { $max: "$price" }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      filters: {
        alloyGrades: alloyGrades.filter(Boolean).sort(),
        tempers: tempers.filter(Boolean).sort(),
        finishes: finishes.filter(Boolean).sort(),
        minPrice: minMaxPrice[0]?.min || 0,
        maxPrice: minMaxPrice[0]?.max || 10000
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get featured products for homepage
// @route GET /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate("category", "name slug")
      .limit(8);
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc Get single product by slug or id
// @route GET /api/products/:identifier
exports.getProductByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate("category", "name slug");
    } else {
      product = await Product.findOne({ slug: identifier.toLowerCase() }).populate("category", "name slug");
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Related products in the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .populate("category", "name slug")
      .limit(4);

    res.status(200).json({ success: true, product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new product (Admin)
// @route POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      sku,
      category,
      description,
      images,
      price,
      mrp,
      unit,
      stock,
      minOrderQty,
      specs,
      applications,
      tags,
      isFeatured
    } = req.body;

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const product = await Product.create({
      name,
      slug: productSlug,
      sku: sku.toUpperCase(),
      category,
      description,
      images: Array.isArray(images) ? images : [images || "/placeholder-metal.jpg"],
      price: Number(price),
      mrp: mrp ? Number(mrp) : Number(price) * 1.15,
      unit: unit || "kg",
      stock: Number(stock) || 0,
      minOrderQty: Number(minOrderQty) || 1,
      specs: specs || {},
      applications: applications || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured)
    });

    await product.populate("category", "name slug");
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Update product (Admin)
// @route PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product removed successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc Bulk import products via CSV/Excel upload
// @route POST /api/products/bulk-import
exports.bulkImportProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a CSV or Excel file." });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let records = [];

    if (ext === ".csv") {
      const results = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", resolve)
          .on("error", reject);
      });
      records = results;
    } else if (ext === ".xlsx" || ext === ".xls") {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      records = xlsx.utils.sheet_to_json(sheet);
    }

    if (records.length === 0) {
      return res.status(400).json({ success: false, message: "Uploaded file contains no rows." });
    }

    let insertedCount = 0;
    let updatedCount = 0;
    const errors = [];

    // Pre-cache categories
    const allCategories = await Category.find();
    const catMap = new Map();
    allCategories.forEach(c => {
      catMap.set(c.name.toLowerCase(), c._id);
      catMap.set(c.slug.toLowerCase(), c._id);
    });

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      try {
        const name = row.name || row.Name || row["Product Name"];
        const sku = (row.sku || row.SKU || `ALU-${Date.now()}-${i}`).toUpperCase().trim();
        const categoryName = (row.category || row.Category || "Aluminium Sheets").trim();
        const price = Number(row.price || row.Price || 250);
        const unit = (row.unit || row.Unit || "kg").toLowerCase();
        const stock = Number(row.stock || row.Stock || 50);

        if (!name) {
          errors.push(`Row ${i + 1}: Missing product name`);
          continue;
        }

        let catId = catMap.get(categoryName.toLowerCase());
        if (!catId) {
          // Auto create category if not present
          const newCat = await Category.create({
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
            description: `Industrial ${categoryName}`
          });
          catId = newCat._id;
          catMap.set(categoryName.toLowerCase(), catId);
        }

        const slug = (row.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/(^-|-$)/g, "");

        const specs = {
          alloyGrade: row.alloyGrade || row["Alloy Grade"] || row.alloy || "6061",
          temper: row.temper || row.Temper || "T6",
          thickness: row.thickness || row.Thickness || "N/A",
          width: row.width || row.Width || "N/A",
          length: row.length || row.Length || "N/A",
          finish: row.finish || row.Finish || "Mill Finish",
          standard: row.standard || row.Standard || "ASTM B209",
          weight: row.weight || row.Weight || "Standard"
        };

        const images = row.images ? row.images.split(",").map(s => s.trim()) : [
          row.image || "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80"
        ];

        const existing = await Product.findOne({ sku });
        if (existing) {
          existing.name = name;
          existing.price = price;
          existing.stock = stock;
          existing.specs = specs;
          await existing.save();
          updatedCount++;
        } else {
          await Product.create({
            name,
            slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
            sku,
            category: catId,
            description: row.description || row.Description || `Commercial grade ${name} suited for industrial applications and fabrication.`,
            images,
            price,
            mrp: Number(row.mrp) || Math.round(price * 1.15),
            unit,
            stock,
            specs,
            applications: row.applications ? row.applications.split(",").map(s => s.trim()) : ["Fabrication", "Industrial", "Structural"],
            tags: row.tags ? row.tags.split(",").map(s => s.trim()) : ["Aluminium", specs.alloyGrade]
          });
          insertedCount++;
        }
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    // Clean up uploaded temp file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message: `Bulk import completed: ${insertedCount} inserted, ${updatedCount} updated.`,
      insertedCount,
      updatedCount,
      errors
    });
  } catch (error) {
    next(error);
  }
};

// @desc Download CSV Template for bulk import
// @route GET /api/products/sample-template
exports.downloadSampleCSV = (req, res) => {
  const csvHeaders = "name,sku,category,price,unit,stock,alloyGrade,temper,thickness,width,length,finish,standard,description,image\n";
  const sampleRow1 = '"Aluminium Sheet 6061-T6 (2mm x 1250mm x 2500mm)",ALU-SHT-6061-2MM,"Aluminium Sheets",310,kg,150,6061,T6,2.0 mm,1250 mm,2500 mm,Mill Finish,ASTM B209,"High strength heat-treatable sheet for aerospace and machining","https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"\n';
  const sampleRow2 = '"Aluminium Round Bar 6082-T6 (50mm Dia)",ALU-ROD-6082-50,"Aluminium Round Bars / Rods",295,kg,80,6082,T6,50 mm Dia,N/A,3000 mm,Extruded,IS 733,"Structural alloy rod with excellent corrosion resistance and machinability","https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80"\n';

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="aluex_product_import_template.csv"');
  res.status(200).send(csvHeaders + sampleRow1 + sampleRow2);
};
