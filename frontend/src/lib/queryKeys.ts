export const queryKeys = {
  adminOrders: () => ["admin", "orders"] as const,
  menu: () => ["menu"] as const,
  menuItem: (menuItemId: number) => ["menu", "detail", menuItemId] as const,
  order: (orderId: number) => ["orders", "detail", orderId] as const,
  profile: () => ["profile"] as const,
};

export function isProtectedQueryKey(queryKey: readonly unknown[]) {
  const scope = queryKey[0];
  return scope === "admin" || scope === "orders" || scope === "profile";
}
