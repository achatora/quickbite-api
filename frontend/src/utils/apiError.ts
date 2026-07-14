import { AxiosError } from "axios";
import type { ApiErrorResponse } from "../types";

export function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const status = error.response?.status;

    if (status === 401) {
      return "Your session has expired or you need to sign in to continue.";
    }

    if (status === 403) {
      return "You do not have permission to access this area.";
    }

    if (status && status >= 500) {
      return "Something went wrong on the server. Please try again.";
    }

    return data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}
