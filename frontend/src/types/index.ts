import type { LucideIcon } from "lucide-react";
import type { AppRoute } from "@/config/routes";
import type { Role } from "@/types/roles";

export type Nullable<T> = T | null;
export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface NavigationItem {
  label: string;
  href: AppRoute;
  icon: LucideIcon;
  roles?: Role[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
