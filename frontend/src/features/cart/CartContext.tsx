import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "../../types";
import {
  CartContext,
  type AddCartItemInput,
  type CartContextValue,
} from "./cartStore";

const storageKey = "quickbite.cart";
function createCartId(menuItemId: number) {
  return `${menuItemId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getInitialItems() {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialItems);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((input: AddCartItemInput) => {
    setItems((current) => [
      ...current,
      {
        cart_id: createCartId(input.menuItem.id),
        menu_item: input.menuItem,
        notes: input.notes,
        quantity: input.quantity,
      },
    ]);
  }, []);

  const updateItem = useCallback<CartContextValue["updateItem"]>(
    (cartId, updates) => {
      setItems((current) =>
        current.map((item) =>
          item.cart_id === cartId
            ? {
                ...item,
                ...updates,
                quantity: Math.max(1, updates.quantity ?? item.quantity),
              }
            : item,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((current) => current.filter((item) => item.cart_id !== cartId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.menu_item.price * item.quantity,
      0,
    );

    return {
      addItem,
      clearCart,
      itemCount,
      items,
      removeItem,
      subtotal,
      updateItem,
    };
  }, [addItem, clearCart, items, removeItem, updateItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
