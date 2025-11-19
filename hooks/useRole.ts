import { useAuth } from "./useUser";

export function useRole() {
  const { user, isLoading } = useAuth();

  const hasRole = (...allowed: string[]) => {
    if (!user) return false;
    return allowed.includes(user.role);
  };

  return { user, isLoading, hasRole };
}
