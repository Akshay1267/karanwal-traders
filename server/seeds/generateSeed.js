const fs = require("fs");
const path = require("path");

const rawCategories = [
  { name: "Aluminium Sheets", slug: "aluminium-sheets", img: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", desc: "Commercial & industrial sheets in 1050, 1100, 3003, and 5052 alloys for fabrication and automotive stamping." },
  { name: "Aluminium Plates", slug: "aluminium-plates", img: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80", desc: "Precision tooling & structural plates in 6061-T6, 5083 marine grade, and 7075-T651 aerospace grade." },
  { name: "Aluminium Coils & Rolls", slug: "aluminium-coils-rolls", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80", desc: "Continuous rolled strip coils for roofing, transformer winding, and high-speed stamping." },
  { name: "Aluminium Chequered / Diamond Plates", slug: "chequered-diamond-plates", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", desc: "Anti-slip 5-bar and diamond pattern tread plates for flooring, vehicle footrests, and stairs." },
  { name: "Aluminium Foils", slug: "aluminium-foils", img: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80", desc: "Pharmaceutical blister foil, industrial HVAC fin stock foil, and container packaging foils." },
  { name: "Aluminium Round Bars / Rods", slug: "round-bars-rods", img: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", desc: "Solid extruded and cold-drawn round bars in 6063-T6, 6082-T6, 2014-T6 for CNC components." },
  { name: "Aluminium Square & Flat Bars", slug: "square-flat-bars", img: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80", desc: "Electrical EC busbars, structural brackets, and precision square/flat bars." },
  { name: "Aluminium Pipes & Tubes", slug: "pipes-tubes", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80", desc: "Round tubes, square hollow sections (SHS), and rectangular tubes (RHS) for scaffolding and frames." },
  { name: "Aluminium Angles, Channels & Beams", slug: "angles-channels-beams", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", desc: "Structural equal angles, unequal angles, U-channels, tee sections, and I-beams in alloy 6061 and 6063." },
  { name: "Aluminium Extrusion Profiles", slug: "extrusion-profiles", img: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", desc: "Modular 4040 T-slot profiles, solar panel mounting rails, and architectural window profiles." },
  { name: "Aluminium Wires & Wire Rods", slug: "wires-wire-rods", img: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=800&q=80", desc: "TIG/MIG welding wire spools (ER4043, ER5356) and EC grade continuous cast wire rods." },
  { name: "Aluminium Perforated & Expanded Sheets", slug: "perforated-expanded-sheets", img: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=800&q=80", desc: "Ventilation grilles, acoustic cladding panels, and decorative expanded diamond mesh screens." },
  { name: "Aluminium Ingots & Billets", slug: "ingots-billets", img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80", desc: "Primary aluminium ingots (99.7% purity), foundry ingots ADC12, and 6063 extrusion billets." },
  { name: "Aluminium Scrap", slug: "aluminium-scrap", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", desc: "Sorted industrial scrap including Taint Tabor, Twitch, 6063 Extrusions, and clean wire scrap." },
  { name: "Fasteners & Accessories", slug: "fasteners-accessories", img: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80", desc: "Blind pop rivets, T-nuts, corner angle brackets, and heavy duty architectural butt hinges." }
];

const categoryTemplates = {
  "aluminium-sheets": [
    { name: "Aluminium Sheet 1050-H14 (Pure Commercial)", sku: "ALU-SHT-1050-H14", price: 265, mrp: 295, unit: "kg", stock: 2400, alloy: "1050", temper: "H14", thick: "1.2 mm", w: "1220 mm", l: "2440 mm", finish: "Mill Finish", std: "IS 737 / ASTM B209", weight: "9.65 kg/sheet", apps: ["Flashings", "Food containers", "Reflectors", "General fabrication"], featured: true },
    { name: "Aluminium Sheet 3003-H14 (Manganese Alloy)", sku: "ALU-SHT-3003-H14", price: 275, mrp: 310, unit: "kg", stock: 1800, alloy: "3003", temper: "H14", thick: "2.0 mm", w: "1250 mm", l: "2500 mm", finish: "Mill Finish", std: "ASTM B209", weight: "16.88 kg/sheet", apps: ["Fuel tanks", "Trailer siding", "Roofing panels", "Heat exchangers"], featured: false },
    { name: "Aluminium Sheet 5052-H32 (Marine Grade)", sku: "ALU-SHT-5052-H32", price: 310, mrp: 350, unit: "kg", stock: 1250, alloy: "5052", temper: "H32", thick: "3.0 mm", w: "1500 mm", l: "3000 mm", finish: "Smooth Mill Finish", std: "ASTM B209 / EN 573-3", weight: "36.18 kg/sheet", apps: ["Marine vessels", "Truck cabs", "Pressure vessels", "Electrical enclosures"], featured: true }
  ],
  "aluminium-plates": [
    { name: "Aluminium Plate 6061-T6 (Structural Tooling Plate)", sku: "ALU-PLT-6061-T6", price: 320, mrp: 360, unit: "kg", stock: 3500, alloy: "6061", temper: "T6", thick: "12 mm", w: "1250 mm", l: "2500 mm", finish: "Precision Sawn & Milled", std: "ASTM B209 / AMS 4027", weight: "101.25 kg/plate", apps: ["Jigs and fixtures", "Machine bases", "Aerospace components", "Hydraulic manifolds"], featured: true },
    { name: "Aluminium Plate 5083-H111 (Heavy Marine Plate)", sku: "ALU-PLT-5083-H111", price: 335, mrp: 380, unit: "kg", stock: 950, alloy: "5083", temper: "H111", thick: "25 mm", w: "1500 mm", l: "3000 mm", finish: "Ultrasonic Tested Class A", std: "DNV / Lloyd's / ASTM B209", weight: "300.38 kg/plate", apps: ["Ship hulls", "LNG cryogenic tanks", "Rail wagons", "Defense armor"], featured: false },
    { name: "Aluminium Plate 7075-T651 (Aerospace Hard Alloy)", sku: "ALU-PLT-7075-T651", price: 520, mrp: 590, unit: "kg", stock: 620, alloy: "7075", temper: "T651", thick: "30 mm", w: "1000 mm", l: "2000 mm", finish: "Precision Ground", std: "AMS 4045 / ASTM B209", weight: "168.60 kg/plate", apps: ["Aircraft bulkheads", "Military missile components", "Racing gears", "Mold cores"], featured: true }
  ],
  "aluminium-coils-rolls": [
    { name: "Aluminium Slit Coil 1100 (Roofing & Cladding)", sku: "ALU-COIL-1100-05", price: 260, mrp: 290, unit: "kg", stock: 5000, alloy: "1100", temper: "H14", thick: "0.5 mm", w: "600 mm", l: "Continuous", finish: "Bright Cold Rolled", std: "IS 737", weight: "Coil ID 508mm", apps: ["Pipe jacketing", "Flashings", "Ductwork jacketing"], featured: false },
    { name: "Aluminium Color Coated Coil (PVDF Polycoat)", sku: "ALU-COIL-PVDF-3003", price: 340, mrp: 385, unit: "kg", stock: 3200, alloy: "3003", temper: "H16", thick: "0.7 mm", w: "1220 mm", l: "Continuous Roll", finish: "PVDF Metallic Silver", std: "AAMA 2605", weight: "1.89 kg/m2", apps: ["ACP panels", "Architectural facades", "Modern roofing"], featured: true },
    { name: "Aluminium Transformer Winding Strip Coil", sku: "ALU-COIL-EC-STRIP", price: 285, mrp: 320, unit: "kg", stock: 4200, alloy: "1070 EC", temper: "O / Annealed", thick: "1.5 mm", w: "250 mm", l: "Coil", finish: "Deburred Round Edge", std: "IEC 60317", weight: "61.8% IACS", apps: ["Power transformers", "Distribution reactors", "Welding transformers"], featured: false }
  ],
  "chequered-diamond-plates": [
    { name: "Aluminium 5-Bar Chequered Tread Plate", sku: "ALU-CHQ-5BAR-5052", price: 295, mrp: 330, unit: "kg", stock: 2200, alloy: "5052", temper: "H32", thick: "3.0 mm base", w: "1220 mm", l: "2440 mm", finish: "Bright 5-Bar Embossed", std: "ASTM B632 / IS 737", weight: "25.8 kg/sheet", apps: ["Truck footrests", "Fire engine walkaways", "Elevator floors", "Ramps"], featured: true },
    { name: "Aluminium Diamond Tread Plate 3003", sku: "ALU-CHQ-DIAMOND-3003", price: 305, mrp: 345, unit: "kg", stock: 1400, alloy: "3003", temper: "H22", thick: "2.0 mm", w: "1250 mm", l: "2500 mm", finish: "Polished Mirror Diamond", std: "ASTM B632", weight: "18.2 kg/sheet", apps: ["Toolbox lining", "Gym walls", "Vehicle panels", "Kickplates"], featured: false },
    { name: "Heavy Duty Chequered Plate 6061-T6", sku: "ALU-CHQ-6061-6MM", price: 345, mrp: 390, unit: "kg", stock: 850, alloy: "6061", temper: "T6", thick: "6.0 mm", w: "1250 mm", l: "2500 mm", finish: "Industrial Mill Chequered", std: "ASTM B632", weight: "54.5 kg/sheet", apps: ["Heavy machinery platforms", "Port gangways", "Offshore rig walkways"], featured: false }
  ],
  "aluminium-foils": [
    { name: "Aluminium Blister Packaging Foil (Pharma 8011)", sku: "ALU-FOIL-8011-PHARMA", price: 360, mrp: 410, unit: "kg", stock: 2800, alloy: "8011", temper: "H18", thick: "0.025 mm (25 Micron)", w: "210 mm", l: "1000m Reel", finish: "Primer & HSL Coated", std: "US FDA / USP", weight: "68 g/m2", apps: ["Capsule & tablet packaging", "Sterile pharmaceutical barrier"], featured: true },
    { name: "Industrial HVAC Fin Stock Foil 1100", sku: "ALU-FOIL-HVAC-1100", price: 320, mrp: 360, unit: "kg", stock: 3100, alloy: "1100", temper: "H22", thick: "0.095 mm (95 Micron)", w: "350 mm", l: "Reel", finish: "Hydrophilic Blue Coating", std: "ASTM B479", weight: "0.26 kg/m2", apps: ["Chiller coils", "Automotive radiators", "Split AC evaporators"], featured: false },
    { name: "Aluminium Heavy Container Foil 3003", sku: "ALU-FOIL-CONT-3003", price: 290, mrp: 330, unit: "kg", stock: 2600, alloy: "3003", temper: "H24", thick: "0.065 mm (65 Micron)", w: "450 mm", l: "Jumbo Coil", finish: "Food Grade DOS Coated", std: "ISO 9001 / FSSAI", weight: "Custom", apps: ["Food trays", "Baking pans", "Airline meal containers"], featured: false }
  ],
  "round-bars-rods": [
    { name: "Aluminium Round Bar 6082-T6 (Structural Machining)", sku: "ALU-ROD-6082-T6", price: 285, mrp: 320, unit: "kg", stock: 4500, alloy: "6082", temper: "T6", thick: "50 mm Dia", w: "50 mm", l: "3000 mm / 3 Metres", finish: "Cold Drawn & Centreless Ground", std: "IS 733 / BS EN 755-3", weight: "5.30 kg/m", apps: ["Suspension components", "Cylinder rods", "Threaded rods", "Couplings"], featured: true },
    { name: "Aluminium Round Bar 6063-T6 (Architectural)", sku: "ALU-ROD-6063-T6", price: 265, mrp: 295, unit: "kg", stock: 3800, alloy: "6063", temper: "T6", thick: "25 mm Dia", w: "25 mm", l: "3650 mm", finish: "Anodizing Quality Mill", std: "ASTM B221", weight: "1.32 kg/m", apps: ["Balustrades", "Door handles", "Lighting armatures", "Display racks"], featured: false },
    { name: "Aluminium Round Bar 2014-T6 (Duralumin High Duty)", sku: "ALU-ROD-2014-T6", price: 430, mrp: 490, unit: "kg", stock: 1100, alloy: "2014", temper: "T6", thick: "75 mm Dia", w: "75 mm", l: "2000 mm", finish: "Turned & Polished", std: "AMS 4121 / IS 733", weight: "12.37 kg/m", apps: ["Aircraft landing gears", "Defense ordnance shells", "Drive shafts"], featured: false }
  ],
  "square-flat-bars": [
    { name: "Aluminium Busbar Flat Bar 6101-T6 (Electrical EC)", sku: "ALU-FLT-6101-50X10", price: 280, mrp: 315, unit: "kg", stock: 3100, alloy: "6101", temper: "T6", thick: "10 mm", w: "50 mm", l: "4000 mm", finish: "Full Radiused Corner Mill", std: "IS 5082 / IEC 60105", weight: "1.35 kg/m (57% IACS)", apps: ["LT/HT switchgear panels", "Substation bus ducts", "Electrolysis plants"], featured: true },
    { name: "Aluminium Square Bar 6061-T6 (25mm x 25mm)", sku: "ALU-SQR-6061-25", price: 310, mrp: 350, unit: "kg", stock: 1950, alloy: "6061", temper: "T6", thick: "25 mm", w: "25 mm", l: "3650 mm", finish: "Sharp Edge Extruded", std: "ASTM B221", weight: "1.69 kg/m", apps: ["Linear motion supports", "Precision fixtures", "Automated robotic cells"], featured: false },
    { name: "Aluminium Flat Bar 6063-T6 (100mm x 6mm)", sku: "ALU-FLT-6063-100X6", price: 275, mrp: 305, unit: "kg", stock: 2200, alloy: "6063", temper: "T6", thick: "6 mm", w: "100 mm", l: "3650 mm", finish: "Clean Extruded", std: "IS 1285", weight: "1.62 kg/m", apps: ["Architectural fascias", "Cladding battens", "Solar clamp plates"], featured: false }
  ],
  "pipes-tubes": [
    { name: "Aluminium Round Pipe 6063-T6 (50mm OD x 2mm Wall)", sku: "ALU-TUBE-RND-50X2", price: 285, mrp: 325, unit: "kg", stock: 3400, alloy: "6063", temper: "T6", thick: "2.0 mm wall", w: "50 mm Outer Dia", l: "6000 mm / 6 Metres", finish: "Bright Extruded / Mill", std: "ASTM B241 / IS 1285", weight: "0.814 kg/m", apps: ["Staircase handrails", "Irrigation pipe", "Tent poles", "Furniture frames"], featured: true },
    { name: "Aluminium Square Hollow Section 50x50x3mm (SHS)", sku: "ALU-TUBE-SHS-50X50", price: 295, mrp: 335, unit: "kg", stock: 2900, alloy: "6063", temper: "T6", thick: "3.0 mm wall", w: "50 mm x 50 mm", l: "6000 mm / 6 Metres", finish: "Smooth Anodizable Finish", std: "BS EN 755-9", weight: "1.52 kg/m", apps: ["Glass partition walls", "Cleanroom structures", "Solar racking", "Pergolas"], featured: true },
    { name: "Aluminium Rectangular Tube 100x50x3mm (RHS)", sku: "ALU-TUBE-RHS-100X50", price: 300, mrp: 340, unit: "kg", stock: 1800, alloy: "6061", temper: "T6", thick: "3.0 mm", w: "100 mm x 50 mm", l: "6000 mm", finish: "Mill Finish", std: "ASTM B221", weight: "2.33 kg/m", apps: ["Facade subframes", "Industrial trailers", "Overhead gantry beams"], featured: false }
  ],
  "angles-channels-beams": [
    { name: "Aluminium Equal Angle 50x50x5mm (L-Section)", sku: "ALU-ANG-EQ-50X50", price: 275, mrp: 310, unit: "kg", stock: 2800, alloy: "6063", temper: "T6", thick: "5.0 mm", w: "50 mm x 50 mm", l: "6000 mm", finish: "Mill Finish", std: "IS 3954 / ASTM B308", weight: "1.28 kg/m", apps: ["Cable tray supports", "Step edging", "Structural trusses", "Equipment skids"], featured: false },
    { name: "Aluminium U-Channel 75x38x4mm", sku: "ALU-CHN-75X38", price: 285, mrp: 325, unit: "kg", stock: 2100, alloy: "6063", temper: "T6", thick: "4.0 mm", w: "75 mm web x 38 mm flange", l: "6000 mm", finish: "Clean Extruded", std: "IS 3954", weight: "1.54 kg/m", apps: ["Glass balustrade base channel", "Conveyor bed side rails", "Sliding door guides"], featured: true },
    { name: "Aluminium Structural I-Beam 100x50mm", sku: "ALU-BEAM-I-100X50", price: 330, mrp: 375, unit: "kg", stock: 1200, alloy: "6061", temper: "T6", thick: "5.5 mm web / 7 mm flange", w: "100 mm depth x 50 mm flange", l: "6000 mm", finish: "Heavy Duty Mill", std: "ASTM B308", weight: "3.75 kg/m", apps: ["Bridge decking joists", "Overhead crane tracks", "Cleanroom mezzanine floors"], featured: false }
  ],
  "extrusion-profiles": [
    { name: "Industrial 4040 T-Slot Modular Profile (Silver Anodized)", sku: "ALU-EXT-TSLOT-4040", price: 850, mrp: 990, unit: "piece", stock: 450, alloy: "6063", temper: "T5/T6", thick: "Slot width 8.2 mm", w: "40 mm x 40 mm", l: "3000 mm", finish: "Natural Anodized 15 Micron", std: "DIN EN 12020-2", weight: "1.75 kg/m (5.25 kg/pc)", apps: ["CNC machine frames", "3D printer chassis", "Workstations", "Robot enclosures"], featured: true },
    { name: "Solar Panel Mounting Rail Profile (4200mm)", sku: "ALU-EXT-SOLAR-RAIL", price: 780, mrp: 920, unit: "piece", stock: 900, alloy: "6063", temper: "T6", thick: "1.6 mm nominal", w: "28 mm x 50 mm", l: "4200 mm", finish: "Anodized 12-15 Micron", std: "MNRE / IEC Standards", weight: "0.85 kg/m (3.57 kg/pc)", apps: ["Rooftop solar PV arrays", "Tin shed solar mounting", "Solar carports"], featured: true },
    { name: "Slimline 2-Track Sliding Window Frame Profile", sku: "ALU-EXT-WIN-2TRK", price: 1150, mrp: 1350, unit: "piece", stock: 350, alloy: "6063", temper: "T6", thick: "1.4 mm wall", w: "60 mm depth", l: "4500 mm", finish: "Champagne Anodized / Powder Coated", std: "IS 1948", weight: "1.12 kg/m", apps: ["Residential windows", "Commercial sliding doors", "Balcony glazing"], featured: false }
  ],
  "wires-wire-rods": [
    { name: "Aluminium MIG Welding Wire Spool ER4043 (Al-Si 5%)", sku: "ALU-WIRE-MIG-4043-7KG", price: 2450, mrp: 2850, unit: "piece", stock: 140, alloy: "ER4043 (AlSi5)", temper: "Spring Temper", thick: "1.2 mm Dia", w: "D300 Plastic Spool", l: "Continuous (7 kg)", finish: "Shaved Chemically Cleaned", std: "AWS A5.10 / ASME SFA-5.10", weight: "7.0 kg net spool", apps: ["Automotive repair", "Bicycle frame welding", "Aluminium tank fabrication"], featured: true },
    { name: "Aluminium TIG Welding Rods ER5356 (Al-Mg 5%)", sku: "ALU-WIRE-TIG-5356-5KG", price: 1850, mrp: 2150, unit: "bundle", stock: 90, alloy: "ER5356 (AlMg5)", temper: "Straight Cut", thick: "2.4 mm Dia", w: "N/A", l: "1000 mm / 1 Metre Rods", finish: "Embossed Alloy Stamped", std: "AWS A5.10", weight: "5.0 kg Pack (approx. 400 rods)", apps: ["Marine vessel fabrication", "5083 plate welding", "Pressure pipe joints"], featured: false },
    { name: "Aluminium EC Continuous Cast Wire Rod (9.5mm)", sku: "ALU-ROD-EC-95", price: 245, mrp: 275, unit: "kg", stock: 8000, alloy: "EC 1350", temper: "H12 / As Cast", thick: "9.5 mm Dia", w: "Coil", l: "Jumbo Coil", finish: "Smooth Drawing Finish", std: "IS 5484 / ASTM B233", weight: "Coils 1.5 - 2.5 Tonnes", apps: ["Overhead transmission conductors", "Building wire cables", "Earthing strips"], featured: false }
  ],
  "perforated-expanded-sheets": [
    { name: "Aluminium Perforated Sheet (5mm Staggered Round)", sku: "ALU-PERF-5MM-RND", price: 360, mrp: 410, unit: "kg", stock: 850, alloy: "3003", temper: "H14", thick: "1.5 mm", w: "1220 mm", l: "2440 mm", finish: "Deburred Mill Finish", std: "DIN 24041", weight: "7.25 kg/sheet", apps: ["Speaker grilles", "Acoustic ceiling baffles", "Generator canopy louvers"], featured: true },
    { name: "Aluminium Expanded Metal Mesh (Diamond 25x50)", sku: "ALU-EXP-MESH-25X50", price: 380, mrp: 430, unit: "kg", stock: 620, alloy: "1050", temper: "Half Hard", thick: "2.0 mm strand", w: "1200 mm", l: "2400 mm", finish: "Natural Raised Mesh", std: "ASTM F1267", weight: "4.8 kg/sheet", apps: ["Security window grills", "Architectural building skin", "Filter elements"], featured: false },
    { name: "Architectural Hexagonal Perforated Cladding Panel", sku: "ALU-PERF-HEX-5052", price: 440, mrp: 510, unit: "kg", stock: 450, alloy: "5052", temper: "H32", thick: "2.5 mm", w: "1250 mm", l: "3000 mm", finish: "Anodizing Ready Class 1", std: "Custom Architectural Spec", weight: "14.2 kg/sheet", apps: ["Ventilated facades", "Shopping mall interiors", "Showroom feature walls"], featured: false }
  ],
  "ingots-billets": [
    { name: "Primary Aluminium Ingot 99.7% Purity (EC/P1020)", sku: "ALU-INGOT-P1020", price: 235, mrp: 260, unit: "kg", stock: 15000, alloy: "P1020A (99.7%)", temper: "As Cast", thick: "Standard Ingot", w: "180 mm", l: "750 mm", finish: "Cast Smelter Bar", std: "LME Registered / IS 2590", weight: "20 - 22.5 kg/ingot", apps: ["Die casting alloying", "Wire rod continuous casting", "Deoxidizer in steel mills"], featured: true },
    { name: "Aluminium Extrusion Billet 6063 (Homogenized Log)", sku: "ALU-BILLET-6063-7IN", price: 248, mrp: 275, unit: "kg", stock: 12000, alloy: "6063", temper: "Homogenized", thick: "7 Inch (178 mm) Dia", w: "178 mm Dia", l: "5800 mm Log", finish: "DC Cast Surface", std: "ASTM B221 / EN 755-1", weight: "Approx. 390 kg/log", apps: ["Extrusion press feedstock", "Forging billets"], featured: false },
    { name: "Aluminium Foundry Ingot ADC12 (Pressure Die Casting)", sku: "ALU-INGOT-ADC12", price: 220, mrp: 245, unit: "kg", stock: 9000, alloy: "ADC12", temper: "Cast Ingot", thick: "Trapezoidal Ingot", w: "120 mm", l: "600 mm", finish: "Continuous Ingot Bar", std: "JIS H 2118 / IS 617", weight: "Approx. 6 - 8 kg/bar", apps: ["Engine covers", "Gearbox housings", "Power tool casings"], featured: false }
  ],
  "aluminium-scrap": [
    { name: "Clean Aluminium Wire Scrap (Barley / Berry Grade)", sku: "ALU-SCRAP-WIRE-CLEAN", price: 195, mrp: 215, unit: "kg", stock: 8500, alloy: "99.5% EC Grade", temper: "Scrap Form", thick: "Chopped / Baler Bundled", w: "N/A", l: "Compressed Bales", finish: "Clean Bright Wire", std: "ISRI Code: BARLEY", weight: "350 kg/bale", apps: ["Secondary smelters", "Remelt foundries", "Ferro-alloy deoxidation"], featured: true },
    { name: "Clean 6063 Extrusion Scrap (ISRI Tata / Toto)", sku: "ALU-SCRAP-6063-TATA", price: 188, mrp: 205, unit: "kg", stock: 11000, alloy: "6063 Offcuts", temper: "Scrap", thick: "Cut-offs 100mm - 500mm", w: "Various", l: "Loose / Baled", finish: "Mill Finish Offcuts", std: "ISRI Code: TATA", weight: "Loose or baled", apps: ["Billet extrusion remelt casting", "Secondary alloy production"], featured: false },
    { name: "Aluminium Sheet / Utensil Scrap (Taint Tabor)", sku: "ALU-SCRAP-TAINT-TABOR", price: 172, mrp: 190, unit: "kg", stock: 9500, alloy: "Mixed 1xxx/3xxx", temper: "Scrap", thick: "Sheet Scrap", w: "Baled", l: "Baled", finish: "Sorted Old Sheet", std: "ISRI Code: TABOR", weight: "400kg Bales", apps: ["Utensil circles casting", "Commercial ingot manufacturing"], featured: false }
  ],
  "fasteners-accessories": [
    { name: "Aluminium Blind Pop Rivets (4mm x 12mm, Pack of 1000)", sku: "ALU-ACC-RIVET-4X12", price: 650, mrp: 799, unit: "piece", stock: 250, alloy: "Al-Mg 2.5%", temper: "Annealed Body", thick: "Grip 6-8 mm", w: "4.0 mm Body Dia", l: "12 mm Body Length", finish: "Bright Clean Polish", std: "DIN 7337 / ISO 15977", weight: "1.4 kg / 1000 pcs", apps: ["Sheet metal ducting", "Trailer body panels", "Signage assemblies"], featured: true },
    { name: "4040 T-Slot Corner Angle Bracket Kit (Pack of 10)", sku: "ALU-ACC-BRKT-4040", price: 490, mrp: 620, unit: "piece", stock: 320, alloy: "ADC12 Cast", temper: "Cast", thick: "6 mm rib thickness", w: "35 mm x 35 mm x 40 mm", l: "40 mm", finish: "Shot blasted silver", std: "Modular Profile Standard", weight: "0.85 kg / 10 pcs", apps: ["4040 T-slot assembly", "Rigid joint reinforcement"], featured: false },
    { name: "Heavy Duty Architectural Aluminium Butt Hinge (4 Inch)", sku: "ALU-ACC-HINGE-4IN", price: 320, mrp: 395, unit: "piece", stock: 500, alloy: "6063-T6", temper: "T6", thick: "3.5 mm leaf thickness", w: "75 mm open", l: "100 mm (4 Inch)", finish: "Satin Anodized Silver", std: "EN 1935 Grade 11", weight: "0.22 kg/hinge", apps: ["Commercial aluminium doors", "Heavy casement windows"], featured: false }
  ]
};

const fullProducts = [];

rawCategories.forEach((cat, idx) => {
  const items = categoryTemplates[cat.slug] || [];
  items.forEach((item, itemIdx) => {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    fullProducts.push({
      name: item.name,
      slug: slug,
      sku: item.sku,
      categorySlug: cat.slug,
      description: `Industrial high-performance ${item.name} precision engineered for reliability, tight dimensional tolerances, and high structural integrity. Tested and certified to international material standards.`,
      images: [cat.img],
      price: item.price,
      mrp: item.mrp,
      unit: item.unit,
      stock: item.stock,
      specs: {
        alloyGrade: item.alloy,
        temper: item.temper,
        thickness: item.thick,
        width: item.w,
        length: item.l,
        finish: item.finish,
        standard: item.std,
        weight: item.weight
      },
      applications: item.apps,
      tags: ["Aluminium", item.alloy, cat.name.split(" ")[1] || "Material"],
      isFeatured: item.featured,
      rating: 4.8,
      numReviews: 12 + ((idx * 3 + itemIdx) % 25)
    });
  });
});

const seedOutput = {
  categories: rawCategories.map((c, i) => ({
    name: c.name,
    slug: c.slug,
    image: c.img,
    description: c.desc,
    displayOrder: i + 1
  })),
  products: fullProducts
};

fs.writeFileSync(path.join(__dirname, "seedData.json"), JSON.stringify(seedOutput, null, 2));
console.log(`[Generated] seedData.json created with ${seedOutput.categories.length} categories and ${seedOutput.products.length} products.`);
