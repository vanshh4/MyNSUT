import type { PermissionCode } from "@mynsut/shared/constants/permissions";
import { PERMISSIONS } from "@mynsut/shared/constants/permissions";
import {
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import type { AppRoute } from "@/config/routes";

export interface NavigationItem {
  label: string;
  href: AppRoute;
  icon: typeof LayoutDashboard;
  permissions?: readonly PermissionCode[];
}

export const navigation: readonly NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Notices", href: "/notices", icon: Megaphone, permissions: [PERMISSIONS.NOTICE_VIEW] },
  {
    label: "Societies",
    href: "/societies",
    icon: UsersRound,
    permissions: [PERMISSIONS.SOCIETY_VIEW_PUBLIC],
  },
  { label: "Events", href: "/events", icon: CalendarDays, permissions: [PERMISSIONS.EVENT_VIEW] },
  {
    label: "Profile",
    href: "/profile/me",
    icon: CircleUserRound,
    permissions: [PERMISSIONS.PROFILE_VIEW_SELF],
  },
  {
    label: "Admin",
    href: "/admin",
    icon: ShieldCheck,
    permissions: [PERMISSIONS.ADMIN_DASHBOARD_VIEW],
  },
];
