import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  Award,
  Scissors,
  ExternalLink
} from "lucide-react";
import { useSiteStore } from "../store/useSiteStore";

export default function Footer() {
  const { brand, owner, contact } = useSiteStore();

  return (
    <footer className="bg-[#24201D] text-[#FAF7F2] border-t-4 border-[#C08457] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-[#3D3734]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2E2824] border border-[#4A423D] flex items-center justify-center text-[#C08457] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">IS & ASTM Certified</h4>
              <p className="text-xs text-[#A09891]">Mill Test Certificates (MTC) provided</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2E2824] border border-[#4A423D] flex items-center justify-center text-[#C08457] shrink-0">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Cut-to-Size Service</h4>
              <p className="text-xs text-[#A09891]">CNC band saw & shear cutting</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2E2824] border border-[#4A423D] flex items-center justify-center text-[#C08457] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Rapid Regional Dispatch</h4>
              <p className="text-xs text-[#A09891]">Meerut, Delhi NCR & Pan-India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2E2824] border border-[#4A423D] flex items-center justify-center text-[#C08457] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">Direct Mill Pricing</h4>
              <p className="text-xs text-[#A09891]">Transparent 18% GST tax invoices</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand Info & Founder */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C08457] flex items-center justify-center text-white font-serif font-bold text-lg">
                Al
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                {brand.name}
              </span>
            </div>
            <p className="text-xs text-[#A09891] leading-relaxed">
              Premier industrial stockist and supplier of aluminium sheets, heavy plates, coils, rods,
              structural channels, and custom extrusions. Serving manufacturing, defense, solar EPC, and architectural fabricators.
            </p>
            <div className="pt-2 text-xs text-[#A09891]">
              <p className="text-white font-medium">Founder & Director:</p>
              <p className="text-[#C08457] font-semibold text-sm">{owner.name}</p>
              <p className="text-[11px] text-[#807770]">GSTIN: {contact.gstin}</p>
            </div>
          </div>

          {/* Key Product Categories */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Core Categories</h4>
            <ul className="space-y-2 text-xs text-[#A09891]">
              <li>
                <Link to="/shop?category=aluminium-sheets" className="hover:text-[#C08457] transition-colors">
                  Aluminium Sheets (1050 / 3003 / 5052)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=aluminium-plates" className="hover:text-[#C08457] transition-colors">
                  Aluminium Plates (6061-T6 / 5083 / 7075)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=chequered-diamond-plates" className="hover:text-[#C08457] transition-colors">
                  5-Bar Chequered & Diamond Plates
                </Link>
              </li>
              <li>
                <Link to="/shop?category=round-bars-rods" className="hover:text-[#C08457] transition-colors">
                  Round Bars & Turning Rods (6082-T6)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=pipes-tubes" className="hover:text-[#C08457] transition-colors">
                  Seamless Pipes & Hollow Sections (SHS/RHS)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=extrusion-profiles" className="hover:text-[#C08457] transition-colors">
                  4040 T-Slot Profiles & Solar Rails
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-[#C08457] font-semibold flex items-center gap-1 pt-1">
                  View All 15 Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Service */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-[#A09891]">
              <li>
                <Link to="/quote" className="hover:text-[#C08457] transition-colors text-white font-medium">
                  Request Bulk Wholesale Quote
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C08457] transition-colors">
                  About Our Trading Facility
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C08457] transition-colors">
                  Contact Us & Location Map
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#C08457] transition-colors">
                  Track Consignment Status
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#C08457] transition-colors">
                  Saved Materials Wishlist
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-300/80 hover:text-amber-200 transition-colors">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Address & Map Embed */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4">Meerut Head Office</h4>
            <div className="space-y-2.5 text-xs text-[#A09891]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C08457] shrink-0 mt-0.5" />
                <span>{contact.address.full}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C08457] shrink-0" />
                <a href={`tel:${contact.primaryPhone}`} className="hover:text-white transition-colors">
                  {contact.primaryPhone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C08457] shrink-0" />
                <a href={`mailto:${contact.primaryEmail}`} className="hover:text-white transition-colors">
                  {contact.primaryEmail}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C08457] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:30 PM IST</span>
              </p>
            </div>

            {/* Embedded Meerut Map */}
            <div className="mt-4 rounded-xl overflow-hidden border border-[#3D3734] shadow-sm">
              <iframe
                title="Office Location Saket Meerut"
                src={contact.mapEmbedUrl}
                width="100%"
                height="110"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#3D3734] flex flex-col sm:flex-row items-center justify-between text-xs text-[#807770] gap-4">
          <p>
            &copy; {new Date().getFullYear()} {brand.name}. All Rights Reserved. Prototype created for Shubh Karanwal.
          </p>
          <div className="flex items-center gap-6">
            <span>Prices exclusive of 18% GST (added at checkout)</span>
            <span className="hidden md:inline">&bull;</span>
            <span className="text-[#A09891]">Currency: INR (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
