"use client";

import { SECTIONS, type SectionCode } from "@mynsut/shared/types/student";

interface SectionSelectProps {
  value: SectionCode | "";
  onChange: (value: SectionCode | "") => void;
  disabled?: boolean;
  error?: string;
}

export function SectionSelect({ value, onChange, disabled, error }: SectionSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block font-label text-sm font-semibold text-text-main">Section</span>
      <select
        className="w-full bg-primary/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as SectionCode | "")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "section-error" : undefined}
      >
        <option value="">Select your section</option>
        {SECTIONS.map((section) => (
          <option key={section} value={section}>
            Section {section}
          </option>
        ))}
      </select>
      {error ? (
        <p id="section-error" className="mt-2 font-label text-xs font-semibold text-error">
          {error}
        </p>
      ) : null}
    </label>
  );
}
