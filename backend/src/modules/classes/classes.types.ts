import type { BranchCode } from "@mynsut/shared/constants/branches";
import type { SectionCode } from "@mynsut/shared/types/student";

export interface ClassIdentity {
  admissionYear: number;
  branchCode: BranchCode;
  section: SectionCode;
}

export interface AssignedClass extends ClassIdentity {
  id: string;
  name: string;
}
