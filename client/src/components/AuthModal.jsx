import React, { useState } from "react";
import { X, Lock, Mail, User, Phone, Building, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, isLoading } =
    useAuthStore();

  const [mode, setMode] = useState(authModalMode || "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    gstNumber: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "login") {
      const res = await login(formData.email, formData.password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } else if (mode === "register") {
      const res = await register(formData);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } else if (mode === "forgot") {
      setForgotSent(true);
    }
  };

  const handleFillDemo = (type) => {
    setErrorMsg("");
    setMode("login");
    if (type === "admin") {
      setFormData({
        ...formData,
        email: "admin@alutrade.com",
        password: "Admin@123"
      });
    } else {
      setFormData({
        ...formData,
        email: "customer@alutrade.com",
        password: "Customer@123"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E6DFD5] overflow-hidden z-10 animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FAF7F2] p-6 border-b border-[#E6DFD5] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#C08457]">
              ALUEX Portal Access
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2B2623]">
              {mode === "login" && "Sign In to Your Account"}
              {mode === "register" && "Create B2B / B2C Account"}
              {mode === "forgot" && "Reset Your Password"}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Credentials Quick Fill Bar */}
        <div className="bg-[#F5EAE0] px-5 py-2.5 border-b border-[#E8D9CC] flex items-center justify-between text-xs">
          <span className="text-[#9D643A] font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C08457]" />
            Quick Prototype Login:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("admin")}
              className="bg-white hover:bg-[#2B2623] hover:text-white text-[#2B2623] px-2.5 py-1 rounded-lg text-[10px] font-bold border border-[#E6DFD5] transition-colors cursor-pointer"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("customer")}
              className="bg-white hover:bg-[#C08457] hover:text-white text-[#2B2623] px-2.5 py-1 rounded-lg text-[10px] font-bold border border-[#E6DFD5] transition-colors cursor-pointer"
            >
              Customer Demo
            </button>
          </div>
        </div>

        {/* Tabs for Login / Register */}
        {mode !== "forgot" && (
          <div className="flex border-b border-gray-100 bg-[#FAF7F2]/50 text-xs font-semibold">
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === "login"
                  ? "border-b-2 border-[#C08457] text-[#C08457] bg-white"
                  : "text-gray-500 hover:text-[#2B2623]"
              }`}
            >
              Existing Account
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrorMsg("");
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === "register"
                  ? "border-b-2 border-[#C08457] text-[#C08457] bg-white"
                  : "text-gray-500 hover:text-[#2B2623]"
              }`}
            >
              Register New Business
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {forgotSent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2B2623]">Password Reset Link Sent</h4>
              <p className="text-xs text-gray-500">
                A prototype password reset link has been simulated for <strong>{formData.email}</strong>.
              </p>
              <button
                onClick={() => {
                  setForgotSent(false);
                  setMode("login");
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#2B2623] text-white text-xs font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2623] mb-1">Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Shubh Karanwal"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                      />
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2B2623] mb-1">Phone Number *</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98970 12345"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2623] mb-1">Company</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Apex Fab Pvt Ltd"
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2B2623] mb-1">GSTIN</label>
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        placeholder="09AAACH7492K1Z8"
                        className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#2B2623] mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@business.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="block text-xs font-semibold text-[#2B2623]">Password *</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[10px] text-[#C08457] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DFD5] rounded-xl focus:border-[#C08457] focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#2B2623] hover:bg-[#C08457] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <span>
                  {isLoading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : mode === "register"
                    ? "Create Account"
                    : "Send Reset Link"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
