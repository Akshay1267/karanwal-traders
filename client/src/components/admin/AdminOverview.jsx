import React from "react";
import { AlertTriangle, TrendingUp, Package, ShoppingBag, MessageSquare } from "lucide-react";

export default function AdminOverview({ statsData, categoriesCount, onSelectTab }) {
  if (!statsData) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-400">Total Material Sales</span>
          <h3 className="font-serif text-2xl font-bold text-[#2B2623] mt-1 font-mono">
            ₹{statsData.stats.totalSales.toLocaleString("en-IN")}
          </h3>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">
            + ₹{statsData.stats.totalGST.toLocaleString("en-IN")} (18% GST)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-400">Consignments Logged</span>
          <h3 className="font-serif text-2xl font-bold text-[#2B2623] mt-1">
            {statsData.stats.totalOrders}
          </h3>
          <p className="text-[10px] text-gray-500 mt-1">Orders in Fulfillment</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-400">Products in Stock</span>
          <h3 className="font-serif text-2xl font-bold text-[#2B2623] mt-1">
            {statsData.stats.totalProducts}
          </h3>
          <p className="text-[10px] text-[#C08457] font-medium mt-1">
            Across {categoriesCount} categories
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E6DFD5] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-400">Pending RFQ Quotes</span>
          <h3 className="font-serif text-2xl font-bold text-[#9D643A] mt-1">
            {statsData.stats.totalQuotes}
          </h3>
          <p className="text-[10px] text-amber-700 font-medium mt-1">Awaiting Commercial Review</p>
        </div>
      </div>

      {/* Low Stock Alert Strip */}
      {statsData.lowStockProducts?.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Stock Alerts (&le; 20 units remaining)</span>
            </h3>
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {statsData.lowStockProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {statsData.lowStockProducts.map((p) => (
              <div key={p._id} className="p-3 rounded-xl bg-white border border-amber-200 text-xs">
                <h4 className="font-semibold text-[#2B2623] truncate">{p.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-mono text-[10px] text-gray-400">{p.sku}</span>
                  <span className="font-bold text-amber-700">
                    {p.stock} {p.unit} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders & Recent Quotes Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#E6DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2B2623]">Recent Requisitions</h3>
            <button
              onClick={() => onSelectTab("orders")}
              className="text-xs text-[#C08457] font-semibold hover:underline cursor-pointer"
            >
              View Orders &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {statsData.recentOrders?.map((ord) => (
              <div key={ord._id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#2B2623]">{ord.orderNumber}</span>
                  <p className="text-[10px] text-gray-400">{ord.shippingAddress?.fullName}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2B2623]">
                    ₹{ord.total.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-[10px] text-[#9D643A] font-semibold">
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E6DFD5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-bold text-[#2B2623]">Recent RFQ Inquiries</h3>
            <button
              onClick={() => onSelectTab("quotes")}
              className="text-xs text-[#C08457] font-semibold hover:underline cursor-pointer"
            >
              View Quotes &rarr;
            </button>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {statsData.recentQuotes?.map((q) => (
              <div key={q._id} className="py-2.5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-[#2B2623]">{q.name}</h4>
                  <p className="text-[10px] text-gray-500 truncate max-w-xs">{q.product} ({q.quantity})</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#9D643A]">
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
