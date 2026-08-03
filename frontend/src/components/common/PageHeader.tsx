"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 170, damping: 21 }}
      className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && <p className="font-label text-xs text-primary uppercase tracking-wider mb-2 font-semibold">{eyebrow}</p>}
        <h1 className="font-headline text-4xl text-primary dark:text-primary-container font-bold mb-3 tracking-tight">{title}</h1>
        {description && (
          <p className="font-body text-lg text-text-muted max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </motion.header>
  );
}
