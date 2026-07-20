"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside
        className={cn(
          "glass fixed inset-y-3 left-3 z-50 flex w-72 flex-col rounded-[32px] p-4 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-[110%]"
        )}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <AppLogo />
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-slate-100 lg:hidden dark:hover:bg-white/5"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="mt-9 space-y-2">
          {navigation.map(({ label, href, icon: Icon }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: "spring" }}
            >
              <Link
                onClick={onClose}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold transition",
                  path === href
                    ? "bg-[#4968f2] text-white shadow-[0_10px_25px_rgba(73,104,242,.24)]"
                    : "text-slate-600 hover:bg-white/65 dark:text-slate-300 dark:hover:bg-white/5"
                )}
              >
                <Icon className="size-[18px]" />
                {label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="mt-auto rounded-[24px] bg-motion-mint/70 p-4 dark:bg-emerald-400/10">
          <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-200">
            Verified campus access
          </p>
          <p className="mt-1 text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/75">
            Built for the NSUT student community.
          </p>
        </div>
      </aside>
    </>
  );
}
