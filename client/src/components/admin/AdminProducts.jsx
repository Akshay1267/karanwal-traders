import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, Image } from "lucide-react";

export default function AdminProducts({ products, onAddProduct, onEditProduct, onDeleteProduct }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.specs?.alloyGrade && p.specs.alloyGrade.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#2B2623]">Catalogue Management</h3>
          <p className="text-xs text-gray-500">Live prices, stock count, and alloy specifications.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter products..."
              className="pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={onAddProduct}
            className="px-4 py-2 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Material</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF7F2] text-gray-600 uppercase font-semibold text-[10px] border-y border-[#E6DFD5]">
            <tr>
              <th className="py-3 px-4">Material & SKU</th>
              <th className="py-3 px-4">Alloy & Temper</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price / Unit</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=100&q=80"}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-[#E6DFD5]"
                  />
                  <div>
                    <h4 className="font-semibold text-[#2B2623] line-clamp-1">{p.name}</h4>
                    <span className="font-mono text-[10px] text-gray-400">{p.sku}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-[#2B2623]">{p.specs?.alloyGrade || "Standard"}</span>
                  <span className="text-gray-400 text-[10px] block">{p.specs?.temper}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{p.category?.name || "Material"}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#2B2623]">
                  ₹{p.price}/{p.unit}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-semibold ${p.stock <= 20 ? "text-red-600" : "text-emerald-700"}`}>
                    {p.stock} {p.unit}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="p-1 text-gray-500 hover:text-[#C08457] cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p._id)}
                    className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
