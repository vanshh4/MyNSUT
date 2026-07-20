"use client";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="soft-card flex min-h-72 flex-col items-center justify-center p-9 text-center"
    >
      <span className="grid size-14 place-items-center rounded-full bg-motion-ice text-[#4968f2]">
        <Icon />
      </span>
      <h2 className="display-font mt-5 text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}
