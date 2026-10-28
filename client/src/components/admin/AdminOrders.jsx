import React from "react";

export default function AdminOrders({ orders, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6 animate-fadeIn">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#2B2623]">Consignment Order Fulfillment</h3>
        <p className="text-xs text-gray-500">Live order status and regional dispatch logs.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF7F2] text-gray-600 uppercase font-semibold text-[10px] border-y border-[#E6DFD5]">
            <tr>
              <th className="py-3 px-4">Order Ref & Date</th>
              <th className="py-3 px-4">Customer & City</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Update Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((ord) => (
              <tr key={ord._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-[#2B2623] block">{ord.orderNumber}</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(ord.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <strong className="text-[#2B2623] block">{ord.shippingAddress?.fullName}</strong>
                  <span className="text-gray-500 text-[10px]">
                    {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {ord.items?.length || 0} material line(s)
                </td>
                <td className="py-3 px-4 font-mono font-bold text-[#2B2623]">
                  ₹{ord.total.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold uppercase text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {ord.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-[#9D643A]">{ord.orderStatus}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => onUpdateStatus(ord._id, e.target.value)}
                    className="px-2.5 py-1 text-[11px] rounded-lg border border-[#E6DFD5] bg-[#FAF7F2] font-semibold text-[#2B2623]"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
