import { createContext } from "react";
import type { CartItem, MenuItem } from "../../types";

export interface AddCartItemInput {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (input: AddCartItemInput) => void;
  clearCart: () => void;
  removeItem: (cartId: string) => void;
  updateItem: (
    cartId: string,
    updates: Partial<Pick<CartItem, "quantity" | "notes">>,
  ) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
