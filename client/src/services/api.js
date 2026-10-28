import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Authorization token from localStorage if present as fallback
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("aluex_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  logout: () => API.get("/auth/logout"),
  getMe: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/auth/profile", data),
  addAddress: (data) => API.post("/auth/addresses", data),
  deleteAddress: (id) => API.delete(`/auth/addresses/${id}`),
  toggleWishlist: (productId) => API.post(`/auth/wishlist/${productId}`)
};

export const productAPI = {
  getProducts: (params) => API.get("/products", { params }),
  getFeatured: () => API.get("/products/featured"),
  getFilters: () => API.get("/products/filters"),
  getProduct: (identifier) => API.get(`/products/${identifier}`),
  createProduct: (data) => API.post("/products", data),
  updateProduct: (id, data) => API.put(`/products/id/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/id/${id}`),
  bulkImport: (formData) => API.post("/products/bulk-import", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  downloadSampleUrl: "/api/products/sample-template"
};

export const categoryAPI = {
  getCategories: () => API.get("/categories"),
  getCategory: (slug) => API.get(`/categories/${slug}`),
  createCategory: (data) => API.post("/categories", data),
  updateCategory: (id, data) => API.put(`/categories/id/${id}`, data),
  deleteCategory: (id) => API.delete(`/categories/id/${id}`)
};

export const orderAPI = {
  createOrder: (data) => API.post("/orders", data),
  getMyOrders: () => API.get("/orders/my"),
  getOrder: (id) => API.get(`/orders/${id}`),
  getAllOrders: (params) => API.get("/orders", { params }),
  updateOrderStatus: (id, data) => API.put(`/orders/${id}/status`, data)
};

export const quoteAPI = {
  createQuote: (data) => API.post("/quotes", data),
  getAllQuotes: (params) => API.get("/quotes", { params }),
  updateQuoteStatus: (id, data) => API.put(`/quotes/${id}/status`, data)
};

export const adminAPI = {
  getDashboardStats: () => API.get("/admin/dashboard"),
  getAllUsers: () => API.get("/admin/users"),
  uploadImage: (formData) => API.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
};

export const siteAPI = {
  getConfig: () => API.get("/site-config")
};

export default API;
