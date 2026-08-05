"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function LoadingScreen({ message = "Preparing your campus space…" }: { message?: string }) {
  return (
    <main className="grid min-h-screen place-items-center px-5 bg-background text-text-main">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="w-full max-w-sm"
        role="status"
        aria-live="polite"
      >
        <GlassCard className="flex flex-col items-center p-10 text-center rounded-[32px] shadow-sm" hoverEffect={false}>
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary shadow-sm mb-4">
            <GraduationCap className="w-8 h-8" />
          </div>
          
          <div className="mt-4 flex gap-2" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.12 }}
              />
            ))}
          </div>
          
          <p className="mt-8 font-label text-sm font-semibold text-text-muted uppercase tracking-widest">
            {message}
          </p>
        </GlassCard>
      </motion.div>
    </main>
  );
}
