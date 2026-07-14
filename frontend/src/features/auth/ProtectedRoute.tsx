import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../../components/molecules/PageLoader";
import { ForbiddenPage } from "../../pages/ForbiddenPage";
import { isAdminUser } from "../../utils/user";
import { useAuth } from "./useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const auth = useAuth();
  const location = useLocation();
  if (auth.isLoading) return <PageLoader />;
  if (!auth.isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }
  if (allowedRoles?.includes("admin") && !isAdminUser(auth.user)) {
    return <ForbiddenPage />;
  }
  return <Outlet />;
}
