import type { BranchCode } from "../../constants/branches.js";
import type { SectionCode } from "../../constants/sections.js";

export interface ClassIdentity {
  admissionYear: number;
  branchCode: BranchCode;
  section: SectionCode;
}

export interface AssignedClass extends ClassIdentity {
  id: string;
  name: string;
}
