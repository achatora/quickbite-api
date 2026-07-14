import { apiClient } from "./apiClient";
import type { ProfileApiResponse } from "../types";

export async function getProfile(signal?: AbortSignal) {
  const response = await apiClient.get<ProfileApiResponse>("/profile", { signal });
  return response.data.data as NonNullable<ProfileApiResponse["data"]>;
}
