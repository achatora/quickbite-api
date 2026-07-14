import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { getProfile } from "../../services/profileService";
import { useAuth } from "../auth/useAuth";

export function useProfile() {
  const auth = useAuth();

  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: queryKeys.profile(),
    queryFn: ({ signal }) => getProfile(signal),
  });
}
