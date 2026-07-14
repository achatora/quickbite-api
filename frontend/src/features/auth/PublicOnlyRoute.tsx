import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../../components/molecules/PageLoader";
import { getSafeRedirectTarget } from "./redirects";
import { useAuth } from "./useAuth";

export function PublicOnlyRoute() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) return <PageLoader />;

  if (auth.isAuthenticated) {
    return <Navigate replace to={getSafeRedirectTarget(location.state, "/account")} />;
  }

  return <Outlet />;
}
