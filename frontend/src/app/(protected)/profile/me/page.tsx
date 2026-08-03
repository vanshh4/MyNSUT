"use client";

import { Award, BookOpen, Building2, GraduationCap, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";

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
    <div className="w-full">
      <PageHeader
        eyebrow="Student profile"
        title="Vansh Bhardwaj"
        description="2023UIT3324 · Information Technology · Section 2"
        actions={<GlassButton variant="secondary" className="rounded-full font-label">Edit profile</GlassButton>}
      />
      
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <GlassCard className="p-8 text-center flex flex-col items-center" hoverEffect={false}>
          <motion.div
            whileHover={{ rotate: 3, scale: 1.04 }}
            className="grid w-28 h-28 place-items-center rounded-[28px] bg-primary dark:bg-primary-container text-4xl font-headline font-bold text-on-primary dark:text-on-primary-container shadow-lg mb-6"
          >
            VB
          </motion.div>
          <h2 className="font-headline text-3xl font-bold text-text-main">Vansh Bhardwaj</h2>
          <p className="mt-2 font-body text-base text-text-muted">Information Technology · 2027</p>
          
          <div className="mt-8 grid grid-cols-2 gap-4 w-full text-left">
            {detail.map(({ icon: Icon, text }) => (
              <motion.div key={text} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="rounded-2xl bg-black/5 dark:bg-white/5 p-4 flex flex-col transition-colors hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer">
                <Icon className="w-5 h-5 text-primary dark:text-primary-container mb-3" />
                <p className="font-label text-sm font-semibold text-text-main">{text}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
        
        <div className="space-y-6">
          <GlassCard className="p-8" hoverEffect={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-2xl font-bold text-text-main">Academic overview</h2>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary dark:text-primary-container" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map(([label, val]) => (
                <motion.div key={label} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="rounded-2xl bg-blue-50 dark:bg-[#e2e2e2]/10 p-5 flex flex-col items-center justify-center text-center hover:bg-blue-100 dark:hover:bg-[#e2e2e2]/20 transition-colors cursor-pointer">
                  <p className="font-headline text-3xl font-bold text-primary dark:text-[#ffffff] mb-1">{val}</p>
                  <p className="font-label text-[11px] font-semibold text-text-muted uppercase tracking-wider">{label}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
          
          <GlassCard className="p-8" hoverEffect={false}>
            <h2 className="font-headline text-2xl font-bold text-text-main mb-6">Societies & positions</h2>
            <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
              <div>
                <p className="font-body text-lg font-bold text-text-main">IEEE NSUT</p>
                <p className="font-body text-sm text-text-muted mt-1">Technical team member</p>
              </div>
              <GlassButton variant="secondary" className="rounded-full text-xs font-label">View role</GlassButton>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
