import {
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Notices", href: "/notices", icon: Megaphone },
  { label: "Societies", href: "/societies", icon: UsersRound },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Profile", href: "/profile/me", icon: CircleUserRound },
  { label: "Admin", href: "/admin", icon: ShieldCheck },
];
