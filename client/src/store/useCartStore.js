import { create } from "zustand";

const loadInitialCart = () => {
  try {
    const saved = localStorage.getItem("aluex_cart");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem("aluex_cart", JSON.stringify(items));
  } catch (e) {}
};

export const useCartStore = create((set, get) => ({
  items: loadInitialCart(),
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  addItem: (product, qty = 1) => {
    const current = get().items;
    const existingIndex = current.findIndex((item) => item.product === product._id);
    let updated;

    if (existingIndex > -1) {
      updated = [...current];
      const newQty = updated[existingIndex].quantity + qty;
      updated[existingIndex].quantity = Math.min(newQty, product.stock || 9999);
    } else {
      updated = [
        ...current,
        {
          product: product._id,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          price: product.price,
          unit: product.unit,
          image: product.images?.[0] || "",
          stock: product.stock,
          specs: product.specs || {},
          quantity: Math.max(1, qty)
        }
      ];
    }

    saveCart(updated);
    set({ items: updated, isDrawerOpen: true });
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
      return;
    }
    const current = get().items;
    const updated = current.map((item) =>
      item.product === productId ? { ...item, quantity: Math.min(qty, item.stock || 9999) } : item
    );
    saveCart(updated);
    set({ items: updated });
  },

  removeItem: (productId) => {
    const updated = get().items.filter((item) => item.product !== productId);
    saveCart(updated);
    set({ items: updated });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  // Calculations
  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getGST: () => {
    const subtotal = get().getSubtotal();
    return Math.round(subtotal * 0.18); // 18% GST
  },

  getShipping: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 25000 ? 0 : 750; // Free above Rs. 25,000 threshold
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal + get().getGST() + get().getShipping();
  }
}));
