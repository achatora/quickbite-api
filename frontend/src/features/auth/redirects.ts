import type { Location } from "react-router-dom";

interface AuthRedirectState {
  from?: Pick<Location, "hash" | "pathname" | "search"> | null;
  registrationEmail?: string;
  registrationSuccess?: string;
}

const authPaths = new Set(["/login", "/register"]);

export function isAuthPath(pathname?: string | null) {
  return pathname ? authPaths.has(pathname) : false;
}

export function getSafeRedirectTarget(
  state: unknown,
  fallback = "/account",
) {
  const from = (state as AuthRedirectState | null)?.from;

  if (!from?.pathname || isAuthPath(from.pathname)) {
    return fallback;
  }

  return `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`;
}

export function getRegistrationNotice(state: unknown) {
  const authState = state as AuthRedirectState | null;

  return {
    email: authState?.registrationEmail ?? "",
    message: authState?.registrationSuccess ?? "",
  };
}

export type { AuthRedirectState };
