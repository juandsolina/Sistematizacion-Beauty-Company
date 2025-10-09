import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

type CartItemId = string | number;

export interface CartItem {
  id: CartItemId;
  nombre: string;
  precio: number;
  imagen?: string | null;
  cantidad: number;
}

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // acciones
  addToCart: (item: Omit<CartItem, "cantidad">, qty?: number) => void;
  removeFromCart: (id: CartItemId) => void;
  updateQuantity: (id: CartItemId, cantidad: number) => void;
  increment: (id: CartItemId, step?: number) => void;
  decrement: (id: CartItemId, step?: number) => void;
  clearCart: () => void;

  // selectores
  getTotal: () => number;
  getCount: () => number;
  getItemQty: (id: CartItemId) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LS_KEY = "sb_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // cargar de localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setCartItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persistir
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart: CartContextType["addToCart"] = (item, qty = 1) => {
    if (!item || item.precio == null || item.nombre == null) return;
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], cantidad: copy[idx].cantidad + qty };
        return copy;
      }
      return [...prev, { ...item, cantidad: qty }];
    });
  };

  const removeFromCart = (id: CartItemId) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: CartItemId, cantidad: number) => {
    if (cantidad <= 0) return removeFromCart(id);
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)));
  };

  const increment = (id: CartItemId, step = 1) =>
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + step } : i))
    );

  const decrement = (id: CartItemId, step = 1) =>
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad - step } : i))
        .filter((i) => i.cantidad > 0)
    );

  const clearCart = () => setCartItems([]);

  const selectors = useMemo(() => {
    const total = cartItems.reduce((t, i) => t + i.precio * i.cantidad, 0);
    const count = cartItems.reduce((t, i) => t + i.cantidad, 0);
    const qtyById = new Map(cartItems.map((i) => [i.id, i.cantidad]));
    return {
      total,
      count,
      getQty: (id: CartItemId) => qtyById.get(id) ?? 0,
    };
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    getTotal: () => selectors.total,
    getCount: () => selectors.count,
    getItemQty: selectors.getQty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
