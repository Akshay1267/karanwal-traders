import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useAuthStore } from "../store/useAuthStore";
import { authAPI } from "../services/api";

export default function WishlistPage() {
  const { user, openAuthModal } = useAuthStore();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setWishlistProducts(res.data.user.wishlist || []);
        }
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Authentication Required</h2>
        <p className="text-xs text-gray-500">Sign in to sync your saved aluminium products across sessions.</p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2B2623]">Saved Materials Wishlist</h1>
        <p className="text-xs text-[#8A94A6] mt-0.5">
          {wishlistProducts.length} materials bookmarked for future project requisitions.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 border border-[#E6DFD5]" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E6DFD5] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#C08457] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2B2623]">No Bookmarked Materials</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click the heart icon on any product in our catalogue to keep track of alloys, sheets, and profiles.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
