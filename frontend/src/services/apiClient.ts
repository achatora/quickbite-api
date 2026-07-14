import axios from "axios";
import { env } from "../config/env";
import { clearStoredSession, getStoredToken } from "../features/auth/authStorage";

export const unauthorizedEvent = "quickbite:unauthorized";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 12_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearStoredSession();
      window.dispatchEvent(new Event(unauthorizedEvent));
    }
    return Promise.reject(error);
  },
);
