"use client";
import { ExternalLink, Search } from "lucide-react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
const rows = [
  "End-semester examination schedule",
  "University holiday notification",
  "Course registration window",
];
export default function Page() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Official updates"
        title="Notices & circulars"
        description="Admin-selected updates in one clear, reliable feed."
      />
      <div className="relative mb-6 max-w-xl">
        <Search className="absolute top-1/2 left-135 size-4 -translate-y-1/2 text-slate-400" />
        <input className="pill-input pl-11" placeholder="Search notices" />
      </div>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="space-y-4"
      >
        {rows.map((r, i) => (
          <motion.div
            key={r}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          >
            <MotionCard className="flex items-center justify-between p-5">
              <div>
                <span className="rounded-full bg-motion-ice px-3 py-1 text-[11px] font-extrabold text-[#4968f2]">
                  {i === 1 ? "Holiday" : "Academic"}
                </span>
                <h2 className="mt-3 font-bold">{r}</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">Published recently</p>
              </div>
              <ExternalLink className="size-4 text-slate-400" />
            </MotionCard>
          </motion.div>
        ))}
      </motion.div>
    </AppShell>
  );
}
