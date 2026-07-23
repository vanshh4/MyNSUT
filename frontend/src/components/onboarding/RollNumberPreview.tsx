"use client";

import type { ParsedRollNumber } from "@mynsut/shared/types/student";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { branchLabel } from "@/lib/validations/onboarding";

export function RollNumberPreview({ value }: { value: ParsedRollNumber | null }) {
  if (!value) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--line)] p-5 text-sm text-[var(--muted)]">
        Enter a supported UMS roll number to preview the derived student details.
      </div>
    );
  }

  const fields = [
    ["Admission year", String(value.admissionYear)],
    ["Branch", branchLabel(value.branchCode)],
    ["Student roll", value.rollNumber],
    ["Graduation year", String(value.graduationYear)],
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[26px] bg-motion-mint/80 p-5 dark:bg-emerald-400/10"
    >
      <div className="flex items-center gap-2 text-sm font-black text-emerald-800 dark:text-emerald-200">
        <CheckCircle2 className="size-4" />
        Roll number recognized
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {fields.map(([label, fieldValue]) => (
          <div key={label}>
            <dt className="text-[10px] font-extrabold tracking-[0.12em] text-emerald-700/70 uppercase dark:text-emerald-300/65">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-bold text-emerald-950 dark:text-emerald-100">
              {fieldValue}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
