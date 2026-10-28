import React from "react";
import { Link } from "react-router-dom";
import { Award, ShieldCheck, MapPin, Truck, Scissors, Users, Building, ArrowRight } from "lucide-react";
import { useSiteStore } from "../store/useSiteStore";

export default function AboutPage() {
  const { brand, owner, contact } = useSiteStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#C08457] uppercase tracking-wider">
          Company Heritage & Capabilities
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B2623] leading-tight">
          Empowering Indian Manufacturing with Certified Aluminium Alloys
        </h1>
        <p className="text-xs sm:text-base text-[#554C46] leading-relaxed">
          Headquartered in Saket, Meerut, <strong>{brand.name}</strong> was founded by <strong>{owner.name}</strong> to eliminate supply chain friction for industrial fabricators, automotive machine shops, and solar engineering projects.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="bg-white rounded-3xl border border-[#E6DFD5] p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E6DFD5] relative group">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
              alt={owner.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="font-serif text-lg font-bold">{owner.name}</h3>
              <p className="text-xs text-amber-200">{owner.designation}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold text-[#C08457] tracking-wider uppercase">
            Leadership Vision
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2B2623]">
            "Transparency in Alloy Chemistry & Precision in Cut Tolerances"
          </h2>
          <p className="text-xs sm:text-sm text-[#554C46] leading-relaxed">
            "For decades, regional buyers in Western Uttar Pradesh had to compromise between substandard scrap-melted local profiles or high-priced multi-tier broker markups from distant ports.
          </p>
          <p className="text-xs sm:text-sm text-[#554C46] leading-relaxed">
            We established {brand.name} to offer direct primary-smelter materials with verifiable test certificates, honest Indian rupee wholesale rates, and fast cut-to-size deliveries right from Saket, Meerut."
          </p>
          <div className="pt-2">
            <span className="font-serif text-sm font-bold text-[#2B2623]">{owner.name}</span>
            <p className="text-xs text-gray-500">Founder & Managing Director, {brand.legalName}</p>
          </div>
        </div>
      </div>

      {/* Infrastructure & Facility Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DFD5] flex items-center justify-center text-[#C08457]">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#2B2623]">Meerut Stocking Yard</h3>
          <p className="text-xs text-[#554C46] leading-relaxed">
            Located in Sarvodaya Colony, Saket, Meerut holding over 500 metric tonnes of sheets, thick plates, round bars, and extrusion profiles ready for immediate transit.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DFD5] flex items-center justify-center text-[#C08457]">
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#2B2623]">Precision Cutting Facility</h3>
          <p className="text-xs text-[#554C46] leading-relaxed">
            Equipped with 3.2-meter hydraulic guillotine shearing machines and high-accuracy automated band saws to deliver tight tolerance billets and blanks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DFD5] flex items-center justify-center text-[#C08457]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#2B2623]">Quality Testing Desk</h3>
          <p className="text-xs text-[#554C46] leading-relaxed">
            In-house ultrasonic flaw detector and portable optical emission spectrometers verify alloy purity, hardness (Webster/Barcol), and dimensional consistency.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#2B2623] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-2xl font-bold">Partner with {brand.name} Today</h3>
          <p className="text-xs text-gray-300 mt-1 max-w-lg">
            Schedule a visit to our Saket, Meerut stockyard or request a sample material certificate for your technical review.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-7 py-3 rounded-full bg-[#C08457] hover:bg-[#9D643A] text-white text-xs font-semibold tracking-wider uppercase transition-colors shrink-0"
        >
          Contact Our Meerut Desk
        </Link>
      </div>
    </div>
  );
}
