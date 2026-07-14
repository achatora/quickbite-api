import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, isProtectedQueryKey } from "../../lib/queryKeys";
import { queryClient } from "../../lib/queryClient";
import { getProfile } from "../../services/profileService";
import { unauthorizedEvent } from "../../services/apiClient";
import type { LoginUserResponse, SessionUser } from "../../types";
import { AuthContext, type AuthValue } from "./authContext";
import {
  clearStoredSession,
  getStoredSession,
  getStoredToken,
  storeSession,
} from "./authStorage";

function toSessionUser(user: LoginUserResponse | SessionUser): SessionUser {
  return {
    email: user.email,
    id: user.id,
    name: user.name,
    role: user.role,
    surname: user.surname,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => getStoredSession()?.user ?? null);

  const profileQuery = useQuery({
    enabled: Boolean(user && getStoredToken()),
    queryKey: queryKeys.profile(),
    queryFn: ({ signal }) => getProfile(signal),
  });

  const clearSession = useCallback(async () => {
    clearStoredSession();
    setUser(null);
    await queryClient.cancelQueries({
      predicate: (query) => isProtectedQueryKey(query.queryKey),
    });
    queryClient.removeQueries({
      predicate: (query) => isProtectedQueryKey(query.queryKey),
    });
  }, []);

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    const nextUser = profileQuery.data;
    const token = getStoredToken();
    setUser(nextUser);

    if (token) {
      storeSession(token, nextUser);
    }
  }, [profileQuery.data]);

  useEffect(() => {
    const onUnauthorized = () => void clearSession();
    window.addEventListener(unauthorizedEvent, onUnauthorized);
    return () => window.removeEventListener(unauthorizedEvent, onUnauthorized);
  }, [clearSession]);

  const value = useMemo<AuthValue>(() => ({
    acceptLogin: (data) => {
      const nextUser = toSessionUser(data.user);
      queryClient.removeQueries({
        predicate: (query) => isProtectedQueryKey(query.queryKey),
      });
      queryClient.setQueryData(queryKeys.profile(), nextUser);
      storeSession(data.token, nextUser);
      setUser(nextUser);
    },
    isAuthenticated: user !== null,
    isLoading: Boolean(user && getStoredToken() && profileQuery.isLoading && !profileQuery.data),
    logout: clearSession,
    user,
  }), [clearSession, profileQuery.data, profileQuery.isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
