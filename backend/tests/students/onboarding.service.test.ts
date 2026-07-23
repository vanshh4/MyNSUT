import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  $transaction: vi.fn(),
}));
vi.mock("../../src/db/prisma.js", () => ({ prisma: prismaMock }));

const studentsRepository = vi.hoisted(() => ({
  findStudentByUserId: vi.fn(), findStudentByRollNumber: vi.fn(),
  createStudentAndCompleteOnboarding: vi.fn(),
}));
vi.mock("../../src/modules/students/students.repository.js", () => studentsRepository);

const resolveExistingClass = vi.fn();
vi.mock("../../src/modules/classes/classAssignment.service.js", () => ({ resolveExistingClass }));

const { completeOnboarding } = await import("../../src/modules/students/students.service.js");

const storedStudent = {
  id: "student-id", userId: "user-id", classId: "class-id", umsRollNumber: "2023UIT3324",
  admissionYear: 2023, branchCode: "UIT", rollNumber: "3324", section: "2",
  graduationYear: 2027, currentSemester: null, academicClass: {}, user: {},
};

describe("completeOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-id", onboardingCompleted: false, student: null });
    studentsRepository.findStudentByRollNumber.mockResolvedValue(null);
    resolveExistingClass.mockResolvedValue({ id: "class-id", name: "2023 UIT Section 2" });
    studentsRepository.createStudentAndCompleteOnboarding.mockResolvedValue(storedStudent);
    prismaMock.$transaction.mockImplementation(async (callback: (tx: object) => Promise<unknown>) => callback({}));
  });

  it("creates the student in one transaction after resolving an existing class", async () => {
    await expect(completeOnboarding("user-id", { umsRollNumber: "2023uit3324", section: "2" })).resolves.toMatchObject({
      id: "student-id", branchCode: "UIT", section: "2", classId: "class-id",
    });
    expect(resolveExistingClass).toHaveBeenCalledWith(expect.anything(), { admissionYear: 2023, branchCode: "UIT", section: "2" });
    expect(studentsRepository.createStudentAndCompleteOnboarding).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ userId: "user-id", classId: "class-id" }));
  });

  it("rejects repeated onboarding", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-id", onboardingCompleted: true, student: storedStudent });
    await expect(completeOnboarding("user-id", { umsRollNumber: "2023UIT3324", section: "2" })).rejects.toMatchObject({ code: "ONBOARDING_ALREADY_COMPLETED" });
  });

  it("rejects a duplicate roll number", async () => {
    studentsRepository.findStudentByRollNumber.mockResolvedValue(storedStudent);
    await expect(completeOnboarding("user-id", { umsRollNumber: "2023UIT3324", section: "2" })).rejects.toMatchObject({ code: "ROLL_NUMBER_ALREADY_REGISTERED" });
  });

  it("rejects onboarding when the class does not exist", async () => {
    resolveExistingClass.mockRejectedValue(Object.assign(new Error("Class unavailable"), { code: "CLASS_NOT_AVAILABLE" }));
    await expect(completeOnboarding("user-id", { umsRollNumber: "2023UIT3324", section: "2" })).rejects.toMatchObject({ code: "CLASS_NOT_AVAILABLE" });
  });
});
