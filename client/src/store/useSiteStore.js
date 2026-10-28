import { create } from "zustand";
import { siteAPI } from "../services/api";

export const useSiteStore = create((set) => ({
  brand: {
    name: "Karanwal Aluminium Traders",
    shortName: "Karanwal Aluminium",
    tagline: "Industrial Grade Aluminium Raw Materials & Custom Extrusions",
    legalName: "Karanwal Aluminium Traders"
  },
  owner: {
    name: "Shubh Karanwal",
    designation: "Founder & Managing Director"
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
    primaryPhone: "+91 98970 12345",
    whatsapp: "+91 98970 12345",
    primaryEmail: "sales@karanwaltraders.com",
    gstin: "09AAACH7492K1Z8",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13962.339230557404!2d77.7011985926573!3d28.98453443217734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6443c16285ad%3A0x6b7fa940e4e6f424!2sSaket%2C%20Meerut%2C%20Uttar%20Pradesh%20250001!5e0!3m2!1sen!2sin!4v1711234567890!5m2!1sen!2sin"
  },
  business: {
    currency: "INR",
    currencySymbol: "₹",
    gstRate: 0.18,
    freeDeliveryThreshold: 25000,
    standardShippingFee: 750
  },
  // Modal states
  isQuoteModalOpen: false,
  quoteModalProduct: null,
  openQuoteModal: (product = null) => set({ isQuoteModalOpen: true, quoteModalProduct: product }),
  closeQuoteModal: () => set({ isQuoteModalOpen: false, quoteModalProduct: null }),

  fetchSiteConfig: async () => {
    try {
      const res = await siteAPI.getConfig();
      if (res.data.success) {
        set({
          brand: res.data.brand,
          owner: res.data.owner,
          contact: res.data.contact,
          business: res.data.business
        });
      }
    } catch (e) {
      // Use defaults if backend offline
    }
  }
}));
