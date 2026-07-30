"use client";

import { useAuthorization } from "../../hooks/useAuthorization";
import type { RoleCode } from "@mynsut/shared/constants/roles";
import { AccessDenied } from "../common/AccessDenied";

interface RoleGuardProps {
  roles: RoleCode | RoleCode[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const { hasRole, isSuperAdmin } = useAuthorization();
  
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  const hasAccess = requiredRoles.some((role) => hasRole(role));

  if (!hasAccess) {
    return fallback !== undefined ? <>{fallback}</> : <AccessDenied />;
  }

  return <>{children}</>;
}
