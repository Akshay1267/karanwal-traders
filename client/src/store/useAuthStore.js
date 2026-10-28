import { create } from "zustand";
import { authAPI } from "../services/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("aluex_token") || null,
  isLoading: false,
  isAuthModalOpen: false,
  authModalMode: "login", // "login" | "register" | "forgot"
  
  openAuthModal: (mode = "login") => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        localStorage.setItem("aluex_token", res.data.token);
        set({
          user: res.data.user,
          token: res.data.token,
          isLoading: false,
          isAuthModalOpen: false
        });
        return { success: true };
      }
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Login failed. Please check credentials."
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await authAPI.register(userData);
      if (res.data.success) {
        localStorage.setItem("aluex_token", res.data.token);
        set({
          user: res.data.user,
          token: res.data.token,
          isLoading: false,
          isAuthModalOpen: false
        });
        return { success: true };
      }
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed."
      };
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("aluex_token");
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    const token = localStorage.getItem("aluex_token");
    if (!token) return;
    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        set({ user: res.data.user });
      }
    } catch (error) {
      localStorage.removeItem("aluex_token");
      set({ user: null, token: null });
    }
  },

  toggleWishlist: async (productId) => {
    const { user, openAuthModal } = get();
    if (!user) {
      openAuthModal("login");
      return;
    }
    try {
      const res = await authAPI.toggleWishlist(productId);
      if (res.data.success) {
        set((state) => ({
          user: { ...state.user, wishlist: res.data.wishlist }
        }));
      }
    } catch (e) {
      console.error("Failed to toggle wishlist", e);
    }
  }
}));
