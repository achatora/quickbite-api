import type { SessionUser } from "../types";

export function getUserDisplayName(user: SessionUser | null) {
  if (!user) return "Guest";

  return [user.name, user.surname].filter(Boolean).join(" ").trim() || user.email;
}

export function getUserInitials(user: SessionUser | null) {
  if (!user) return "QB";

  const source = [user.name, user.surname].filter(Boolean);

  if (source.length > 0) {
    return source
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
  }

  return user.email.slice(0, 2).toUpperCase();
}

export function isAdminUser(user: SessionUser | null) {
  return user?.role.toLowerCase() === "admin";
}
