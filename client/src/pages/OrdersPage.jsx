import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, Truck, Clock, ShieldCheck, ChevronRight, AlertCircle } from "lucide-react";
import { orderAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

const statusSteps = ["Placed", "Processing", "Shipped", "Delivered"];

export default function OrdersPage() {
  const { user, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Authentication Required</h2>
        <p className="text-xs text-gray-500">Please sign in to track and view your company orders.</p>
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#2B2623]">Order History & Dispatch Tracking</h1>
        <p className="text-xs text-[#8A94A6] mt-0.5">
          Real-time status updates for aluminium materials dispatched from Saket, Meerut.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-[#E6DFD5] animate-pulse h-40" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E6DFD5] space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#C08457] flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2B2623]">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't initiated any material requisitions with this account.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold"
          >
            Browse Catalogue
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = statusSteps.indexOf(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                    <h3 className="font-mono text-base font-bold text-[#2B2623]">{order.orderNumber}</h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Grand Total (18% GST)</span>
                      <strong className="font-mono text-sm text-[#2B2623]">
                        ₹{order.total.toLocaleString("en-IN")}
                      </strong>
                    </div>
                    <Link
                      to={`/order-success/${order._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-100 border border-[#E6DFD5] font-semibold text-xs text-[#2B2623]"
                    >
                      View Invoice
                    </Link>
                  </div>
                </div>

                {/* Progress Tracker Bar */}
                <div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs mb-2">
                    {statusSteps.map((step, idx) => {
                      const isComplete = idx <= currentStepIdx;
                      return (
                        <div key={step}>
                          <span
                            className={`text-[11px] font-semibold ${
                              isComplete ? "text-[#C08457]" : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex">
                    {statusSteps.map((step, idx) => (
                      <div
                        key={step}
                        className={`flex-1 transition-all ${
                          idx <= currentStepIdx ? "bg-[#C08457]" : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <p className="text-[11px] text-gray-500 mt-2 font-mono flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-[#C08457]" />
                      <span>Tracking ID: <strong>{order.trackingNumber}</strong></span>
                    </p>
                  )}
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5]/80 flex items-center gap-3 text-xs"
                    >
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80"}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg border border-[#E6DFD5]"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-[#2B2623] truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {item.quantity} {item.unit} &bull; ₹{item.total.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
