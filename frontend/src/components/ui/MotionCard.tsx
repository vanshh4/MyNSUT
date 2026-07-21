"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface Props extends HTMLMotionProps<"div"> {
  children?: ReactNode;
}

export function MotionCard({
  className,
  children,
  ...props
}: Props) {
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