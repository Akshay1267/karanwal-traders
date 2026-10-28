import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Printer, PackageCheck, ArrowRight, Truck, MapPin, ShieldCheck } from "lucide-react";
import { orderAPI } from "../services/api";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrder(id);
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Order Details Not Found</h2>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] p-8 shadow-sm text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2623]">Thank You for Your Order!</h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Your industrial aluminium requisition has been submitted to our Saket, Meerut dispatch yard.
          </p>
        </div>

        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs">
          <div>
            <span className="text-gray-400 block text-[10px]">Order Reference</span>
            <strong className="font-mono text-sm text-[#2B2623]">{order.orderNumber}</strong>
          </div>
          <div className="h-6 w-px bg-[#E6DFD5]" />
          <div>
            <span className="text-gray-400 block text-[10px]">Payment Status</span>
            <span className="text-emerald-700 font-bold uppercase">{order.paymentStatus}</span>
          </div>
          <div className="h-6 w-px bg-[#E6DFD5]" />
          <div>
            <span className="text-gray-400 block text-[10px]">Current Stage</span>
            <span className="text-[#9D643A] font-bold">{order.orderStatus}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Printer className="w-4 h-4 text-[#C08457]" />
            <span>Print Commercial Receipt</span>
          </button>
          <Link
            to="/orders"
            className="px-6 py-2.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <PackageCheck className="w-4 h-4" />
            <span>View All My Orders</span>
          </Link>
        </div>
      </div>

      {/* Itemized Materials & GST Breakdown */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-sm space-y-6">
        <h3 className="font-serif text-base font-bold text-[#2B2623]">Consignment Line Items</h3>

        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80"}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-[#E6DFD5]"
                />
                <div>
                  <h4 className="font-semibold text-[#2B2623]">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 font-mono">
                    SKU: {item.sku} &bull; Qty: {item.quantity} {item.unit} @ ₹{item.price}/{item.unit}
                  </p>
                </div>
              </div>
              <span className="font-mono font-bold text-sm text-[#2B2623]">
                ₹{item.total.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="pt-4 border-t border-[#E6DFD5] space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Material Subtotal</span>
            <span className="font-mono">₹{order.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>18% Statutory GST</span>
            <span className="font-mono text-[#C08457] font-semibold">
              + ₹{order.gst.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Freight Charge</span>
            <span className="font-mono">
              {order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}
            </span>
          </div>
          <div className="pt-3 border-t border-[#E6DFD5] flex justify-between items-baseline font-bold">
            <span className="text-sm text-[#2B2623]">Grand Total (INR)</span>
            <span className="font-serif text-xl font-mono text-[#2B2623]">
              ₹{order.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Destination Address */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs space-y-1">
          <h4 className="font-bold text-[#2B2623] flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#C08457]" />
            <span>Delivery Destination Address:</span>
          </h4>
          <p className="font-semibold text-[#2B2623]">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
          {order.shippingAddress.companyName && (
            <p className="text-gray-600 font-medium">{order.shippingAddress.companyName}</p>
          )}
          {order.shippingAddress.gstNumber && (
            <p className="text-gray-500 font-mono">GSTIN: {order.shippingAddress.gstNumber}</p>
          )}
          <p className="text-gray-500">
            {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}
