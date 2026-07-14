import type { JwtPayload, SessionUser } from "../../types";

const tokenKey = "quickbite.auth_token";
const userKey = "quickbite.auth_user";

function decodePayload(token: string): JwtPayload | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

export function getStoredSession(): { token: string; user: SessionUser } | null {
  try {
    const token = localStorage.getItem(tokenKey);
    const rawUser = localStorage.getItem(userKey);
    const payload = token ? decodePayload(token) : null;
    if (!token || !rawUser || !payload || payload.exp * 1000 <= Date.now()) {
      clearStoredSession();
      return null;
    }
    return { token, user: JSON.parse(rawUser) as SessionUser };
  } catch {
    clearStoredSession();
    return null;
  }
}

export function getStoredToken() {
  return getStoredSession()?.token ?? null;
}

export function storeSession(token: string, user: SessionUser) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}
