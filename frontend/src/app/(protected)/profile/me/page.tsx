"use client";
import { Award, BookOpen, Building2, GraduationCap, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { MotionCard } from "@/components/ui/MotionCard";
import { MotionButton } from "@/components/ui/MotionButton";
const detail = [
  { icon: Building2, text: "UIT" },
  { icon: GraduationCap, text: "2027" },
  { icon: UsersRound, text: "2 societies" },
  { icon: Award, text: "1 POR" },
];
const metrics = [
  ["CGPA", "8.72"],
  ["Latest SGPA", "8.91"],
  ["Branch rank", "18"],
  ["College rank", "96"],
];
export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Student profile"
        title="Vansh Bhardwaj"
        description="2023UIT3324 · Information Technology · Section 2"
        actions={<MotionButton variant="soft">Edit profile</MotionButton>}
      />
      <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
        <MotionCard className="p-7 text-center">
          <motion.div
            whileHover={{ rotate: 3, scale: 1.04 }}
            className="mx-auto grid size-24 place-items-center rounded-full bg-[#4968f2] text-2xl font-black text-white shadow-[0_18px_40px_rgba(73,104,242,.25)]"
          >
            VB
          </motion.div>
          <h2 className="display-font mt-5 text-2xl font-bold">Vansh Bhardwaj</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Information Technology · 2027</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            {detail.map(({ icon: Icon, text }) => (
              <div key={text} className="rounded-[22px] bg-white/55 p-4 dark:bg-white/5">
                <Icon className="size-4 text-[#4968f2]" />
                <p className="mt-2 text-xs font-bold">{text}</p>
              </div>
            ))}
          </div>
        </MotionCard>
        <div className="space-y-6">
          <MotionCard className="p-6">
            <div className="flex justify-between">
              <h2 className="display-font text-xl font-bold">Academic overview</h2>
              <BookOpen className="text-[#4968f2]" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map(([a, b]) => (
                <div key={a} className="rounded-[24px] bg-motion-ice/70 p-4 dark:bg-blue-400/10">
                  <p className="display-font text-2xl font-black">{b}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{a}</p>
                </div>
              ))}
            </div>
          </MotionCard>
          <MotionCard className="p-6">
            <h2 className="display-font text-xl font-bold">Societies & positions</h2>
            <div className="mt-4 rounded-[22px] bg-motion-mint/70 p-5 dark:bg-emerald-400/10">
              <p className="font-bold">IEEE NSUT</p>
              <p className="mt-1 text-xs text-[var(--muted)]">Technical team member</p>
            </div>
          </MotionCard>
        </div>
      </div>
    </>
  );
}
