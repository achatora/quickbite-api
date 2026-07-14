import { apiClient } from "./apiClient";
import type {
  CreateMenuItemInput,
  MenuApiResponse,
  MenuItemApiResponse,
  MessageApiResponse,
  UpdateMenuAvailabilityInput,
} from "../types";

export async function getMenu(signal?: AbortSignal) {
  const response = await apiClient.get<MenuApiResponse>("/menu", { signal });
  return response.data.data ?? [];
}

export async function createMenuItem(input: CreateMenuItemInput) {
  const response = await apiClient.post<MenuItemApiResponse>("/menu", input);
  return response.data.data as NonNullable<MenuItemApiResponse["data"]>;
}

export async function updateMenuAvailability(
  menuItemId: number,
  input: UpdateMenuAvailabilityInput,
) {
  const response = await apiClient.patch<MessageApiResponse>(
    `/menu/${menuItemId}/availability`,
    input,
  );
  return response.data;
}
