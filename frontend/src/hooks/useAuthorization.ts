import { useAuth } from "./useAuth";
import { hasRole, hasPermission, isSuperAdmin } from "../lib/auth/authorization";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";

export function useAuthorization() {
  const { user } = useAuth();

  return {
    hasRole: (role: RoleCode) => !!user && hasRole(user, role),
    hasPermission: (perm: PermissionCode) => !!user && hasPermission(user, perm),
    isSuperAdmin: !!user && isSuperAdmin(user),
  };
}
