"use client";

import { useAuthorization } from "../../hooks/useAuthorization";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import { UnauthorizedAction } from "../common/UnauthorizedAction";

interface PermissionGuardProps {
  permissions: PermissionCode | PermissionCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permissions, children, fallback }: PermissionGuardProps) {
  const { hasPermission, isSuperAdmin } = useAuthorization();

  if (isSuperAdmin) {
    return <>{children}</>;
  }

  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
  const hasAccess = requiredPermissions.every((perm) => hasPermission(perm));

  if (!hasAccess) {
    return fallback !== undefined ? <>{fallback}</> : <UnauthorizedAction />;
  }

  return <>{children}</>;
}
