/**
 * Global Site & Business Configuration
 * Centralized place to change brand name, owner, contact details, and business settings.
 */
module.exports = {
  brand: {
    name: process.env.BRAND_NAME || "Karanwal Aluminium Traders",
    tagline: "Industrial Grade Aluminium Raw Materials & Custom Extrusions",
    shortName: "Karanwal Aluminium",
    legalName: "Karanwal Aluminium Traders",
    cataloguePdfUrl: "https://drive.google.com/file/d/1xX7VKzsl4cxs9f7QtUDbiUSQMg2_j5Uv/view?usp=sharing",
  },
  owner: {
    name: "Shubh Karanwal",
    designation: "Founder & Managing Director",
  },
  contact: {
    address: {
      line1: "D-5, Sarvodaya Colony",
      locality: "Saket",
      city: "Meerut",
      pincode: "250001",
      state: "Uttar Pradesh",
      country: "India",
      full: "D-5, Sarvodaya Colony, Saket, Meerut - 250001, Uttar Pradesh, India"
    },
    phones: ["+91 63952 49800", "+91 63952 49800"],
    primaryPhone: "+91 63952 49800",
    whatsapp: "+91 63952 49800",
    emails: ["sales@karanwaltraders.com", "quotes@karanwaltraders.com", "info@karanwaltraders.com"],
    primaryEmail: "sales@karanwaltraders.com",
    gstin: "09AAACH7492K1Z8",
    coordinates: {
      lat: 28.9845,
      lng: 77.7064,
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13962.339230557404!2d77.7011985926573!3d28.98453443217734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6443c16285ad%3A0x6b7fa940e4e6f424!2sSaket%2C%20Meerut%2C%20Uttar%20Pradesh%20250001!5e0!3m2!1sen!2sin!4v1711234567890!5m2!1sen!2sin"
    }
  },
  business: {
    currency: "INR",
    currencySymbol: "₹",
    gstRate: 0.18, // 18% standard GST on aluminium materials
    minOrderValue: 2000,
    freeDeliveryThreshold: 25000,
    standardShippingFee: 750,
    serviceLocations: ["Meerut", "Ghaziabad", "Noida", "Delhi NCR", "Muzaffarnagar", "Pan-India Logistics"],
  }
};
