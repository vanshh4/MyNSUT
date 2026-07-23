import { describe, expect, it } from "vitest";

import { onboardingFormSchema, previewRollNumber } from "./onboarding";

describe("onboarding validation", () => {
  it("accepts the supported sections", () => {
    for (const section of ["1", "2", "3"] as const) {
      expect(
        onboardingFormSchema.safeParse({ umsRollNumber: "2023UIT3324", section }).success
      ).toBe(true);
    }
  });

  it("rejects unsupported sections", () => {
    expect(
      onboardingFormSchema.safeParse({ umsRollNumber: "2023UIT3324", section: "4" }).success
    ).toBe(false);
  });

  it("previews normalized branch and graduation details", () => {
    expect(previewRollNumber(" 2023uin3324 ", 2026)).toEqual({
      normalizedRollNumber: "2023UIN3324",
      admissionYear: 2023,
      branchCode: "UIN",
      rollNumber: "3324",
      graduationYear: 2027,
    });
  });

  it.each(["2023XYZ3324", "2019UIT3324", "2027UIT3324", "invalid"])(
    "returns null for invalid preview input: %s",
    (value) => {
      expect(previewRollNumber(value, 2026)).toBeNull();
    }
  );
});
