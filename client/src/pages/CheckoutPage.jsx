import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { orderAPI } from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getGST, getShipping, getTotal, clearCart } = useCartStore();
  const { user, openAuthModal } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: user?.name || "Rohit Sharma",
    phone: user?.phone || "+91 98111 22334",
    email: user?.email || "customer@alutrade.com",
    companyName: user?.companyName || "Apex Fabrications & Engineering Works",
    gstNumber: user?.gstNumber || "07AAAAA0000A1Z5",
    street: user?.addresses?.[0]?.street || "Plot 42, Sector 58, Industrial Area",
    city: user?.addresses?.[0]?.city || "Noida",
    state: user?.addresses?.[0]?.state || "Uttar Pradesh",
    pincode: user?.addresses?.[0]?.pincode || "201301",
    paymentMethod: "upi",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = getSubtotal();
  const gst = getGST();
  const shipping = getShipping();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Your Requisition Cart is Empty</h2>
        <p className="text-xs text-gray-500">Please add materials to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold">
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      openAuthModal("login");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      setErrorMsg("Please fill in all mandatory shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product,
          name: item.name,
          sku: item.sku,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const res = await orderAPI.createOrder(orderPayload);
      if (res.data.success) {
        clearCart();
        navigate(`/order-success/${res.data.order._id}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Order creation failed. Please check details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#2B2623]">Commercial Requisition Checkout</h1>
        <p className="text-xs text-[#8A94A6] mt-0.5">
          Review dispatch address, statutory GST tax details, and select payment mode.
        </p>
      </div>

      {!user && (
        <div className="p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>You are currently checking out as guest. Sign in to link this order to your company account.</span>
          </div>
          <button
            onClick={() => openAuthModal("login")}
            className="px-3 py-1 bg-white border border-amber-300 rounded-lg font-bold hover:bg-amber-100 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Address */}
          <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2B2623] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C08457]" />
              <span>Consignment Delivery Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Company / Enterprise Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  GSTIN (for Input Tax Credit)
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  placeholder="09AAACH7492K1Z8"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl font-mono focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Factory / Site Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl font-mono focus:outline-none focus:border-[#C08457]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3.5 py-2 text-xs bg-gray-100 border border-[#E6DFD5] rounded-xl text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Options */}
          <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2B2623] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C08457]" />
              <span>Commercial Payment Options</span>
            </h3>

            <div className="space-y-3">
              {/* UPI / Online Placeholder */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === "upi"
                    ? "border-[#C08457] bg-[#FAF7F2] shadow-xs"
                    : "border-[#E6DFD5] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="accent-[#C08457] w-4 h-4"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2623] flex items-center gap-1.5">
                      <span>UPI / QR Code / NetBanking</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Instant Mock
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, or Corporate NetBanking</p>
                  </div>
                </div>
                <QrCode className="w-5 h-5 text-[#9D643A]" />
              </label>

              {/* RTGS / NEFT Direct Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === "bank_transfer"
                    ? "border-[#C08457] bg-[#FAF7F2] shadow-xs"
                    : "border-[#E6DFD5] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === "bank_transfer"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="accent-[#C08457] w-4 h-4"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2623]">Direct RTGS / NEFT Commercial Transfer</h4>
                    <p className="text-[11px] text-gray-500">Beneficiary: ALUEX Metals Pvt Ltd, HDFC Saket Meerut</p>
                  </div>
                </div>
                <Building className="w-5 h-5 text-gray-400" />
              </label>

              {/* Cash / Cheque on Delivery (COD) */}
              <label
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  formData.paymentMethod === "cod"
                    ? "border-[#C08457] bg-[#FAF7F2] shadow-xs"
                    : "border-[#E6DFD5] hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="accent-[#C08457] w-4 h-4"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2623]">Cash / Bearer Cheque on Delivery (COD)</h4>
                    <p className="text-[11px] text-gray-500">Available for verified NCR industrial buyers</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-gray-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Price Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#2B2623]">Requisition Summary</h3>

            {/* Items mini list */}
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80"}
                      alt=""
                      className="w-10 h-10 object-cover rounded-lg border border-[#E6DFD5]"
                    />
                    <div className="truncate">
                      <h4 className="font-semibold text-[#2B2623] truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-400">
                        {item.quantity} {item.unit} &times; ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#2B2623] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing math */}
            <div className="pt-4 border-t border-[#E6DFD5] space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Material Subtotal</span>
                <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Statutory GST (18%)</span>
                <span className="font-mono text-[#C08457] font-semibold">
                  + ₹{gst.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Freight / Regional Dispatch</span>
                <span className="font-mono">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E6DFD5] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#2B2623]">Grand Total (INR)</span>
                  <p className="text-[10px] text-gray-400">Inclusive of 18% GST</p>
                </div>
                <span className="font-serif text-2xl font-bold font-mono text-[#2B2623]">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#2B2623] to-[#443D39] hover:from-[#C08457] hover:to-[#9D643A] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "Generating Consignment..." : "Confirm & Place Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official GST Invoicing & Instant Dispatched Notification</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
