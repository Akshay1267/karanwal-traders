import React, { useState } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const alloyData = [
  {
    series: "6000 Series",
    name: "Aluminium 6061-T6",
    title: "Structural & Tooling Workhorse",
    composition: "Al - 1.0% Mg - 0.6% Si - 0.25% Cu - 0.2% Cr",
    tensile: "310 MPa (45 ksi)",
    yield: "276 MPa (40 ksi)",
    machinability: "Excellent (80%)",
    weldability: "Good (TIG/MIG with 4043/5356)",
    corrosion: "Very Good (Atmospheric)",
    bestFor: "Jigs & fixtures, machine frames, aerospace fittings, structural brackets",
    filterTag: "6061"
  },
  {
    series: "6000 Series",
    name: "Aluminium 6063-T6",
    title: "Architectural & Extrusion Benchmark",
    composition: "Al - 0.7% Mg - 0.4% Si",
    tensile: "241 MPa (35 ksi)",
    yield: "214 MPa (31 ksi)",
    machinability: "Good (70%)",
    weldability: "Excellent",
    corrosion: "Superior (Ideal for decorative anodizing)",
    bestFor: "Window frames, modular T-slots, solar rails, railings, furniture",
    filterTag: "6063"
  },
  {
    series: "5000 Series",
    name: "Aluminium 5052-H32",
    title: "Marine & Sheet Metal Fabrication",
    composition: "Al - 2.5% Mg - 0.25% Cr",
    tensile: "228 MPa (33 ksi)",
    yield: "193 MPa (28 ksi)",
    machinability: "Moderate (Fair)",
    weldability: "Superior (No loss of strength)",
    corrosion: "Highest Saltwater & Marine Resistance",
    bestFor: "Boat hulls, fuel tanks, electronic chassis, architectural panels",
    filterTag: "5052"
  },
  {
    series: "7000 Series",
    name: "Aluminium 7075-T651",
    title: "Aerospace Ultra-High Tensile",
    composition: "Al - 5.6% Zn - 2.5% Mg - 1.6% Cu",
    tensile: "572 MPa (83 ksi)",
    yield: "503 MPa (73 ksi)",
    machinability: "Outstanding (70%)",
    weldability: "Poor (Resistance welding only)",
    corrosion: "Moderate (Often anodized or clad)",
    bestFor: "Aircraft wing spars, military defense gears, high-load racing gears",
    filterTag: "7075"
  },
  {
    series: "1000 Series",
    name: "Aluminium 1050 / 1100",
    title: "Commercial Purity (99.5%+ Pure)",
    composition: "Al minimum 99.50%",
    tensile: "110 - 145 MPa",
    yield: "85 - 125 MPa",
    machinability: "Poor (Soft and gummy)",
    weldability: "Excellent (Self-filler or 1100)",
    corrosion: "Superb Chemical & Food Acid Resistance",
    bestFor: "Chemical tanks, heat sinks, deep drawn cookware, electrical busbars",
    filterTag: "1050"
  }
];

export default function AlloyGuideModal({ isOpen, onClose }) {
  const [selectedAlloy, setSelectedAlloy] = useState(alloyData[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fadeIn" />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FAF7F2] p-5 border-b border-[#E6DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C08457] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2623]">Aluminium Alloy Selection Guide</h3>
              <p className="text-xs text-[#8A94A6]">Technical specifications, mechanical properties & applications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Alloy Pill Selector */}
          <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
            {alloyData.map((alloy) => (
              <button
                key={alloy.name}
                onClick={() => setSelectedAlloy(alloy)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedAlloy.name === alloy.name
                    ? "bg-[#2B2623] text-white shadow-xs"
                    : "bg-[#FAF7F2] text-[#554C46] hover:bg-[#F3EDE4] border border-[#E6DFD5]"
                }`}
              >
                {alloy.name.split(" ")[1]}
              </button>
            ))}
          </div>

          {/* Alloy Details Card */}
          <div className="mt-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] tracking-wider uppercase font-bold text-[#C08457]">
                  {selectedAlloy.series}
                </span>
                <h4 className="font-serif text-xl font-bold text-[#2B2623]">{selectedAlloy.name}</h4>
                <p className="text-xs text-gray-500">{selectedAlloy.title}</p>
              </div>

              <Link
                to={`/shop?alloyGrade=${selectedAlloy.filterTag}`}
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#C08457] hover:text-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] transition-colors flex items-center gap-1.5"
              >
                <span>Browse {selectedAlloy.filterTag} Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Properties Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/80">
                <span className="text-[10px] text-gray-400 font-medium block">Ultimate Tensile</span>
                <strong className="text-[#2B2623] font-mono text-sm">{selectedAlloy.tensile}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/80">
                <span className="text-[10px] text-gray-400 font-medium block">Yield Strength</span>
                <strong className="text-[#2B2623] font-mono text-sm">{selectedAlloy.yield}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/80">
                <span className="text-[10px] text-gray-400 font-medium block">Machinability</span>
                <strong className="text-[#2B2623]">{selectedAlloy.machinability}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/80">
                <span className="text-[10px] text-gray-400 font-medium block">Weldability</span>
                <strong className="text-[#2B2623]">{selectedAlloy.weldability}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5]/80 col-span-2">
                <span className="text-[10px] text-gray-400 font-medium block">Corrosion Resistance</span>
                <strong className="text-[#2B2623]">{selectedAlloy.corrosion}</strong>
              </div>
            </div>

            {/* Applications */}
            <div className="p-4 rounded-xl bg-[#F5EAE0] border border-[#E8D9CC]">
              <span className="text-xs font-bold text-[#9D643A] block mb-1">Recommended Applications:</span>
              <p className="text-xs text-[#2B2623] leading-relaxed">{selectedAlloy.bestFor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
