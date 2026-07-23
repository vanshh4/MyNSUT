"use client";

import type { SectionCode } from "@mynsut/shared/types/student";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { RollNumberPreview } from "@/components/onboarding/RollNumberPreview";
import { SectionSelect } from "@/components/onboarding/SectionSelect";
import { MotionButton } from "@/components/ui/MotionButton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { ApiClientError } from "@/lib/api/client";
import { submitOnboarding } from "@/lib/api/students";
import {
  onboardingFormSchema,
  previewRollNumber,
} from "@/lib/validations/onboarding";

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
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      <label className="block">
        <span className="mb-2 block text-sm font-bold">UMS roll number</span>
        <input
          className="pill-input uppercase"
          value={umsRollNumber}
          onChange={(event) => setUmsRollNumber(event.target.value.toUpperCase())}
          placeholder="2023UIN3324"
          autoComplete="off"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.umsRollNumber)}
          aria-describedby={errors.umsRollNumber ? "roll-number-error" : undefined}
        />
        {errors.umsRollNumber ? (
          <p id="roll-number-error" className="mt-2 text-xs font-semibold text-rose-600">
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

      <div className="flex gap-3 rounded-[24px] bg-motion-ice p-4 text-xs leading-5 text-blue-900 dark:bg-blue-400/10 dark:text-blue-100">
        <CheckCircle2 className="size-4 shrink-0" />
        Your roll number can only be corrected later by an administrator.
      </div>

      {errors.form ? (
        <div className="flex gap-3 rounded-[24px] bg-motion-rose p-4 text-sm text-rose-800" role="alert">
          <AlertCircle className="size-5 shrink-0" />
          {errors.form}
        </div>
      ) : null}

      <MotionButton className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {isSubmitting ? "Completing onboarding…" : "Complete onboarding"}
      </MotionButton>
    </form>
  );
}
