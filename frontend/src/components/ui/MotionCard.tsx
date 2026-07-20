"use client";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
export function MotionCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("soft-card", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
