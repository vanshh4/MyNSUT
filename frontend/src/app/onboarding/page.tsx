"use client";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AppLogo } from "@/components/common/AppLogo";
import { MotionButton } from "@/components/ui/MotionButton";
export default function Page() {
  return (
    <main className="motion-page min-h-screen px-5 py-7">
      <div className="mx-auto max-w-xl">
        <AppLogo />
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="glass mt-12 rounded-[36px] p-7 sm:p-9"
        >
          <p className="eyebrow">Getting started</p>
          <h1 className="page-title mt-3">Make MyNSUT yours.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Enter your UMS roll number and choose your section. We will derive your branch and
            admission year.
          </p>
          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">UMS roll number</span>
              <input className="pill-input" placeholder="2023UIT3324" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                disabled
                className="pill-input opacity-70"
                value="Admission year · Auto"
                readOnly
              />
              <input disabled className="pill-input opacity-70" value="Branch · Auto" readOnly />
            </div>
            <select className="pill-input">
              <option>Select your section</option>
              <option>Section 1</option>
              <option>Section 2</option>
            </select>
            <div className="flex gap-3 rounded-[24px] bg-motion-mint p-4 text-xs leading-5 text-emerald-800">
              <CheckCircle2 className="size-4 shrink-0" />
              Your roll number can only be corrected later by an administrator.
            </div>
            <MotionButton className="w-full">Complete onboarding</MotionButton>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
