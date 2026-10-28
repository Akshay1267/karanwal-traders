import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { productAPI, categoryAPI } from "../services/api";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    alloyGrades: [],
    tempers: [],
    finishes: [],
    minPrice: 0,
    maxPrice: 3000
  });

  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States from URL or Defaults
  const selectedCategory = searchParams.get("category") || "";
  const selectedAlloy = searchParams.get("alloyGrade") || "";
  const selectedTemper = searchParams.get("temper") || "";
  const selectedFinish = searchParams.get("finish") || "";
  const inStockOnly = searchParams.get("inStock") === "true";
  const searchQuery = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const maxPriceFilter = searchParams.get("maxPrice") || "";

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Load Categories & Filter Options once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, filterRes] = await Promise.all([
          categoryAPI.getCategories(),
          productAPI.getFilters()
        ]);
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
        if (filterRes.data.success) {
          setFilterOptions(filterRes.data.filters);
        }
      } catch (e) {
        console.error("Failed to load metadata", e);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products whenever searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          category: selectedCategory,
          alloyGrade: selectedAlloy,
          temper: selectedTemper,
          finish: selectedFinish,
          inStock: inStockOnly ? "true" : undefined,
          search: searchQuery,
          sort: currentSort,
          maxPrice: maxPriceFilter || undefined
        };

        const res = await productAPI.getProducts(params);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.totalCount || 0);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedAlloy,
    selectedTemper,
    selectedFinish,
    inStockOnly,
    searchQuery,
    currentSort,
    currentPage,
    maxPriceFilter
  ]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === "" || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set("page", "1"); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const activeFilterCount = [
    selectedCategory,
    selectedAlloy,
    selectedTemper,
    selectedFinish,
    inStockOnly,
    searchQuery,
    maxPriceFilter
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Page Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-[#8A94A6]">Home &bull; Material Inventory</span>
        <h1 className="font-serif text-3xl font-bold text-[#2B2623] mt-1">Aluminium Material Catalogue</h1>
        <p className="text-xs sm:text-sm text-[#554C46] mt-0.5">
          Showing {totalCount} certified industrial products ready for dispatch with 18% GST invoicing.
        </p>
      </div>

      {/* Search, Sort, and Mobile Filter Trigger Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search alloy, thickness, SKU, standard..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none text-[#2B2623]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateParam("search", "");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Right Controls: Sort & Mobile Filter Toggle */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5 text-[#C08457]" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] focus:outline-none focus:border-[#C08457]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-500 font-medium">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs text-[#2B2623]">
              Category: {selectedCategory}
              <button onClick={() => updateParam("category", "")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedAlloy && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs text-[#2B2623]">
              Alloy: {selectedAlloy}
              <button onClick={() => updateParam("alloyGrade", "")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTemper && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs text-[#2B2623]">
              Temper: {selectedTemper}
              <button onClick={() => updateParam("temper", "")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs text-[#2B2623]">
              In-Stock Only
              <button onClick={() => updateParam("inStock", "")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs text-[#2B2623]">
              Search: "{searchQuery}"
              <button onClick={() => updateParam("search", "")} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-[#C08457] hover:underline font-semibold ml-2 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid Layout: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6DFD5] p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-base font-bold text-[#2B2623] flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C08457]" />
                <span>Filter Catalogue</span>
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#9D643A] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* In-Stock Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-[#2B2623]">Ready Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
                className="w-4 h-4 accent-[#C08457] rounded cursor-pointer"
              />
            </div>

            {/* Categories Filter */}
            <div>
              <h4 className="text-xs font-bold text-[#2B2623] uppercase tracking-wider mb-2.5">
                Categories
              </h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => updateParam("category", "")}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    !selectedCategory
                      ? "bg-[#FAF7F2] font-bold text-[#C08457]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-gray-400">{categories.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateParam("category", cat.slug)}
                    className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? "bg-[#FAF7F2] font-bold text-[#C08457]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {cat.productCount || ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alloy Grades Filter */}
            {filterOptions.alloyGrades.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-[#2B2623] uppercase tracking-wider mb-2.5">
                  Alloy Grade
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.alloyGrades.map((alloy) => (
                    <button
                      key={alloy}
                      onClick={() => updateParam("alloyGrade", selectedAlloy === alloy ? "" : alloy)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedAlloy === alloy
                          ? "bg-[#2B2623] text-white"
                          : "bg-[#FAF7F2] text-[#554C46] hover:bg-[#F3EDE4] border border-[#E6DFD5]"
                      }`}
                    >
                      {alloy}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Temper Filter */}
            {filterOptions.tempers.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-[#2B2623] uppercase tracking-wider mb-2.5">
                  Temper
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {filterOptions.tempers.map((temper) => (
                    <button
                      key={temper}
                      onClick={() => updateParam("temper", selectedTemper === temper ? "" : temper)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        selectedTemper === temper
                          ? "bg-[#C08457] text-white font-semibold"
                          : "bg-[#FAF7F2] text-[#554C46] hover:bg-[#F3EDE4] border border-[#E6DFD5]"
                      }`}
                    >
                      {temper}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold text-[#2B2623] uppercase tracking-wider">
                  Max Price / Unit
                </h4>
                <span className="font-mono text-xs font-bold text-[#C08457]">
                  ₹{maxPriceFilter || "3,000"}+
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={maxPriceFilter || "3000"}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className="w-full accent-[#C08457] cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <main className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-[#E6DFD5] animate-pulse space-y-3">
                  <div className="aspect-4/3 bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E6DFD5] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#C08457] flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B2623]">No matching materials found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try clearing selected alloy grades or search queries to see more available stock.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-[#E6DFD5] flex items-center justify-between">
              <button
                disabled={currentPage <= 1}
                onClick={() => updateParam("page", currentPage - 1)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1 text-xs">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParam("page", pageNum)}
                      className={`w-8 h-8 rounded-xl font-semibold transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#2B2623] text-white shadow-xs"
                          : "bg-white border border-[#E6DFD5] text-[#2B2623] hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => updateParam("page", currentPage + 1)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-in Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif text-base font-bold text-[#2B2623]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Ready Stock */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-[#2B2623]">Ready Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
                className="w-4 h-4 accent-[#C08457] rounded"
              />
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold text-[#2B2623] uppercase mb-2">Categories</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                <button
                  onClick={() => {
                    updateParam("category", "");
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left text-xs py-1.5 ${!selectedCategory ? "font-bold text-[#C08457]" : "text-gray-600"}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      updateParam("category", cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left text-xs py-1.5 ${selectedCategory === cat.slug ? "font-bold text-[#C08457]" : "text-gray-600"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#2B2623] text-white text-xs font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
