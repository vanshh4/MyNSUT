"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { AppLogo } from "@/components/common/AppLogo";
import { MotionButton } from "@/components/ui/MotionButton";
import { navigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const visibleNavigation = navigation.filter((item) => !item.permissions?.length || item.permissions.every((permission) => user?.permissions.includes(permission)));

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      onClose();
      router.replace(routes.signIn);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <AnimatePresence>{open ? <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Close navigation overlay" /> : null}</AnimatePresence>
      <aside className={cn("glass fixed inset-y-3 left-3 z-50 flex w-72 flex-col rounded-[32px] p-4 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-[110%]")}>
        <div className="flex items-center justify-between px-2 py-1"><AppLogo /><button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full hover:bg-slate-100 lg:hidden dark:hover:bg-white/5" aria-label="Close navigation"><X className="size-5" /></button></div>
        <nav className="mt-9 space-y-2">{visibleNavigation.map(({ label, href, icon: Icon }, index) => <motion.div key={href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04, type: "spring" }}><Link onClick={onClose} href={href} className={cn("flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold transition", path === href ? "bg-[#4968f2] text-white shadow-[0_10px_25px_rgba(73,104,242,.24)]" : "text-slate-600 hover:bg-white/65 dark:text-slate-300 dark:hover:bg-white/5")}><Icon className="size-[18px]" />{label}</Link></motion.div>)}</nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-[24px] bg-motion-mint/70 p-4 dark:bg-emerald-400/10"><p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">{user?.fullName ?? "Verified student"}</p><p className="mt-1 truncate text-xs text-emerald-700/80 dark:text-emerald-300/75">{user?.email}</p></div>
          <MotionButton variant="ghost" className="w-full" onClick={() => void handleLogout()} disabled={isLoggingOut}><LogOut className="size-4" />{isLoggingOut ? "Logging out…" : "Log out"}</MotionButton>
        </div>
      </aside>
    </>
  );
}
