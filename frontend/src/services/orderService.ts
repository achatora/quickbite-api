import { apiClient } from "./apiClient";
import type {
  CreateOrderInput,
  MessageApiResponse,
  OrderApiResponse,
  OrdersApiResponse,
  UpdateOrderStatusInput,
} from "../types";

export async function getAdminOrders(signal?: AbortSignal) {
  const response = await apiClient.get<OrdersApiResponse>("/orders", { signal });
  return response.data.data ?? [];
}

export async function getOrder(orderId: number, signal?: AbortSignal) {
  const response = await apiClient.get<OrderApiResponse>(`/orders/${orderId}`, {
    signal,
  });
  return response.data.data as NonNullable<OrderApiResponse["data"]>;
}

export async function createOrder(input: CreateOrderInput) {
  const response = await apiClient.post<OrderApiResponse>("/orders", input);
  return response.data.data as NonNullable<OrderApiResponse["data"]>;
}

export async function updateOrderStatus(
  orderId: number,
  input: UpdateOrderStatusInput,
) {
  const response = await apiClient.patch<MessageApiResponse>(
    `/orders/${orderId}/status`,
    input,
  );
  return response.data;
}

export async function deleteOrder(orderId: number) {
  const response = await apiClient.delete<MessageApiResponse>(
    `/orders/${orderId}`,
  );
  return response.data;
}
