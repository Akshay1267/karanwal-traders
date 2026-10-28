import React from "react";
import { MessageSquare, Phone, Mail, Building, MapPin } from "lucide-react";

export default function AdminQuotes({ quotes, onUpdateStatus }) {
  return (
    <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6 animate-fadeIn">
      <div>
        <h3 className="font-serif text-xl font-bold text-[#2B2623]">Customer Quote Inquiries (RFQ)</h3>
        <p className="text-xs text-gray-500">Commercial enterprise inquiries received via bulk quotation form.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {quotes.map((q) => (
          <div key={q._id} className="py-4 space-y-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-[#2B2623]">{q.name}</h4>
                <div className="flex flex-wrap items-center gap-3 text-gray-500 text-[11px] mt-0.5">
                  {q.company && <span className="font-semibold text-gray-700">{q.company}</span>}
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#C08457]" /> {q.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#C08457]" /> {q.email}</span>
                  {q.deliveryLocation && (
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#C08457]" /> {q.deliveryLocation}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-[10px]">Status:</span>
                <select
                  value={q.status}
                  onChange={(e) => onUpdateStatus(q._id, e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-[#E6DFD5] font-semibold text-[#2B2623] bg-[#FAF7F2]"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5]/80 space-y-1">
              <p><strong>Material Requested:</strong> <span className="text-[#C08457] font-semibold">{q.product}</span> &bull; <strong>Quantity:</strong> {q.quantity}</p>
              {q.requiredSpecs && <p className="text-gray-600"><strong>Specifications / Cutting:</strong> {q.requiredSpecs}</p>}
              {q.message && <p className="text-gray-600 italic">"{q.message}"</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
