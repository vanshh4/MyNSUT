"use client";

import type { SectionCode } from "@mynsut/shared/types/student";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { RollNumberPreview } from "@/components/onboarding/RollNumberPreview";
import { SectionSelect } from "@/components/onboarding/SectionSelect";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { ApiClientError } from "@/lib/api/client";
import { submitOnboarding } from "@/lib/api/students";
import { onboardingFormSchema, previewRollNumber } from "@/lib/validations/onboarding";

interface FormErrors {
  umsRollNumber?: string;
  section?: string;
  form?: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const [umsRollNumber, setUmsRollNumber] = useState("");
  const [section, setSection] = useState<SectionCode | "">("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rollPreview = useMemo(() => previewRollNumber(umsRollNumber), [umsRollNumber]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = onboardingFormSchema.safeParse({ umsRollNumber, section });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        umsRollNumber: fieldErrors.umsRollNumber?.[0],
        section: fieldErrors.section?.[0],
      });
      return;
    }

    if (!rollPreview) {
      setErrors({ umsRollNumber: "Use a valid supported UMS roll number." });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOnboarding({
        umsRollNumber: rollPreview.normalizedRollNumber,
        section: parsed.data.section,
      });
      const user = await refreshAuth();
      router.replace(user?.onboardingCompleted ? routes.dashboard : routes.onboarding);
    } catch (caught: unknown) {
      const message =
        caught instanceof ApiClientError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : "Onboarding could not be completed.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
      <label className="block">
        <span className="mb-2 block font-label text-sm font-semibold text-text-main">UMS roll number</span>
        <input
          className="w-full bg-primary/5 dark:bg-white/5 border border-glass-border rounded-xl px-4 py-3 font-body text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase placeholder:text-text-muted/50 placeholder:normal-case"
          value={umsRollNumber}
          onChange={(event) => setUmsRollNumber(event.target.value.toUpperCase())}
          placeholder="e.g. 2023UIN3324"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.umsRollNumber)}
          aria-describedby={errors.umsRollNumber ? "roll-number-error" : undefined}
        />
        {errors.umsRollNumber ? (
          <p id="roll-number-error" className="mt-2 font-label text-xs font-semibold text-error">
            {errors.umsRollNumber}
          </p>
        ) : null}
      </label>

      <RollNumberPreview value={rollPreview} />

      <SectionSelect
        value={section}
        onChange={setSection}
        disabled={isSubmitting}
        error={errors.section}
      />

      <div className="flex gap-3 rounded-xl bg-primary/5 dark:bg-white/5 border border-glass-border p-4 text-xs font-label leading-5 text-text-main shadow-sm">
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
        Your roll number can only be corrected later by an administrator.
      </div>

      {errors.form ? (
        <div
          className="flex gap-3 rounded-xl bg-error-container/20 border border-error/20 p-4 font-label text-sm text-error shadow-sm"
          role="alert"
        >
          <AlertCircle className="size-5 shrink-0" />
          {errors.form}
        </div>
      ) : null}

      <button
        className="w-full bg-surface border border-glass-border rounded-xl py-3 px-6 flex items-center justify-center gap-3 hover:bg-glass-surface dark:hover:bg-white/10 transition-colors duration-300 active:scale-95 shadow-sm disabled:opacity-50 mt-4"
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? <LoaderCircle className="w-5 h-5 text-primary animate-spin" /> : null}
        <span className="font-label text-sm font-semibold text-text-main">
          {isSubmitting ? "Completing onboarding…" : "Complete onboarding"}
        </span>
      </button>
    </form>
  );
}
