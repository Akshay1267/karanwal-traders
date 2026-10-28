import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getGST,
    getShipping,
    getTotal
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const gst = getGST();
  const shipping = getShipping();
  const total = getTotal();

  const freeShippingThreshold = 25000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    closeDrawer();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E6DFD5] animate-slideLeft">
          {/* Header */}
          <div className="p-5 border-b border-[#E6DFD5] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C08457]" />
              <h2 className="font-serif text-lg font-bold text-[#2B2623]">Material Requisition Cart</h2>
              <span className="text-xs bg-[#C08457]/15 text-[#9D643A] font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F5EAE0] px-5 py-3 border-b border-[#E8D9CC]">
            <div className="flex items-center justify-between text-xs font-medium text-[#2B2623] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C08457]" />
                {subtotal >= freeShippingThreshold ? (
                  <strong className="text-emerald-700 font-semibold">Free Freight Freight Applied!</strong>
                ) : (
                  <span>
                    Add ₹{(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for Free NCR Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#9D643A] font-bold">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-[#E8D9CC] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C08457] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center mb-4 text-[#C08457]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2B2623]">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Browse our high-grade aluminium sheets, coils, rods, and extrusion profiles to add materials.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate("/shop");
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold hover:bg-[#C08457] transition-all cursor-pointer"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product} className="py-4 flex gap-3.5">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80"}
                    alt={item.name}
                    className="w-18 h-18 object-cover rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-[#2B2623] line-clamp-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-gray-500">{item.sku}</span>
                      {item.specs?.alloyGrade && (
                        <span className="text-[9px] bg-[#FAF7F2] border border-[#E6DFD5] text-[#9D643A] font-bold px-1.5 py-0.2 rounded">
                          {item.specs.alloyGrade}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E6DFD5] rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold font-mono text-[#2B2623] min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2B2623] font-mono">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-gray-400">
                          ₹{item.price}/{item.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Breakdown Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E6DFD5] bg-[#FAF7F2] space-y-2.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Material Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>GST (18% Statutory Rate)</span>
                <span className="font-mono font-medium text-[#C08457]">
                  + ₹{gst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Estimated Freight / Logistics</span>
                <span className="font-mono font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${shipping.toLocaleString("en-IN")}`
                  )}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E6DFD5] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#2B2623]">Grand Total</span>
                  <p className="text-[10px] text-gray-400">Includes 18% GST and Shipping</p>
                </div>
                <span className="text-xl font-bold font-mono text-[#2B2623]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#2B2623] to-[#403935] hover:from-[#C08457] hover:to-[#9D643A] text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>GST Tax Invoice with E-Way Bill Generated</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
