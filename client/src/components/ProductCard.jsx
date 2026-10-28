import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, FileText, Check, Shield } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSiteStore } from "../store/useSiteStore";

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();
  const { openQuoteModal } = useSiteStore();
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = user?.wishlist?.some((id) => (typeof id === "object" ? id._id : id) === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleOpenQuote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuoteModal(product);
  };

  const mainImage =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="metallic-card rounded-2xl overflow-hidden flex flex-col group relative">
      {/* Wishlist Button - Top Right Floating */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? "bg-rose-50 text-rose-600 shadow-sm"
            : "bg-white/80 backdrop-blur-xs text-gray-400 hover:text-rose-500 hover:bg-white"
        }`}
        title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
      </button>

      {/* Stock & Alloy Badges - Top Left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        {product.specs?.alloyGrade && (
          <span className="bg-[#2B2623]/90 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            {product.specs.alloyGrade}
          </span>
        )}
        {product.stock <= 20 ? (
          <span className="bg-amber-100 text-amber-800 text-[9px] font-semibold px-2 py-0.5 rounded-md">
            Low Stock: {product.stock} {product.unit}
          </span>
        ) : (
          <span className="bg-emerald-50/90 text-emerald-700 text-[9px] font-semibold px-2 py-0.5 rounded-md">
            Ready Stock
          </span>
        )}
      </div>

      {/* Product Image with Zoom */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-[#FAF7F2]">
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] text-[#8A94A6] mb-1">
            <span className="truncate">{product.category?.name || "Aluminium"}</span>
            <span className="font-mono text-[10px]">{product.sku}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-semibold text-xs text-[#2B2623] hover:text-[#C08457] line-clamp-2 transition-colors leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Technical Spec Snippet */}
          <div className="grid grid-cols-2 gap-1.5 py-2 px-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/60 text-[10px] text-[#554C46] mb-3">
            <div>
              <span className="text-[#8A94A6]">Temper: </span>
              <strong className="text-[#2B2623]">{product.specs?.temper || "Standard"}</strong>
            </div>
            <div>
              <span className="text-[#8A94A6]">Thick: </span>
              <strong className="text-[#2B2623]">{product.specs?.thickness || "N/A"}</strong>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-bold text-[#2B2623]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#8A94A6] font-medium">/{product.unit}</span>
              </div>
              {product.mrp > product.price && (
                <div className="text-[10px] text-[#8A94A6] line-through">
                  ₹{product.mrp.toLocaleString("en-IN")}/{product.unit}
                </div>
              )}
            </div>

            <span className="text-[10px] text-[#9D643A] font-semibold bg-[#F5EAE0] px-2 py-0.5 rounded-full">
              +18% GST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[#2B2623] hover:bg-[#C08457] text-white shadow-xs"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleOpenQuote}
              className="py-2 px-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF7F2] text-[#9D643A] border border-[#C08457]/40 hover:border-[#C08457] transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Request Tiered Bulk Pricing"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
