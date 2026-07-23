"use client";

import { motion } from "framer-motion";

import { AppLogo } from "@/components/common/AppLogo";

export function LoadingScreen({ message = "Preparing your campus space…" }: { message?: string }) {
  return (
    <main className="motion-page grid min-h-screen place-items-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="glass flex w-full max-w-sm flex-col items-center rounded-[34px] p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <AppLogo />
        <div className="mt-8 flex gap-2" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="size-2.5 rounded-full bg-[#4968f2]"
              animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.12 }}
            />
          ))}
        </div>
        <p className="mt-5 text-sm font-semibold text-[var(--muted)]">{message}</p>
      </motion.div>
    </main>
  );
}
