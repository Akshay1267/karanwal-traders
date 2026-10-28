import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldCheck } from "lucide-react";
import { useSiteStore } from "../store/useSiteStore";
import { quoteAPI } from "../services/api";

export default function ContactPage() {
  const { brand, owner, contact } = useSiteStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    product: "General Enquiry",
    quantity: "Information",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      setErrorMsg("Please fill in Name, Phone and Email.");
      return;
    }
    setIsSubmitting(true);
    try {
      await quoteAPI.createQuote(formData);
      setIsSent(true);
    } catch (err) {
      setErrorMsg("Failed to send message. Please try calling directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
          Direct Mill Communication
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2623]">
          Contact {brand.name}
        </h1>
        <p className="text-xs sm:text-sm text-[#554C46]">
          Reach our material engineers and dispatch team in Saket, Meerut for immediate pricing and consignment scheduling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Office Details & Direct Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DFD5] p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2B2623]">Registered Office & Stockyard</h3>

            <div className="space-y-4 text-xs text-[#554C46]">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Office & Yard Address:</h4>
                  <p className="mt-0.5 font-medium leading-relaxed">{contact.address.full}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Telephone & WhatsApp Desk:</h4>
                  <p className="mt-0.5">
                    <a href={`tel:${contact.primaryPhone}`} className="hover:text-black font-semibold text-sm">
                      {contact.primaryPhone}
                    </a>
                  </p>
                  <p className="text-[11px] text-gray-500">Available on WhatsApp for instant drawing sharing</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Official Commercial Inquiries:</h4>
                  <p className="mt-0.5">
                    <a href={`mailto:${contact.primaryEmail}`} className="hover:text-black font-semibold">
                      {contact.primaryEmail}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Operating Hours:</h4>
                  <p className="mt-0.5">Monday to Saturday: 9:00 AM - 7:30 PM IST</p>
                  <p className="text-[11px] text-gray-500">Warehouse loading dock open until 8:00 PM</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-[#C08457] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">Tax Identification:</h4>
                  <p className="font-mono text-xs font-semibold text-[#2B2623]">{contact.gstin}</p>
                  <p className="text-[10px] text-gray-500">State: Uttar Pradesh (Code 09)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6DFD5] p-6 sm:p-8 shadow-xs">
          {isSent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2B2623]">Message Transmitted!</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you for getting in touch. An executive from our Saket, Meerut desk will reply to you within 2 hours.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-4 px-6 py-2 rounded-full bg-[#2B2623] text-white text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#2B2623]">Send a Direct Message</h3>
              <p className="text-xs text-gray-500">
                Inquire about custom extrusion dies, MTC test reports, or bulk container deliveries.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2623] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Message / Requirements</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the alloy grades, shapes, or project timeline..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Full Width Google Maps Embed of Saket Meerut */}
      <div className="rounded-3xl overflow-hidden border border-[#E6DFD5] shadow-sm">
        <iframe
          title="Full Map Saket Meerut Location"
          src={contact.mapEmbedUrl}
          width="100%"
          height="380"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
