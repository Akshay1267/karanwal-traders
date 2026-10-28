import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Phone,
  MapPin,
  ShieldCheck,
  FileText,
  ChevronDown,
  Layers,
  LogOut,
  PackageCheck,
  Sparkles,
  Download,
  ExternalLink
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useSiteStore } from "../store/useSiteStore";

export default function Navbar({ onOpenAlloyGuide }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, openAuthModal } = useAuthStore();
  const { getItemCount, openDrawer } = useCartStore();
  const { brand, contact, openQuoteModal } = useSiteStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const cartCount = getItemCount();
  const wishlistCount = user?.wishlist?.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner - B2B & Location Credibility */}
      <div className="bg-[#2B2623] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#3D3734]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C08457]" />
              <span className="font-medium text-white">Saket, Meerut</span> &bull; Pan-India Dispatch
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C08457]" />
              GST Reg: <strong className="text-white font-mono">{contact.gstin}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${contact.primaryPhone}`}
              className="hover:text-[#C08457] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#C08457]" />
              <span>{contact.primaryPhone}</span>
            </a>
            <span className="hidden sm:inline text-slate-500">|</span>

            {/* Direct PDF Catalogue Link */}
            <a
              href={brand.cataloguePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#C08457]/20 hover:bg-[#C08457] text-amber-200 hover:text-white px-2.5 py-0.5 rounded-full border border-[#C08457]/40 transition-all font-semibold"
            >
              <Download className="w-3 h-3" />
              <span>PDF Catalogue</span>
            </a>

            <span className="hidden sm:inline text-slate-500">|</span>
            <button
              onClick={() => onOpenAlloyGuide?.()}
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#C08457]" />
              <span>Alloy Guide</span>
            </button>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-[#C08457] font-semibold tracking-wide">18% GST</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Glass Effect on Scroll */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? "glass-panel shadow-md py-3.5"
            : "bg-[#FAF7F2] border-b border-[#E6DFD5] py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo / Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C08457] to-[#9D643A] flex items-center justify-center text-white font-bold text-xl shadow-md border border-[#E8C2A0]/40 group-hover:scale-105 transition-transform">
              <span className="font-serif">KA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2B2623] group-hover:text-[#C08457] transition-colors leading-tight">
                {brand.name}
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8A94A6]">
                Shubh Karanwal &bull; Saket, Meerut
              </span>
            </div>
          </Link>

          {/* Search Bar - Center */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alloy (6061, 5052), sheets, tubes, profiles, SKU..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E6DFD5] rounded-full focus:outline-none focus:border-[#C08457] focus:ring-2 focus:ring-[#C08457]/15 transition-all text-[#2B2623] placeholder-[#8A94A6] shadow-xs"
            />
            <Search className="w-4 h-4 text-[#8A94A6] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </form>

          {/* Desktop Links & Actions */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#2B2623]">
            <Link
              to="/shop"
              className={`hover:text-[#C08457] transition-colors ${
                location.pathname === "/shop" ? "text-[#C08457] font-semibold" : ""
              }`}
            >
              Catalogue
            </Link>

            {/* Direct Catalogue PDF Link in Nav */}
            <a
              href={brand.cataloguePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9D643A] hover:text-[#C08457] font-semibold flex items-center gap-1 transition-colors"
            >
              <Download className="w-4 h-4 text-[#C08457]" />
              <span>Download PDF</span>
            </a>

            <Link
              to="/quote"
              className="hover:text-[#C08457] transition-colors"
            >
              Bulk Quote
            </Link>
            <Link
              to="/about"
              className={`hover:text-[#C08457] transition-colors ${
                location.pathname === "/about" ? "text-[#C08457] font-semibold" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`hover:text-[#C08457] transition-colors ${
                location.pathname === "/contact" ? "text-[#C08457] font-semibold" : ""
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-white text-[#2B2623] border border-transparent hover:border-[#E6DFD5] transition-all"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C08457] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#F3EDE4] text-[#2B2623] border border-[#E6DFD5] hover:border-[#C08457] transition-all shadow-xs flex items-center gap-2 px-3.5 cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#C08457]" />
              <span className="hidden sm:inline font-semibold text-xs text-[#2B2623]">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#2B2623] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white border border-[#E6DFD5] hover:border-[#C08457] text-sm text-[#2B2623] transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FAF7F2] border border-[#C08457] flex items-center justify-center text-[#C08457] font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate font-medium">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8A94A6]" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#E6DFD5] py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-[#2B2623] truncate">{user.name}</p>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 text-[10px] bg-amber-100 text-[#9D643A] font-bold px-2 py-0.5 rounded-full">
                          ADMIN
                        </span>
                      )}
                    </div>

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#9D643A] font-semibold hover:bg-[#FAF7F2]"
                      >
                        <Layers className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FAF7F2]"
                    >
                      <PackageCheck className="w-4 h-4 text-gray-500" />
                      My Orders
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left border-t border-gray-100 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2B2623] text-white text-xs font-semibold hover:bg-[#C08457] transition-all shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#2B2623] hover:bg-white border border-[#E6DFD5]"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 border-t border-[#E6DFD5] bg-white mt-3 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="mb-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search materials, grades, tubes..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl text-[#2B2623]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-col space-y-3 font-medium text-sm text-[#2B2623]">
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-100 flex items-center justify-between"
              >
                <span>Product Catalogue</span>
                <span className="text-xs text-[#C08457] font-semibold">15 Categories &rarr;</span>
              </Link>

              {/* Mobile Catalogue PDF */}
              <a
                href={brand.cataloguePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-100 flex items-center justify-between text-[#9D643A] font-bold"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C08457]" />
                  Download PDF Catalogue
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>

              <Link
                to="/quote"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-100 text-[#9D643A] font-semibold flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Request Bulk Quotation</span>
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAlloyGuide?.();
                }}
                className="py-2 border-b border-gray-100 text-left flex items-center gap-2 text-amber-800"
              >
                <Sparkles className="w-4 h-4 text-[#C08457]" />
                <span>Alloy Technical Cheat Sheet</span>
              </button>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-100"
              >
                About {brand.name}
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-gray-100"
              >
                Contact & Saket Meerut Address
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 text-[#9D643A] font-bold"
                >
                  Admin Management Dashboard &rarr;
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
