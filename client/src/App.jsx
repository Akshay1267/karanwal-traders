import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import QuoteModal from "./components/QuoteModal";
import AuthModal from "./components/AuthModal";
import AlloyGuideModal from "./components/AlloyGuideModal";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import QuotePage from "./pages/QuotePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import { useSiteStore } from "./store/useSiteStore";
import { useAuthStore } from "./store/useAuthStore";

export default function App() {
  const { fetchSiteConfig } = useSiteStore();
  const { fetchMe } = useAuthStore();
  const [isAlloyGuideOpen, setIsAlloyGuideOpen] = useState(false);

  // Initialize smooth scrolling with Lenis & load initial user and site config
  useEffect(() => {
    fetchSiteConfig();
    fetchMe();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2B2623] font-sans antialiased selection:bg-[#C08457] selection:text-white">
        {/* Navigation */}
        <Navbar onOpenAlloyGuide={() => setIsAlloyGuideOpen(true)} />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenAlloyGuide={() => setIsAlloyGuideOpen(true)} />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/quote" element={<QuotePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <QuoteModal />
        <AuthModal />
        <AlloyGuideModal isOpen={isAlloyGuideOpen} onClose={() => setIsAlloyGuideOpen(false)} />
      </div>
    </Router>
  );
}
