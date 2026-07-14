import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import {
  deleteOrder,
  getAdminOrders,
  getOrder,
  updateOrderStatus,
} from "../../services/orderService";
import type { UpdateOrderStatusInput } from "../../types";
import { useAuth } from "../auth/useAuth";
import { isAdminUser } from "../../utils/user";

export function useAdminOrders() {
  const auth = useAuth();

  return useQuery({
    enabled: isAdminUser(auth.user),
    queryKey: queryKeys.adminOrders(),
    queryFn: ({ signal }) => getAdminOrders(signal),
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    enabled: Number.isFinite(orderId) && orderId > 0,
    queryKey: queryKeys.order(orderId),
    queryFn: ({ signal }) => getOrder(orderId, signal),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "preparing" ? 10_000 : false;
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "orders",
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders() });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      orderId,
    }: {
      orderId: number;
      input: UpdateOrderStatusInput;
    }) => updateOrderStatus(orderId, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.order(variables.orderId) });
    },
  });
}
