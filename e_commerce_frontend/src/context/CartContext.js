import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { load, save } from '../utils/storage';

const CartContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useCart exposes cart state and actions: items, add, remove, updateQty, clear, open/close sidebar, totals.
 */
export function useCart() {
  return useContext(CartContext);
}

/**
 * PUBLIC_INTERFACE
 * CartProvider manages cart items persisted to localStorage and the sidebar open state.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load('cart', []));
  const [open, setOpen] = useState(false);

  useEffect(() => { save('cart', items); }, [items]);

  const subtotal = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const count = items.reduce((sum, it) => sum + it.qty, 0);

  const value = useMemo(() => ({
    items,
    open,
    count,
    subtotal,
    // PUBLIC_INTERFACE
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    toggleCart: () => setOpen(p => !p),
    // PUBLIC_INTERFACE
    add: (product, qty = 1) => {
      setItems(prev => {
        const idx = prev.findIndex(p => p.id === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { id: product.id, title: product.title, price: product.price, image: product.image, qty }];
      });
      setOpen(true);
    },
    // PUBLIC_INTERFACE
    remove: (id) => setItems(prev => prev.filter(p => p.id !== id)),
    // PUBLIC_INTERFACE
    updateQty: (id, qty) => setItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, qty) } : p)),
    // PUBLIC_INTERFACE
    clear: () => setItems([])
  }), [items, open, count, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
