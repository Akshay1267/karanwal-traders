import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getGST, getShipping, getTotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const gst = getGST();
  const shipping = getShipping();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#C08457] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500">Add aluminium materials from our catalog to proceed.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold transition-colors"
        >
          Explore Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2B2623]">Material Requisition Cart</h1>
        <p className="text-xs text-[#8A94A6] mt-0.5">
          {items.length} product specifications selected for commercial order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.product} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=200&q=80"}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E6DFD5] shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-sm text-[#2B2623]">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span className="font-mono">{item.sku}</span>
                    {item.specs?.alloyGrade && (
                      <span className="bg-[#FAF7F2] border border-[#E6DFD5] text-[#9D643A] font-bold px-1.5 py-0.2 rounded text-[10px]">
                        Grade {item.specs.alloyGrade}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-[#C08457] mt-1 font-mono">
                    ₹{item.price} / {item.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-[#E6DFD5] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="px-2.5 py-1 text-gray-500 hover:bg-gray-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 font-mono text-xs font-bold text-[#2B2623]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="px-2.5 py-1 text-gray-500 hover:bg-gray-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-mono font-bold text-sm text-[#2B2623] min-w-[80px] text-right">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>

                <button
                  onClick={() => removeItem(item.product)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2B2623]">Requisition Summary</h3>

            <div className="space-y-2 text-xs text-gray-600 border-b border-[#E6DFD5] pb-4">
              <div className="flex justify-between">
                <span>Material Subtotal</span>
                <span className="font-mono text-[#2B2623] font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Statutory GST (18%)</span>
                <span className="font-mono text-[#C08457] font-semibold">+ ₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Regional Freight</span>
                <span className="font-mono text-[#2B2623]">
                  {shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <span className="text-sm font-bold text-[#2B2623]">Grand Total (INR)</span>
                <p className="text-[10px] text-gray-400">Includes 18% GST</p>
              </div>
              <span className="font-serif text-2xl font-bold font-mono text-[#2B2623]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full GST Input Tax Credit Claimable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
