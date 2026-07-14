export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081",
  appName: import.meta.env.VITE_APP_NAME ?? "QuickBite",
} as const;
