"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "soft" | "ghost" | "danger";
}
export function MotionButton({ children, className, variant = "primary", ...props }: Props) {
  const style = {
    primary: "bg-[#4968f2] text-white shadow-[0_12px_30px_rgba(73,104,242,.28)]",
    soft: "bg-[#e8edff] text-[#334cc5] dark:bg-blue-400/10 dark:text-blue-200",
    ghost:
      "bg-white/55 text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10",
    danger: "bg-rose-500 text-white",
  }[variant];
  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold disabled:pointer-events-none disabled:opacity-50",
        style,
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
