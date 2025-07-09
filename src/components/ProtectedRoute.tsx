
import { useAuth } from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
