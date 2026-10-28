# Karanwal Aluminium Traders — B2B/B2C E-Commerce Platform

A production-grade, full-stack MERN prototype for **Karanwal Aluminium Traders**, a specialized industrial aluminium materials supplier based in Saket, Meerut, Uttar Pradesh.

---

## 🏢 Business Overview

- **Brand Name**: Karanwal Aluminium Traders
- **Founder & Managing Director**: Shubh Karanwal
- **Corporate Office & Yard**: D-5, Sarvodaya Colony, Saket, Meerut - 250001, Uttar Pradesh, India
- **Core Industry**: Stockist and distributor of commercial & industrial aluminium raw materials (sheets, plates, coils, rods, tubes, angles, structural profiles, and custom extrusions)
- **Currency**: Indian Rupee (INR ₹), with prices quoted per kg / piece / metre as applicable
- **Taxation**: 18% Statutory GST on aluminium materials, calculated separately at checkout with input tax credit (ITC) invoicing
- **GSTIN**: `09AAACH7492K1Z8`
- **Contact**: +91 98970 12345 | `sales@karanwaltraders.com`

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + Custom Metallic Glassmorphism System
- **Typography**: Google Fonts (*DM Serif Display* + *Plus Jakarta Sans* + *Space Grotesk*)
- **Smooth Scrolling**: Lenis (`@studio-freight/lenis`)
- **State Management**: Zustand (Cart with persistence, Auth, Site Config)
- **Icons**: Lucide React
- **HTTP Client**: Axios with credentials and bearer token support

### Backend
- **Runtime & Framework**: Node.js v24 + Express.js (MVC Architecture)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) in HTTP-only cookies + Authorization header support, bcryptjs password hashing
- **File Handling**: Multer for image uploads and bulk CSV/Excel parsing (`csv-parser`, `xlsx`)
- **Security & Middlewares**: Helmet, CORS, Express-Rate-Limit, Cookie-Parser, Morgan

---

## ✨ Design System & Aesthetic Highlights

- **Palette**: **Warm White** theme (`#FAF7F2` canvas, `#FFFFFF` cards, `#F3EDE4` soft beige sections)
- **Accents**: Warm metallic bronze (`#C08457`, `#9D643A`) with deep charcoal text (`#2B2623`) and subtle aluminium-silver (`#C9CCD1`) highlights
- **Smooth Scrolling**: Lenis inertial smooth scrolling enabled site-wide
- **Micro-Interactions**: Hover scale zoom on product photography, animated cart drawer sliding in with blurred backdrop, interactive alloy comparison modal, real-time quantity calculations

---

## 📦 15 Industrial Categories (45+ Realistic Seed Products)

1. **Aluminium Sheets** (1050-H14, 3003-H14, 5052-H32)
2. **Aluminium Plates** (6061-T6 tooling plate, 5083-H111 marine plate, 7075-T651 aerospace plate)
3. **Aluminium Coils & Rolls** (1100 slit coil, PVDF color-coated coil, EC transformer strip)
4. **Aluminium Chequered / Diamond Plates** (5-bar anti-slip, diamond tread, 6061-T6 floor plate)
5. **Aluminium Foils** (8011 pharma blister foil, HVAC fin stock, 3003 container foil)
6. **Aluminium Round Bars / Rods** (6082-T6 CNC rod, 6063-T6 architectural, 2014-T6 duralumin)
7. **Aluminium Square & Flat Bars** (6101-T6 electrical EC busbar, 6061 square, 6063 flat)
8. **Aluminium Pipes & Tubes** (6063 round pipe, 50x50 SHS square hollow, 100x50 RHS rectangular)
9. **Aluminium Angles, Channels & Beams** (50x50 equal angle, 75x38 U-channel, 100x50 structural I-beam)
10. **Aluminium Extrusion Profiles** (4040 T-slot modular profile, solar PV rail, sliding window frame)
11. **Aluminium Wires & Wire Rods** (ER4043 MIG wire spool, ER5356 TIG rods, 9.5mm EC wire rod)
12. **Aluminium Perforated & Expanded Sheets** (5mm round hole, 25x50 expanded diamond mesh, hex cladding panel)
13. **Aluminium Ingots & Billets** (P1020 99.7% pure ingot, 6063 extrusion log, ADC12 foundry ingot)
14. **Aluminium Scrap** (ISRI Barley clean wire scrap, ISRI Tata 6063 extrusion scrap, Taint Tabor sheet scrap)
15. **Fasteners & Accessories** (4x12 blind pop rivets, 4040 T-slot corner brackets, 4-inch heavy duty butt hinges)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Seed Database
Populates 15 categories, 45+ products, admin user, test customer, and sample orders:
```bash
npm run seed
```

### 4. Run Development Servers
Runs both Express backend (Port 5000) and Vite frontend (Port 5173 / 5174) concurrently:
```bash
npm run dev
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Quick Login Feature |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@alutrade.com` | `Admin@123` | Click **"Admin Demo"** in Auth Modal |
| **Customer** | `customer@alutrade.com` | `Customer@123` | Click **"Customer Demo"** in Auth Modal |

---

## 🖥️ Pages & Application Routes

### Customer Portal
- `/` — Homepage with parallax hero, 15 category grid, featured stock, alloy metallurgy highlight, customer testimonials, and Saket Meerut address/map.
- `/shop` — Listing page with multi-facet filters (Category, Alloy Grade, Temper, Finish, Ready-Stock, Price Range), debounced search, sorting, and pagination.
- `/product/:slug` — Product Detail page with image gallery zoom, comprehensive specification table (Grade, Temper, Thickness, Width, Length, Standard, Weight), live subtotal calculator, add-to-cart, and bulk quote trigger.
- `/cart` — Material requisition drawer + full page cart with 18% GST breakdown and free freight progress bar.
- `/checkout` — Shipping destination form with B2B GSTIN input, COD/UPI/Bank Transfer modes, and order placement.
- `/order-success/:id` — Confirmation invoice receipt with reference code (e.g. `ALU-2026-01001`) and printable receipt.
- `/orders` — Order history and status tracking (Placed &rarr; Processing &rarr; Shipped &rarr; Delivered).
- `/wishlist` — Saved materials list with 1-click move to requisition.
- `/quote` — Dedicated enterprise wholesale quotation form (stored in DB).
- `/about` — Founder Shubh Karanwal's vision, Saket Meerut yard infrastructure, and cutting facility.
- `/contact` — Contact form, phone, WhatsApp link, and embedded Google Maps for Meerut.

### Admin Dashboard (`/admin`)
- **Dashboard Overview**: Total Sales (₹), 18% GST collected, total orders, live products, low-stock alerts (&le; 20 units).
- **Product CRUD**: Add, edit, and delete products with technical specs.
- **Bulk CSV / Excel Import**: Download pre-formatted CSV template and upload bulk catalogues matching by SKU.
- **Order Management**: Update status (Placed &rarr; Processing &rarr; Shipped &rarr; Delivered &rarr; Cancelled) and attach tracking IDs.
- **Quote Inquiries (RFQ)**: Manage customer bulk quote leads with review stages (New, Under Review, Quotation Sent, Closed).
- **User Directory**: View registered enterprise accounts and roles.

---

## 🔮 Production Roadmap

1. **Payment Gateway**: Integrate live Razorpay / Cashfree API with automated webhook signatures.
2. **Cloud Storage**: Switch `/uploads` to AWS S3 or Cloudinary for image hosting.
3. **Automated WhatsApp Notifications**: Integrate Twilio / Gupshup for dispatch status alerts to customers.
4. **ERP / Tally Integration**: Export GST invoices directly into Tally Prime XML/JSON format.

---

&copy; 2026 Karanwal Aluminium Traders. Founder: Shubh Karanwal. Saket, Meerut, Uttar Pradesh, India.
