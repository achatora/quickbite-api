import type { MenuItem } from "../../types";

export interface CartSelection {
  item: MenuItem;
  quantity: number;
  notes: string;
}
