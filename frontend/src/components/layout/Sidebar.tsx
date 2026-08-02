"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { navigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils/cn";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const visibleNavigation = navigation.filter(
    (item) =>
      !item.permissions?.length ||
      item.permissions.every((permission) => user?.permissions.includes(permission))
  );

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
      <AnimatePresence>
        {open ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-label="Close navigation overlay"
          />
        ) : null}
      </AnimatePresence>
      <aside
        className={cn(
          "bg-glass-surface dark:bg-primary-container/30 h-[calc(100vh-2rem)] w-80 fixed left-4 top-4 rounded-xl backdrop-blur-xl border border-glass-border shadow-sm flex-col py-8 px-4 z-50 transition-transform flex",
          open ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
        )}
      >
        <div className="flex shrink-0 items-center gap-4 px-4 mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="font-headline text-2xl font-bold text-primary dark:text-primary-container">MyNSUT</h1>
            <p className="font-label text-[10px] text-text-muted tracking-widest uppercase mt-1">STUDENT PLATFORM</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-glass-surface lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5 text-text-muted" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 flex-grow overflow-y-auto px-2">
          {visibleNavigation.map(({ label, href, icon: Icon }) => {
            const isActive = path === href;
            return (
              <Link
                key={href}
                onClick={onClose}
                href={href}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-primary text-on-primary scale-95 shadow-sm"
                    : "text-text-muted hover:text-primary hover:bg-glass-surface dark:hover:bg-white/10"
                )}
              >
                <Icon className={cn("size-[20px] transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="font-label text-sm font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto px-2 pt-4">
          <div className="bg-primary/5 dark:bg-primary/10 backdrop-blur-md border border-glass-border rounded-xl p-4 mb-4">
            <p className="font-label text-[10px] text-primary uppercase mb-1 font-bold">
              {user?.fullName ?? "Verified student"}
            </p>
            <p className="text-xs text-text-muted truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="w-full text-text-muted hover:text-primary flex items-center justify-center gap-3 p-4 border border-glass-border rounded-full hover:bg-glass-surface dark:hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
          >
            <LogOut className="size-5" />
            <span className="font-label text-sm font-medium">
              {isLoggingOut ? "Logging out…" : "Log out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
