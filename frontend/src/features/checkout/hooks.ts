import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { createOrder } from "../../services/orderService";
import type { CartItem, CheckoutFormValues, CheckoutResult } from "../../types";

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders() });
    },
  });
}

export function useSubmitCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customer,
      items,
    }: {
      customer: CheckoutFormValues;
      items: CartItem[];
    }): Promise<CheckoutResult> => {
      const orders = [];

      for (const item of items) {
        const notes = [item.notes, customer.order_notes].filter(Boolean).join(" | ");
        const order = await createOrder({
          menu_id: item.menu_item.id,
          notes: notes.slice(0, 500),
          quantity: item.quantity,
        });
        orders.push(order);
      }

      return { customer, orders };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders() });
    },
  });
}
