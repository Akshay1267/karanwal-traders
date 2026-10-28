import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Scissors,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText,
  PhoneCall,
  Star,
  Download
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { productAPI, categoryAPI } from "../services/api";
import { fallbackCategories, fallbackProducts } from "../data/fallbackData";
import { useSiteStore } from "../store/useSiteStore";

export default function HomePage({ onOpenAlloyGuide }) {
  const navigate = useNavigate();
  const { brand, owner, contact, openQuoteModal } = useSiteStore();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryAPI.getCategories().catch(() => ({ data: { success: false } })),
          productAPI.getFeatured().catch(() => ({ data: { success: false } }))
        ]);
        if (catRes.data?.success && catRes.data?.categories?.length > 0) {
          setCategories(catRes.data.categories);
        } else {
          setCategories(fallbackCategories);
        }
        if (prodRes.data?.success && prodRes.data?.products?.length > 0) {
          setFeaturedProducts(prodRes.data.products);
        } else {
          setFeaturedProducts(fallbackProducts);
        }
      } catch (err) {
        console.warn("Using offline fallback data:", err.message);
        setCategories(fallbackCategories);
        setFeaturedProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION WITH INDUSTRIAL METALLIC PARALLAX FEEL */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#F3EDE4] to-[#FAF7F2] border-b border-[#E6DFD5]">
        <div className="absolute inset-0 brushed-metal pointer-events-none opacity-40" />

        {/* Ambient Decorative Metallic Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C08457]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 rounded-full bg-[#C9CCD1]/25 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E6DFD5] shadow-xs text-xs font-semibold text-[#9D643A]">
                <span className="w-2 h-2 rounded-full bg-[#C08457] animate-ping" />
                <span>Meerut Regional Warehouse &bull; 500+ Metric Tonnes Ready Stock</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B2623] leading-[1.12]">
                Precision Aluminium Materials,{" "}
                <span className="text-[#C08457] italic">Engineered for Industry</span>
              </h1>

              <p className="text-sm sm:text-base text-[#554C46] max-w-xl leading-relaxed">
                Direct mill supplier of aerospace-grade plates (6061, 7075), marine sheets (5052),
                architectural extrusion profiles, continuous coils, and precision CNC turning bars.
                Serving Meerut, Delhi NCR, and manufacturing hubs across India.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-7 py-3.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore 15 Categories</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => openQuoteModal()}
                  className="px-7 py-3.5 rounded-full bg-white hover:bg-[#F3EDE4] text-[#9D643A] border border-[#C08457]/40 hover:border-[#C08457] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C08457]" />
                  <span>Request Bulk Quote</span>
                </button>
                <a href={brand.cataloguePdfUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 rounded-full bg-amber-500/10 hover:bg-[#C08457] text-[#9D643A] hover:text-white border border-[#C08457]/40 font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4 text-[#C08457]" />
                  <span>Download PDF Catalogue</span>
                </a>
              </div>

              {/* Trust Metrics Pill Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E6DFD5]/80">
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#2B2623]">15+</h4>
                  <p className="text-xs text-[#8A94A6]">Alloy Grades Certified</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#2B2623]">24-48h</h4>
                  <p className="text-xs text-[#8A94A6]">NCR Delivery Guarantee</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#2B2623]">18%</h4>
                  <p className="text-xs text-[#8A94A6]">Statutory GST Invoicing</p>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Visual Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E6DFD5] shadow-2xl bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80"
                  alt="Industrial Aluminium Stockyard"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2B2623]/80 via-transparent to-transparent" />

                {/* Overlay Card Details */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#9D643A] tracking-wider uppercase">
                      Stockyard Spotlight
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      MTC Grade 3.1 Certified
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#2B2623]">
                    6061-T6 Precision Tooling Plates & Extrusions
                  </h3>
                  <p className="text-[11px] text-[#554C46] mt-0.5">
                    Available in thickness 1mm to 100mm with custom CNC shear cutting at Saket, Meerut.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#2B2623] text-white p-3.5 rounded-2xl shadow-xl border border-[#443D39] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C08457] flex items-center justify-center text-white">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Cut-to-Size Service</h4>
                  <p className="text-[10px] text-gray-300">Tolerance &plusmn;0.5mm precision cut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
              Comprehensive Product Portfolio
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2623]">
              15 Industrial Aluminium Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#8A94A6] mt-1">
              Select any category to view live stock quantities, alloy grades, and unit pricing.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#9D643A] hover:text-[#C08457] flex items-center gap-1 group transition-colors"
          >
            <span>View All Materials</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#E6DFD5] hover:border-[#C08457] p-3 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#FAF7F2] mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80"; }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-semibold text-xs text-[#2B2623] group-hover:text-[#C08457] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#8A94A6] mt-0.5">
                  {cat.productCount || "3+"} items available
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
              High-Demand Inventory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2623]">
              Featured Materials & Profiles
            </h2>
            <p className="text-xs sm:text-sm text-[#8A94A6] mt-1">
              Prime certified products ready for immediate dispatch from our Meerut warehouse.
            </p>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs font-bold text-[#9D643A] hover:text-[#C08457] flex items-center gap-1 group transition-colors"
          >
            <span>See All Featured Stock</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE ALUEX METALS (MEERUT ADVANTAGE) */}
      <section className="bg-[#F3EDE4] py-16 border-y border-[#E6DFD5] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
              The {brand.name} Guarantee
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#2B2623] mt-1">
              Why Northern India Fabricators Choose Us
            </h2>
            <p className="text-xs sm:text-sm text-[#554C46] mt-2 leading-relaxed">
              Founded by <strong>{owner.name}</strong>, our operation combines direct mill sourcing from top primary producers with local precision processing in Saket, Meerut.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs hover:border-[#C08457] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#C08457] mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2B2623]">Lab Certified Quality</h3>
              <p className="text-xs text-[#554C46] mt-2 leading-relaxed">
                Every batch accompanied by chemical spectrometer analysis & mechanical test certificates conforming to IS 737 / ASTM B209 standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs hover:border-[#C08457] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#C08457] mb-4">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2B2623]">Custom Cut-to-Size</h3>
              <p className="text-xs text-[#554C46] mt-2 leading-relaxed">
                Save on scrap and machining setup. Our heavy hydraulic shears and CNC cold saws cut sheets, plates, and rods to your exact bill of materials.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs hover:border-[#C08457] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#C08457] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2B2623]">Express NCR Logistics</h3>
              <p className="text-xs text-[#554C46] mt-2 leading-relaxed">
                Strategically positioned in Saket, Meerut to serve Ghaziabad, Noida, Delhi, Muzaffarnagar, and Pan-India transport hubs within hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs hover:border-[#C08457] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center text-[#C08457] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#2B2623]">Wholesale B2B Terms</h3>
              <p className="text-xs text-[#554C46] mt-2 leading-relaxed">
                Transparent pricing with 18% GST input tax credit invoices, tiered discounts for full bundle orders, and flexible payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR ALLOY SPECIFICATIONS HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#2B2623] to-[#3B3430] text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
              Engineering Metallurgy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Unsure which alloy grade suits your design?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Explore mechanical tensile strength, weldability ratings, and machining speeds across 1050, 3003, 5052, 6061, 6063, 6082, and 7075 series alloys.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenAlloyGuide?.()}
                className="px-6 py-3 rounded-full bg-[#C08457] hover:bg-[#9D643A] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Interactive Alloy Guide</span>
              </button>

              <Link
                to="/quote"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase border border-white/20 transition-colors"
              >
                Speak with Metallurgist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
            Industrial Client Reviews
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2623]">
            Trusted by 350+ Manufacturers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#554C46] leading-relaxed italic">
                "{brand.name} has been supplying 6061-T6 tooling plates for our CNC milling fixtures in Noida for over 2 years. Material thickness tolerance is spot on and MTC test reports are consistently authentic."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="font-semibold text-xs text-[#2B2623]">Rohit Sharma</h4>
              <p className="text-[10px] text-[#8A94A6]">Apex Fabrications & Engineering, Noida</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#554C46] leading-relaxed italic">
                "We procured 4.5 metric tonnes of solar panel mounting rails for a 500kW rooftop plant in Meerut. The dispatch was completed in 24 hours directly to our Partapur site, saving days of project delay."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="font-semibold text-xs text-[#2B2623]">Vikram Chauhan</h4>
              <p className="text-[10px] text-[#8A94A6]">Surya Solar EPC Ltd, Meerut</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#554C46] leading-relaxed italic">
                "Finding genuine 5083 marine grade plates with ultrasonic test certification in Western UP used to be a hassle. Shubh Karanwal and his team deliver cut-to-size plates with zero edge cracking."
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="font-semibold text-xs text-[#2B2623]">Manish Agarwal</h4>
              <p className="text-[10px] text-[#8A94A6]">Agarwal Vessels & Equipment, Ghaziabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REQUEST A QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF7F2] border-2 border-dashed border-[#C08457]/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-[#2B2623]">
              Need a Custom Consignment or Cut-to-Size Order?
            </h3>
            <p className="text-xs sm:text-sm text-[#554C46] max-w-xl">
              Send your bill of quantities (BOQ) with requested alloy grades and dimensions. We provide competitive mill-direct quotations with statutory 18% GST within 2 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => openQuoteModal()}
              className="px-7 py-3.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-md cursor-pointer"
            >
              Get Custom Quote
            </button>
            <a
              href={`tel:${contact.primaryPhone}`}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-gray-100 text-[#2B2623] border border-[#E6DFD5] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#C08457]" />
              <span>Call Sales Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
