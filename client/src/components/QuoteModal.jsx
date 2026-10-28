import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, FileText, Phone, Mail, Building, MapPin } from "lucide-react";
import { useSiteStore } from "../store/useSiteStore";
import { useAuthStore } from "../store/useAuthStore";
import { quoteAPI } from "../services/api";

export default function QuoteModal() {
  const { isQuoteModalOpen, quoteModalProduct, closeQuoteModal } = useSiteStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isQuoteModalOpen) {
      setFormData({
        name: user?.name || "",
        company: user?.companyName || "",
        phone: user?.phone || "",
        email: user?.email || "",
        product: quoteModalProduct ? `${quoteModalProduct.name} (${quoteModalProduct.sku})` : "",
        quantity: quoteModalProduct ? `100 ${quoteModalProduct.unit || "kg"}` : "",
        requiredSpecs: quoteModalProduct?.specs
          ? `Alloy: ${quoteModalProduct.specs.alloyGrade || ""}, Thickness: ${quoteModalProduct.specs.thickness || ""}`
          : "",
        deliveryLocation: "Meerut / Delhi NCR",
        message: ""
      });
      setIsSubmitted(false);
      setErrorMsg("");
    }
  }, [isQuoteModalOpen, quoteModalProduct, user]);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.phone || !formData.email || !formData.product || !formData.quantity) {
      setErrorMsg("Please fill in Name, Phone, Email, Product and Quantity.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await quoteAPI.createQuote(formData);
      if (res.data.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit quote enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeQuoteModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FAF7F2] p-6 border-b border-[#E6DFD5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C08457]/15 text-[#9D643A] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2623]">
                Request Bulk Material Quotation
              </h3>
              <p className="text-xs text-[#8A94A6]">Direct mill discounts for consignments &gt; 500 kg</p>
            </div>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#2B2623]">Quotation Request Received!</h4>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you for contacting <strong className="text-[#2B2623]">ALUEX METALS</strong>. Our Meerut sales
              engineering desk has logged your enquiry. We will email our formal stamped commercial proposal with 18% GST breakdown within 2 business hours.
            </p>
            <button
              onClick={closeQuoteModal}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Company / Enterprise</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Chandra Fabrications Pvt Ltd"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                  <Building className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98970 12345"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="purchase@company.com"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Material Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g. Aluminium Sheet 6061-T6 (6mm)"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Estimated Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 2.5 Metric Tonnes or 250 Sheets"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Custom Specs / Cutting Dimensions
                </label>
                <input
                  type="text"
                  value={formData.requiredSpecs}
                  onChange={(e) => setFormData({ ...formData, requiredSpecs: e.target.value })}
                  placeholder="e.g. Cut to 600mm x 1200mm, IS 737 test cert"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                  Delivery Destination / Pincode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="e.g. Ghaziabad / Meerut (250001)"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2623] mb-1">
                Additional Instructions / Tolerances
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention ultrasonic test requirements, surface anodizing thickness, delivery timeline..."
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeQuoteModal}
                className="px-5 py-2.5 rounded-xl border border-[#E6DFD5] text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Send Request"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
