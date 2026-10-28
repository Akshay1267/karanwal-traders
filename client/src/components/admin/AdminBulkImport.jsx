import React, { useState } from "react";
import { Upload, Download, CheckCircle, FileSpreadsheet, AlertCircle } from "lucide-react";
import { productAPI } from "../../services/api";

export default function AdminBulkImport({ onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await productAPI.bulkImport(formData);
      if (res.data.success) {
        setResult(res.data);
        setFile(null);
        onImportSuccess?.();
      }
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "Bulk import failed. Please verify column headers."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 sm:p-10 shadow-xs space-y-8 animate-fadeIn">
      <div>
        <span className="text-[10px] font-bold text-[#C08457] uppercase tracking-wider">
          Enterprise Data Pipeline
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#2B2623] mt-0.5">
          Bulk Import Products via CSV / Excel
        </h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xl leading-relaxed">
          Upload your supplier catalogue or factory price sheets. The system automatically reconciles SKU codes, maps categories, and updates real-time stock levels.
        </p>
      </div>

      {/* Template Download Box */}
      <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-xs text-[#2B2623] flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-[#C08457]" />
            <span>Download Pre-Configured CSV Template</span>
          </h4>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Headers: name, sku, category, price, unit, stock, alloyGrade, temper, thickness, finish, standard.
          </p>
        </div>
        <a
          href={productAPI.downloadSampleUrl}
          download="aluex_product_import_template.csv"
          className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 border border-[#E6DFD5] font-semibold text-xs text-[#2B2623] flex items-center gap-2 shrink-0 shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#C08457]" />
          <span>Download Template (.csv)</span>
        </a>
      </div>

      {/* Upload Drag/Drop Box */}
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-[#E6DFD5] hover:border-[#C08457] rounded-3xl p-8 text-center transition-colors bg-[#FAF7F2]/40">
          <Upload className="w-10 h-10 text-[#C08457] mx-auto mb-3" />
          <h4 className="font-semibold text-xs text-[#2B2623]">
            {file ? file.name : "Select or Drop a CSV or Excel (.xlsx) File"}
          </h4>
          <p className="text-[11px] text-gray-400 mt-1">Maximum file size: 10MB</p>

          <input
            type="file"
            id="adminImportFile"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="adminImportFile"
            className="inline-block mt-4 px-5 py-2 rounded-xl bg-white border border-[#E6DFD5] text-xs font-semibold text-[#2B2623] hover:bg-gray-50 cursor-pointer shadow-xs"
          >
            {file ? "Change File" : "Browse File"}
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full py-3.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? "Uploading & Reconciling Catalogue..." : "Execute Bulk Import"}</span>
        </button>
      </form>

      {/* Feedback Alert */}
      {result && (
        <div
          className={`p-5 rounded-2xl border text-xs space-y-2 ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <h4 className="font-bold flex items-center gap-2">
            {result.success ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-red-700" />}
            <span>{result.message}</span>
          </h4>
          {result.insertedCount !== undefined && (
            <div className="flex gap-6 text-[11px] pt-1 font-mono">
              <span>Inserted: <strong>{result.insertedCount}</strong></span>
              <span>Updated: <strong>{result.updatedCount}</strong></span>
            </div>
          )}
          {result.errors?.length > 0 && (
            <div className="mt-2 text-[10px] text-red-700">
              <span className="font-bold">Errors encountered:</span>
              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                {result.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
