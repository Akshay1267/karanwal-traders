import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  FolderTree,
  ShoppingBag,
  MessageSquare,
  Users,
  AlertTriangle,
  ExternalLink,
  X
} from "lucide-react";
import AdminOverview from "../components/admin/AdminOverview";
import AdminProducts from "../components/admin/AdminProducts";
import AdminBulkImport from "../components/admin/AdminBulkImport";
import AdminOrders from "../components/admin/AdminOrders";
import AdminQuotes from "../components/admin/AdminQuotes";
import { adminAPI, productAPI, categoryAPI, orderAPI, quoteAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { useSiteStore } from "../store/useSiteStore";

export default function AdminDashboardPage() {
  const { user, openAuthModal } = useAuthStore();
  const { brand } = useSiteStore();

  const [activeTab, setActiveTab] = useState("overview");
  const [statsData, setStatsData] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [users, setUsers] = useState([]);

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: 320,
    mrp: 375,
    unit: "kg",
    stock: 100,
    description: "",
    alloyGrade: "6061",
    temper: "T6",
    thickness: "3.0 mm",
    width: "1250 mm",
    length: "2500 mm",
    finish: "Mill Finish",
    standard: "ASTM B209",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
  });

  const loadAll = async () => {
    try {
      const [statsRes, prodRes, catRes, ordRes, quoteRes, userRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        productAPI.getProducts({ limit: 100 }),
        categoryAPI.getCategories(),
        orderAPI.getAllOrders({ limit: 50 }),
        quoteAPI.getAllQuotes(),
        adminAPI.getAllUsers()
      ]);

      if (statsRes.data.success) setStatsData(statsRes.data);
      if (prodRes.data.success) setProducts(prodRes.data.products);
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (ordRes.data.success) setOrders(ordRes.data.orders);
      if (quoteRes.data.success) setQuotes(quoteRes.data.quotes);
      if (userRes.data.success) setUsers(userRes.data.users);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadAll();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#2B2623]">Admin Privileges Required</h2>
        <p className="text-xs text-gray-500">
          This dashboard is reserved for administrator management. Please sign in as admin.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 rounded-full bg-[#2B2623] text-white text-xs font-semibold cursor-pointer"
        >
          Sign In (Use Admin Demo)
        </button>
      </div>
    );
  }

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      sku: `ALU-${Date.now().toString().slice(-6)}`,
      category: categories[0]?._id || "",
      price: 320,
      mrp: 375,
      unit: "kg",
      stock: 100,
      description: "",
      alloyGrade: "6061",
      temper: "T6",
      thickness: "3.0 mm",
      width: "1250 mm",
      length: "2500 mm",
      finish: "Mill Finish",
      standard: "ASTM B209",
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProductId(p._id);
    setProductForm({
      name: p.name,
      sku: p.sku,
      category: p.category?._id || p.category,
      price: p.price,
      mrp: p.mrp || Math.round(p.price * 1.15),
      unit: p.unit,
      stock: p.stock,
      description: p.description,
      alloyGrade: p.specs?.alloyGrade || "6061",
      temper: p.specs?.temper || "T6",
      thickness: p.specs?.thickness || "N/A",
      width: p.specs?.width || "N/A",
      length: p.specs?.length || "N/A",
      finish: p.specs?.finish || "Mill Finish",
      standard: p.specs?.standard || "ASTM B209",
      imageUrl: p.images?.[0] || ""
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this material specification from live inventory?")) {
      try {
        await productAPI.deleteProduct(id);
        loadAll();
      } catch (e) {
        alert("Failed to delete.");
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        sku: productForm.sku,
        category: productForm.category || categories[0]?._id,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        unit: productForm.unit,
        stock: Number(productForm.stock),
        description: productForm.description || `Commercial grade ${productForm.name}`,
        images: [productForm.imageUrl],
        specs: {
          alloyGrade: productForm.alloyGrade,
          temper: productForm.temper,
          thickness: productForm.thickness,
          width: productForm.width,
          length: productForm.length,
          finish: productForm.finish,
          standard: productForm.standard
        }
      };

      if (editingProductId) {
        await productAPI.updateProduct(editingProductId, payload);
      } else {
        await productAPI.createProduct(payload);
      }

      setIsProductModalOpen(false);
      loadAll();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderAPI.updateOrderStatus(id, { orderStatus: status });
      loadAll();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const handleUpdateQuoteStatus = async (id, status) => {
    try {
      await quoteAPI.updateQuoteStatus(id, { status });
      loadAll();
    } catch (e) {
      alert("Failed to update quote.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD5]">
        <div>
          <span className="text-[10px] bg-[#2B2623] text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Console
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2623] mt-1">
            {brand.name} Operations Hub
          </h1>
          <p className="text-xs text-[#8A94A6]">
            Signed in as <strong>{user.name}</strong> &bull; Saket, Meerut Central Inventory
          </p>
        </div>

        <Link
          to="/shop"
          className="px-4 py-2 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] hover:bg-gray-50 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span>Live Customer Catalogue</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "overview" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "products" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("bulk-import")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "bulk-import" ? "bg-[#C08457] text-white shadow-xs" : "bg-amber-50 text-[#9D643A] hover:bg-amber-100 border border-[#C08457]/30"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Bulk Import (CSV / Excel)</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "orders" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("quotes")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "quotes" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Quotes ({quotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "categories" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "users" ? "bg-[#2B2623] text-white shadow-xs" : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <AdminOverview
          statsData={statsData}
          categoriesCount={categories.length}
          onSelectTab={setActiveTab}
        />
      )}

      {activeTab === "products" && (
        <AdminProducts
          products={products}
          onAddProduct={handleOpenAddProduct}
          onEditProduct={handleOpenEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {activeTab === "bulk-import" && (
        <AdminBulkImport onImportSuccess={loadAll} />
      )}

      {activeTab === "orders" && (
        <AdminOrders orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
      )}

      {activeTab === "quotes" && (
        <AdminQuotes quotes={quotes} onUpdateStatus={handleUpdateQuoteStatus} />
      )}

      {activeTab === "categories" && (
        <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#2B2623]">15 Industrial Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c._id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] flex items-center gap-3 text-xs">
                <img src={c.image} alt="" className="w-12 h-12 object-cover rounded-xl border border-[#E6DFD5]" />
                <div>
                  <h4 className="font-bold text-[#2B2623]">{c.name}</h4>
                  <p className="text-[10px] text-gray-500 font-mono">slug: {c.slug}</p>
                  <p className="text-[10px] text-[#C08457] font-semibold mt-0.5">{c.productCount || 0} active products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#2B2623]">Registered Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-gray-600 uppercase font-semibold text-[10px] border-y border-[#E6DFD5]">
                <tr>
                  <th className="py-3 px-4">Name & Email</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <strong className="text-[#2B2623] block">{u.name}</strong>
                      <span className="text-[10px] text-gray-400">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.companyName || "Individual"}</td>
                    <td className="py-3 px-4 font-mono text-gray-600">{u.gstNumber || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === "admin" ? "bg-amber-100 text-amber-900" : "bg-gray-100 text-gray-700"}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-[#2B2623]">
                {editingProductId ? "Edit Material Specification" : "Add New Aluminium Material"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Wholesale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Unit *</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="metre">metre</option>
                    <option value="sheet">sheet</option>
                    <option value="coil">coil</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Alloy Grade</label>
                  <input
                    type="text"
                    value={productForm.alloyGrade}
                    onChange={(e) => setProductForm({ ...productForm, alloyGrade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Thickness / Gauge</label>
                  <input
                    type="text"
                    value={productForm.thickness}
                    onChange={(e) => setProductForm({ ...productForm, thickness: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Temper</label>
                  <input
                    type="text"
                    value={productForm.temper}
                    onChange={(e) => setProductForm({ ...productForm, temper: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white font-semibold cursor-pointer"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
