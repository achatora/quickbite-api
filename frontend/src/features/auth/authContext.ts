import { createContext } from "react";
import type { LoginData, SessionUser } from "../../types";

export interface AuthValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SessionUser | null;
  acceptLogin: (data: LoginData) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);
