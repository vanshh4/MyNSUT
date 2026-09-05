"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "academic-glass rounded-2xl p-6 transition-colors",
          className
        )}
        whileHover={hoverEffect ? { y: -4, scale: 1.01 } : undefined}
        whileTap={hoverEffect ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", damping: 1, stiffness: 200 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";
