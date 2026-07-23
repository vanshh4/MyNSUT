import { describe, expect, it } from "vitest";

import { parseUmsRollNumber } from "../../src/modules/students/rollNumber.service.js";

const validBranches = ["UCS", "UIT", "UIN", "UBT", "UEC", "UIC", "UEE", "UME", "UCM"];

describe("parseUmsRollNumber", () => {
  it.each(validBranches)("parses the supported %s branch", (branchCode) => {
    expect(parseUmsRollNumber(`2023${branchCode}3324`, 2026)).toEqual({
      normalizedRollNumber: `2023${branchCode}3324`,
      admissionYear: 2023,
      branchCode,
      rollNumber: "3324",
      graduationYear: 2027,
    });
  });

  it("normalizes lowercase input and surrounding spaces", () => {
    expect(parseUmsRollNumber(" 2023uit3324 ", 2026).normalizedRollNumber).toBe("2023UIT3324");
  });

  it.each(["", "2023", "UIT3324", "2023UIT", "2023-UI-3324"])("rejects malformed input: %s", (value) => {
    expect(() => parseUmsRollNumber(value, 2026)).toThrow();
  });

  it("rejects unsupported branches", () => {
    expect(() => parseUmsRollNumber("2023XYZ3324", 2026)).toThrow(/unsupported branch/i);
  });

  it("rejects admission years outside the supported range", () => {
    expect(() => parseUmsRollNumber("2019UIT3324", 2026)).toThrow(/admission year/i);
    expect(() => parseUmsRollNumber("2027UIT3324", 2026)).toThrow(/admission year/i);
  });
});
