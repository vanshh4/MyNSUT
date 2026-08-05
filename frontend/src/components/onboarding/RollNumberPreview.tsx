"use client";

import type { ParsedRollNumber } from "@mynsut/shared/types/student";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { branchLabel } from "@/lib/validations/onboarding";

export function RollNumberPreview({ value }: { value: ParsedRollNumber | null }) {
  if (!value) {
    return (
      <div className="rounded-xl border border-dashed border-glass-border p-5 text-sm font-body text-text-muted bg-primary/5 dark:bg-white/5 shadow-inner">
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
      className="rounded-xl bg-primary/5 dark:bg-white/5 border border-glass-border p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-label font-bold text-primary">
        <CheckCircle2 className="size-4" />
        Roll number recognized
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {fields.map(([label, fieldValue]) => (
          <div key={label}>
            <dt className="text-[10px] font-label font-bold tracking-[0.12em] text-text-muted uppercase">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-body font-bold text-text-main">
              {fieldValue}
            </dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
