import { createContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  userEmail: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);