"use client";

import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import { UnauthorizedAction } from "../common/UnauthorizedAction";
import { useAuthorization } from "../../hooks/useAuthorization";

interface ScopedPermissionGuardProps {
  permission: PermissionCode;
  scopeId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ScopedPermissionGuard({ permission, scopeId, children, fallback }: ScopedPermissionGuardProps) {
  const { isSuperAdmin, hasPermission } = useAuthorization();

  // For Phase 3, this is a placeholder that falls back to global permissions.
  // In Phase 5+, this will connect to a ScopedAuthContext.
  
  if (isSuperAdmin || hasPermission(permission)) {
    return <>{children}</>;
  }

  return fallback !== undefined ? <>{fallback}</> : <UnauthorizedAction />;
}
