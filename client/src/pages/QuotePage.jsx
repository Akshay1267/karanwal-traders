import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck, Award, Scissors, Truck, Phone, Mail, Building } from "lucide-react";
import { quoteAPI } from "../services/api";
import { useSiteStore } from "../store/useSiteStore";
import { useAuthStore } from "../store/useAuthStore";

export default function QuotePage() {
  const { brand, contact } = useSiteStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: user?.companyName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    product: "",
    quantity: "",
    requiredSpecs: "",
    deliveryLocation: "Meerut / NCR",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.phone || !formData.email || !formData.product || !formData.quantity) {
      setErrorMsg("Please fill in all required fields (Name, Phone, Email, Material, Quantity).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await quoteAPI.createQuote(formData);
      if (res.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit quote request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
          Enterprise Wholesale Procurement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2623]">
          Request Commercial Wholesale Quotation
        </h1>
        <p className="text-xs sm:text-sm text-[#554C46] leading-relaxed">
          Direct primary mill pricing for heavy manufacturing consignments exceeding 500 kg.
          Detailed stamped quotes with 18% GST input credit breakdown delivered within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DFD5] p-6 sm:p-8 shadow-xs">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2B2623]">Quotation Request Received!</h3>
              <p className="text-xs text-[#554C46] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our sales engineering team at Saket, Meerut
                has registered your enquiry. We will email our formal commercial proposal shortly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    company: "",
                    phone: "",
                    email: "",
                    product: "",
                    quantity: "",
                    requiredSpecs: "",
                    deliveryLocation: "",
                    message: ""
                  });
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shubh Karanwal"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Industrial Works"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
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
                    placeholder="+91 98970 12345"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="purchases@company.com"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Material / Alloy Grade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    placeholder="e.g. 6061-T6 Plate 12mm or 4040 T-Slot"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Estimated Quantity *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 3.5 Metric Tonnes or 500 Meters"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Cutting Dimensions / Specs
                  </label>
                  <input
                    type="text"
                    value={formData.requiredSpecs}
                    onChange={(e) => setFormData({ ...formData, requiredSpecs: e.target.value })}
                    placeholder="e.g. 1500mm x 3000mm, shear cut"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                    Delivery Destination / Plant Location
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="e.g. Sahibabad Industrial Area, Ghaziabad"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Bill of Quantities / Project Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Paste your BOQ, specify test certificates required (UT/Radiography), target delivery dates..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting Quotation..." : "Transmit Quotation Request"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right B2B Enterprise Benefits Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DFD5] p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#2B2623]">
              B2B Wholesale Procurement Perks
            </h3>

            <div className="space-y-4 text-xs text-[#554C46]">
              <div className="flex gap-3 items-start">
                <Award className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Tiered Wholesale Slabs</h4>
                  <p className="mt-0.5">Discounts of 4% to 9% available on bulk bundles (&gt; 2 MT) and full truck loads (FTL).</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Full Input Tax Credit (18% GST)</h4>
                  <p className="mt-0.5">Automated GSTR-1 filings and E-Way bills ensuring 100% claimable input credit for your business.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Scissors className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">In-House Precision Cutting</h4>
                  <p className="mt-0.5">High-capacity shearing machines in Saket, Meerut cut plate strips and billets with minimal kerf loss.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Truck className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Direct Site Delivery</h4>
                  <p className="mt-0.5">Direct trailer dispatch with crane offloading support across Western Uttar Pradesh and Delhi NCR.</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Phone Box */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6DFD5] space-y-2 text-xs">
              <span className="font-bold text-[#2B2623] block">Direct Corporate Desk:</span>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-3.5 h-3.5 text-[#C08457]" />
                <a href={`tel:${contact.primaryPhone}`} className="hover:text-black font-semibold">
                  {contact.primaryPhone}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 text-[#C08457]" />
                <a href={`mailto:${contact.primaryEmail}`} className="hover:text-black font-semibold">
                  {contact.primaryEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
