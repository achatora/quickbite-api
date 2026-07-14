import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && [400, 401, 403, 404, 422, 429].includes(error.response?.status ?? 0)) {
          return false;
        }
        if (failureCount >= 2) {
          return false;
        }

        if (error instanceof Error && error.message.includes("404")) {
          return false;
        }

        return true;
      },
      staleTime: 30_000,
    },
    mutations: {
      retry: 0,
    },
  },
});
