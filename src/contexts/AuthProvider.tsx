
import { useState, ReactNode, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("userEmail");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = (newToken: string, email: string) => {
    setToken(newToken);
    setUserEmail(email);
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userEmail", email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, userEmail, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
