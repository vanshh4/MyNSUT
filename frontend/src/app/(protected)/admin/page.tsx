"use client";
import { Building2, FileSearch, Megaphone, ShieldCheck, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
const modules = [
  { i: UsersRound, t: "Users & roles", x: "Search students and assign scoped roles." },
  { i: Building2, t: "Classes & societies", x: "Manage academic groups and campus communities." },
  { i: Megaphone, t: "Notice selection", x: "Publish selected metadata and source links." },
  { i: FileSearch, t: "Gazette processing", x: "Upload reports and review parser errors." },
];
export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Super Admin"
        title="Administration"
        description="Clear controls for sensitive, audited platform operations."
        actions={
          <span className="inline-flex items-center gap-2 rounded-full bg-motion-mint px-4 py-2 text-xs font-black text-emerald-700">
            <ShieldCheck className="size-4" />
            Authorized
          </span>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {modules.map(({ i: Icon, t, x }, n) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: n * 0.07, type: "spring" }}
          >
            <MotionCard className="p-6">
              <span className="grid size-14 place-items-center rounded-full bg-motion-lilac text-violet-600">
                <Icon />
              </span>
              <h2 className="display-font mt-5 text-xl font-bold">{t}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{x}</p>
              <button className="mt-5 rounded-full bg-white/60 px-4 py-2 text-sm font-bold text-[#4968f2] dark:bg-white/5">
                Open module →
              </button>
            </MotionCard>
          </motion.div>
        ))}
      </div>
    </>
  );
}
