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
      <span className="mb-2 block text-sm font-bold">Section</span>
      <select
        className="pill-input"
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
        <p id="section-error" className="mt-2 text-xs font-semibold text-rose-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}
