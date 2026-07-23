import type { ApiResponse as SharedApiResponse } from "@mynsut/shared/types/api";
import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import type { LucideIcon } from "lucide-react";

import type { AppRoute } from "@/config/routes";

export type Nullable<T> = T | null;
export type ApiStatus = "idle" | "loading" | "success" | "error";
export type ApiResponse<T> = SharedApiResponse<T>;

export interface NavigationItem {
  label: string;
  href: AppRoute;
  icon: LucideIcon;
  permissions?: readonly PermissionCode[];
}
