import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  FileText,
  ShieldCheck,
  Truck,
  Check,
  ChevronRight,
  Sparkles,
  Scissors,
  ArrowRight,
  Layers,
  Award
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { productAPI } from "../services/api";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSiteStore } from "../store/useSiteStore";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();
  const { openQuoteModal } = useSiteStore();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productAPI.getProduct(slug);
        if (res.data.success) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.images?.[0] || "");
          setRelatedProducts(res.data.relatedProducts || []);
          setQuantity(res.data.product.minOrderQty || 1);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-32 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Product Not Found</h2>
        <p className="text-xs text-gray-500">The requested material specification does not exist or has been relocated.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  const isWishlisted = user?.wishlist?.some((id) => (typeof id === "object" ? id._id : id) === product._id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const calculatedSubtotal = product.price * quantity;
  const calculatedGST = Math.round(calculatedSubtotal * 0.18);
  const calculatedTotal = calculatedSubtotal + calculatedGST;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[#8A94A6]">
        <Link to="/" className="hover:text-[#2B2623]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#2B2623]">Catalogue</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category?.slug}`} className="hover:text-[#2B2623]">
          {product.category?.name || "Materials"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#2B2623] font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#E6DFD5] bg-white shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
            {product.specs?.alloyGrade && (
              <span className="absolute top-4 left-4 bg-[#2B2623]/90 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-lg">
                Grade: {product.specs.alloyGrade}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isWishlisted
                  ? "bg-rose-50 text-rose-600 shadow-md"
                  : "bg-white/80 backdrop-blur-xs text-gray-500 hover:text-rose-500"
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-600" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? "border-[#C08457] shadow-sm" : "border-[#E6DFD5] opacity-70"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-center">
              <Award className="w-5 h-5 text-[#C08457] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-[#2B2623] block">IS / ASTM Certified</span>
              <span className="text-[9px] text-[#8A94A6]">Spectrometer Tested</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-center">
              <Scissors className="w-5 h-5 text-[#C08457] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-[#2B2623] block">Cut to Length</span>
              <span className="text-[9px] text-[#8A94A6]">Custom CNC Shearing</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-center">
              <Truck className="w-5 h-5 text-[#C08457] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-[#2B2623] block">Fast NCR Delivery</span>
              <span className="text-[9px] text-[#8A94A6]">Direct from Meerut</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Specs, Pricing & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-[#8A94A6] mb-2">
              <span className="font-mono bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E6DFD5]">
                SKU: {product.sku}
              </span>
              <span>&bull;</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock ({product.stock} {product.unit} Available)
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2623] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#8A94A6] mt-1">{product.category?.name}</p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5]">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-[#2B2623]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-[#8A94A6]">/{product.unit}</span>
              </div>
              <span className="text-xs bg-[#F5EAE0] text-[#9D643A] font-bold px-2.5 py-1 rounded-full">
                +18% GST Added at Checkout
              </span>
            </div>

            {product.mrp > product.price && (
              <p className="text-xs text-[#8A94A6]">
                List Price / MRP: <span className="line-through">₹{product.mrp}/{product.unit}</span> (Save ₹{product.mrp - product.price}/{product.unit})
              </p>
            )}

            {/* Quick Estimation */}
            <div className="mt-4 pt-3 border-t border-[#E6DFD5] flex justify-between text-xs text-[#554C46]">
              <span>Selected: <strong>{quantity} {product.unit}</strong></span>
              <span className="font-mono">
                Subtotal: <strong>₹{calculatedSubtotal.toLocaleString("en-IN")}</strong> + GST ₹{calculatedGST.toLocaleString("en-IN")} = <strong>₹{calculatedTotal.toLocaleString("en-IN")}</strong>
              </span>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#E6DFD5] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-xs font-bold font-mono focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isAdded ? "bg-emerald-600 text-white" : "bg-[#2B2623] hover:bg-[#C08457] text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Requisition ({quantity} {product.unit})</span>
                  </>
                )}
              </button>
            </div>

            {/* Request Bulk Quote Button */}
            <button
              onClick={() => openQuoteModal(product)}
              className="w-full py-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#9D643A] border-2 border-[#C08457]/50 hover:border-[#C08457] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#C08457]" />
              <span>Request Tiered Bulk Quote (&gt; 500 kg)</span>
            </button>
          </div>

          {/* Quick Technical Summary Table */}
          <div className="rounded-2xl border border-[#E6DFD5] overflow-hidden bg-white text-xs">
            <div className="bg-[#FAF7F2] px-4 py-2.5 font-bold text-[#2B2623] border-b border-[#E6DFD5]">
              Quick Technical Specifications
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-[#E6DFD5]">
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Alloy Grade</span>
                <span className="font-semibold text-[#2B2623]">{product.specs?.alloyGrade || "Standard"}</span>
              </div>
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Temper</span>
                <span className="font-semibold text-[#2B2623]">{product.specs?.temper || "Mill"}</span>
              </div>
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Thickness / Wall</span>
                <span className="font-semibold text-[#2B2623]">{product.specs?.thickness || "N/A"}</span>
              </div>
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Surface Finish</span>
                <span className="font-semibold text-[#2B2623]">{product.specs?.finish || "Mill Finish"}</span>
              </div>
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Dimensions (W x L)</span>
                <span className="font-semibold text-[#2B2623]">
                  {product.specs?.width || ""} x {product.specs?.length || ""}
                </span>
              </div>
              <div className="p-3">
                <span className="text-gray-400 block text-[10px]">Standard Compliance</span>
                <span className="font-semibold text-[#2B2623]">{product.specs?.standard || "IS / ASTM"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Detailed Specs, Applications, Tax Details */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 sm:p-8 shadow-xs">
        <div className="flex border-b border-gray-100 gap-6 text-sm font-semibold mb-6">
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`pb-3 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "blueprint" ? "border-b-2 border-[#C08457] text-[#C08457]" : "text-gray-500 hover:text-black"
            }`}
          >
            <span>Catalogue Engineering Blueprint</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">PDF</span>
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "specs" ? "border-b-2 border-[#C08457] text-[#C08457]" : "text-gray-500 hover:text-black"
            }`}
          >
            Detailed Specifications
          </button>
          <button
            onClick={() => setActiveTab("apps")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "apps" ? "border-b-2 border-[#C08457] text-[#C08457]" : "text-gray-500 hover:text-black"
            }`}
          >
            Industrial Applications
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-3 transition-colors cursor-pointer ${
              activeTab === "shipping" ? "border-b-2 border-[#C08457] text-[#C08457]" : "text-gray-500 hover:text-black"
            }`}
          >
            Tax & Logistics Policy
          </button>
        </div>

        {activeTab === "blueprint" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5]">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2B2623]">
                  Official Catalogue Profile Sheet &bull; {product.category?.name || "Extrusions"}
                </h4>
                <p className="text-xs text-[#554C46] mt-0.5">
                  Extracted directly from Karanwal Aluminium Traders 2026 Catalogue (IS 733 / ASTM B221 Certified).
                </p>
              </div>
              <a
                href="/catalogue.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C08457]" />
                <span>Open 300P Catalogue PDF</span>
              </a>
            </div>

            <div className="rounded-2xl border border-[#E6DFD5] overflow-hidden bg-white p-4 flex justify-center shadow-inner">
              <img
                src={product.images?.[0] || "/drawings/cat_angles.png"}
                alt="Engineering Drawing Blueprint"
                className="max-w-full max-h-[800px] object-contain rounded-xl shadow-xs border border-gray-100"
              />
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-4">
            <p className="text-xs text-[#554C46] leading-relaxed">{product.description}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#E6DFD5] rounded-xl overflow-hidden">
                <tbody className="divide-y divide-[#E6DFD5]">
                  <tr className="bg-[#FAF7F2]">
                    <td className="p-3 font-semibold text-[#2B2623] w-1/3">Alloy Grade & Designation</td>
                    <td className="p-3 font-mono">{product.specs?.alloyGrade}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#2B2623]">Temper Treatment</td>
                    <td className="p-3 font-mono">{product.specs?.temper}</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]">
                    <td className="p-3 font-semibold text-[#2B2623]">Thickness / Wall</td>
                    <td className="p-3 font-mono">{product.specs?.thickness}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#2B2623]">Width / Outer Dimensions</td>
                    <td className="p-3 font-mono">{product.specs?.width}</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]">
                    <td className="p-3 font-semibold text-[#2B2623]">Length</td>
                    <td className="p-3 font-mono">{product.specs?.length}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#2B2623]">Weight per Standard Unit</td>
                    <td className="p-3 font-mono">{product.specs?.weight}</td>
                  </tr>
                  <tr className="bg-[#FAF7F2]">
                    <td className="p-3 font-semibold text-[#2B2623]">Certified Specification</td>
                    <td className="p-3 font-mono">{product.specs?.standard}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "apps" && (
          <div className="space-y-4">
            <p className="text-xs text-[#554C46]">
              Recommended for following precision engineering and manufacturing applications:
            </p>
            <div className="flex flex-wrap gap-2">
              {product.applications?.map((app, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs font-semibold text-[#2B2623]"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-3 text-xs text-[#554C46] leading-relaxed">
            <p>
              <strong>GST Compliance:</strong> All aluminium products are charged at 18% statutory GST as per CBIC guidelines. Tax invoices with GSTIN input credit details are generated automatically.
            </p>
            <p>
              <strong>Regional Delivery:</strong> Orders from Saket, Meerut dispatch within 24-48 hours via dedicated freight or regional parcel carriers across Ghaziabad, Noida, Delhi NCR, and UP West.
            </p>
            <p>
              <strong>Packaging:</strong> Heavy sheets and coils are secured on wooden pallets with moisture-barrier film and strapping bands to prevent transit scratches.
            </p>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#2B2623]">Related Material Specifications</h3>
            <Link to={`/shop?category=${product.category?.slug}`} className="text-xs text-[#C08457] font-semibold hover:underline">
              View all in {product.category?.name} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
