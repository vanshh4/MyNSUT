import "dotenv/config";

import { PrismaClient, RoleScope, ResourceType, ResourceStatus } from "@prisma/client";

import { PERMISSIONS } from "../src/constants/permissions.js";
import { ROLES } from "../src/constants/roles.js";
import { BRANCH_CODES } from "../src/constants/branches.js";
import { SECTIONS } from "../src/constants/sections.js";

const prisma = new PrismaClient();

const roleDefinitions = [
  { code: ROLES.SUPER_ADMIN, name: "Super Admin", scope: RoleScope.GLOBAL },
  { code: ROLES.STUDENT, name: "Student", scope: RoleScope.GLOBAL },
  { code: ROLES.CLASS_CR, name: "Class Representative", scope: RoleScope.CLASS },
  { code: ROLES.SOCIETY_PRESIDENT, name: "Society President", scope: RoleScope.SOCIETY },
  { code: ROLES.SOCIETY_VICE_PRESIDENT, name: "Society Vice President", scope: RoleScope.SOCIETY },
  { code: ROLES.SOCIETY_MEMBER, name: "Society Member", scope: RoleScope.SOCIETY },
] as const;

const studentPermissionCodes = [
  PERMISSIONS.AUTH_LOGIN,
  PERMISSIONS.ONBOARDING_COMPLETE_SELF,
  PERMISSIONS.PROFILE_VIEW_SELF,
  PERMISSIONS.PROFILE_VIEW_PUBLIC,
  PERMISSIONS.PROFILE_UPDATE_SELF,
  PERMISSIONS.PRIVACY_UPDATE_SELF,
  PERMISSIONS.ACADEMIC_VIEW_SELF,
  PERMISSIONS.ACADEMIC_VIEW_PUBLIC_IF_ALLOWED,
  PERMISSIONS.CLASS_VIEW_OWN,
  PERMISSIONS.CLASS_VIEW_MEMBERS_OWN,
  PERMISSIONS.CLASS_ANNOUNCEMENT_VIEW,
  PERMISSIONS.CLASS_TASK_COMPLETE_SELF,
  PERMISSIONS.NOTICE_VIEW,
  PERMISSIONS.SOCIETY_VIEW_PUBLIC,
  PERMISSIONS.SOCIETY_ACCEPT_INVITE_SELF,
  PERMISSIONS.SOCIETY_REQUEST_MEMBERSHIP_SELF,
  PERMISSIONS.EVENT_VIEW,
  PERMISSIONS.EVENT_MARK_INTERESTED,
  PERMISSIONS.EVENT_REGISTER_SELF,
  PERMISSIONS.EVENT_CANCEL_REGISTRATION_SELF,
  PERMISSIONS.EVENT_JOIN_WAITLIST,
  PERMISSIONS.FILE_UPLOAD_PROFILE_IMAGE,
  PERMISSIONS.RESOURCE_VIEW_PUBLIC,
] as const;

const classCrPermissionCodes = [
  ...studentPermissionCodes,
  PERMISSIONS.CLASS_ANNOUNCEMENT_CREATE,
  PERMISSIONS.CLASS_ANNOUNCEMENT_UPDATE,
  PERMISSIONS.CLASS_ANNOUNCEMENT_DELETE,
  PERMISSIONS.CLASS_TASK_VIEW_COMPLETION_SUMMARY,
] as const;

const societyPresidentPermissionCodes = [
  ...studentPermissionCodes,
  PERMISSIONS.SOCIETY_UPDATE_PROFILE,
  PERMISSIONS.SOCIETY_INVITE_MEMBER,
  PERMISSIONS.SOCIETY_REVIEW_JOIN_REQUEST,
  PERMISSIONS.SOCIETY_REMOVE_MEMBER,
  PERMISSIONS.SOCIETY_VIEW_PRIVATE_SPACE,
  PERMISSIONS.SOCIETY_ASSIGN_POR,
  PERMISSIONS.NOTICE_CREATE_SOCIETY,
  PERMISSIONS.NOTICE_UPDATE_OWN,
  PERMISSIONS.NOTICE_DELETE,
  PERMISSIONS.EVENT_CREATE,
  PERMISSIONS.EVENT_UPDATE_OWN_SOCIETY,
  PERMISSIONS.EVENT_CANCEL,
  PERMISSIONS.EVENT_VIEW_REGISTRATIONS,
  PERMISSIONS.EVENT_EXPORT_REGISTRATIONS,
  PERMISSIONS.FILE_UPLOAD_NOTICE_ATTACHMENT,
  PERMISSIONS.FILE_UPLOAD_EVENT_POSTER,
  PERMISSIONS.ROLE_ASSIGN_SOCIETY,
] as const;

const societyVicePresidentPermissionCodes = [
  ...studentPermissionCodes,
  PERMISSIONS.SOCIETY_UPDATE_PROFILE,
  PERMISSIONS.SOCIETY_INVITE_MEMBER,
  PERMISSIONS.SOCIETY_REVIEW_JOIN_REQUEST,
  PERMISSIONS.SOCIETY_REMOVE_MEMBER,
  PERMISSIONS.SOCIETY_VIEW_PRIVATE_SPACE,
  PERMISSIONS.SOCIETY_ASSIGN_POR,
  PERMISSIONS.NOTICE_CREATE_SOCIETY,
  PERMISSIONS.NOTICE_UPDATE_OWN,
  PERMISSIONS.EVENT_CREATE,
  PERMISSIONS.EVENT_UPDATE_OWN_SOCIETY,
  PERMISSIONS.EVENT_CANCEL,
  PERMISSIONS.EVENT_VIEW_REGISTRATIONS,
  PERMISSIONS.EVENT_EXPORT_REGISTRATIONS,
  PERMISSIONS.FILE_UPLOAD_NOTICE_ATTACHMENT,
  PERMISSIONS.FILE_UPLOAD_EVENT_POSTER,
  PERMISSIONS.ROLE_ASSIGN_SOCIETY,
] as const;

const societyMemberPermissionCodes = [
  ...studentPermissionCodes,
  PERMISSIONS.SOCIETY_VIEW_PRIVATE_SPACE,
] as const;

async function seedPermissions(): Promise<void> {
  await Promise.all(
    Object.values(PERMISSIONS).map((code) =>
      prisma.permission.upsert({
        where: { code },
        update: {},
        create: { code, description: code.toLowerCase().replaceAll("_", " ") },
      })
    )
  );
}

async function seedRoles(): Promise<void> {
  await Promise.all(
    roleDefinitions.map((role) =>
      prisma.role.upsert({ where: { code: role.code }, update: role, create: role })
    )
  );
}

async function grantPermissions(
  roleCode: string,
  permissionCodes: readonly string[]
): Promise<void> {
  const [role, permissions] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { code: roleCode } }),
    prisma.permission.findMany({ where: { code: { in: [...permissionCodes] } } }),
  ]);

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id })),
    skipDuplicates: true,
  });
}

async function seedRolePermissions(): Promise<void> {
  await grantPermissions(ROLES.SUPER_ADMIN, Object.values(PERMISSIONS));
  await grantPermissions(ROLES.STUDENT, studentPermissionCodes);
  await grantPermissions(ROLES.CLASS_CR, classCrPermissionCodes);
  await grantPermissions(ROLES.SOCIETY_PRESIDENT, societyPresidentPermissionCodes);
  await grantPermissions(ROLES.SOCIETY_VICE_PRESIDENT, societyVicePresidentPermissionCodes);
  await grantPermissions(ROLES.SOCIETY_MEMBER, societyMemberPermissionCodes);
}

async function seedOptionalSuperAdmin(): Promise<string | undefined> {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return undefined;

  if (!email.endsWith("@nsut.ac.in")) {
    throw new Error("SUPER_ADMIN_EMAIL must use the @nsut.ac.in domain.");
  }

  const role = await prisma.role.findUniqueOrThrow({ where: { code: ROLES.SUPER_ADMIN } });
  const user = await prisma.user.upsert({
    where: { email },
    update: { status: "ACTIVE" },
    create: {
      email,
      fullName: process.env.SUPER_ADMIN_NAME?.trim() || "MyNSUT Administrator",
      emailVerified: true,
      onboardingCompleted: false,
    },
  });

  await prisma.userGlobalRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  return user.id;
}

async function seedPrivacyDefaults(): Promise<void> {
  const students = await prisma.student.findMany({
    where: { privacySettings: null },
  });

  if (students.length === 0) return;

  await prisma.studentPrivacySettings.createMany({
    data: students.map((student) => ({
      studentId: student.id,
      bioVisibility: "PLATFORM_ONLY",
      socialLinksVisibility: "PLATFORM_ONLY",
      academicSummaryVisibility: "PLATFORM_ONLY",
      semesterResultsVisibility: "PLATFORM_ONLY",
    })),
    skipDuplicates: true,
  });

  await prisma.studentProfile.createMany({
    data: students.map((student) => ({
      studentId: student.id,
    })),
    skipDuplicates: true,
  });
}

async function seedDefaultAcademicClasses(): Promise<void> {
  const cohorts = [2022, 2023, 2024, 2025];
  for (const year of cohorts) {
    for (const branch of BRANCH_CODES) {
      for (const section of SECTIONS) {
        const name = `${branch}-${year.toString().slice(-2)}-${section}`;
        await prisma.academicClass.upsert({
          where: {
            admissionYear_branchCode_section: {
              admissionYear: year,
              branchCode: branch,
              section,
            },
          },
          update: {},
          create: {
            name,
            admissionYear: year,
            branchCode: branch,
            section,
            status: "ACTIVE",
          },
        });
      }
    }
  }
}

const DEFAULT_SUBJECTS = [
  { code: "BAS101", name: "Applied Mathematics I", credits: 4 },
  { code: "BAS102", name: "Applied Physics", credits: 4 },
  { code: "BAS103", name: "Applied Chemistry", credits: 4 },
  { code: "BAS201", name: "Applied Mathematics II", credits: 4 },
  { code: "UCS201", name: "Data Structures & Algorithms", credits: 4 },
  { code: "UCS202", name: "Object Oriented Programming", credits: 4 },
  { code: "UCS301", name: "Database Management Systems", credits: 4 },
  { code: "UCS302", name: "Operating Systems", credits: 4 },
  { code: "UCS303", name: "Computer Networks", credits: 4 },
  { code: "UIT201", name: "Web Technology & Applications", credits: 4 },
  { code: "UEC201", name: "Analog Electronics", credits: 4 },
  { code: "UEC301", name: "Digital Signal Processing", credits: 4 },
];

async function seedDefaultSubjects(): Promise<void> {
  await Promise.all(
    DEFAULT_SUBJECTS.map((subject) =>
      prisma.subject.upsert({
        where: { code: subject.code },
        update: { name: subject.name, credits: subject.credits },
        create: subject,
      })
    )
  );
}

async function seedDefaultResources(adminUserId?: string): Promise<void> {
  const creator = adminUserId
    ? await prisma.user.findUnique({ where: { id: adminUserId } })
    : await prisma.user.findFirst();

  if (!creator) {
    return;
  }

  const defaultResources = [
    {
      title: "Mid-Semester Examination 2024 - Applied Mathematics I",
      description: "Official question paper with detailed solutions and marking scheme.",
      resourceType: ResourceType.PYQ,
      subjectCode: "BAS101",
      subjectName: "Applied Mathematics I",
      department: "Mathematics",
      semester: 1,
      academicYear: 2024,
      examSession: "Mid-Semester",
      fileUrl: "https://drive.google.com/file/d/1example-midsem-maths/view",
      source: "Academic Cell",
      status: ResourceStatus.PUBLISHED,
      creatorId: creator.id,
    },
    {
      title: "Data Structures & Algorithms - Lecture Notes",
      description: "Comprehensive lecture slides and handwritten notes covering trees, graphs, and dynamic programming.",
      resourceType: ResourceType.NOTE,
      subjectCode: "UCS201",
      subjectName: "Data Structures & Algorithms",
      department: "Computer Science & Engineering",
      semester: 3,
      academicYear: 2024,
      examSession: "Autumn",
      fileUrl: "https://drive.google.com/file/d/1example-dsa-notes/view",
      source: "Department of CSE",
      status: ResourceStatus.PUBLISHED,
      creatorId: creator.id,
    },
    {
      title: "Introduction to Algorithms (CLRS) - Study Guide",
      description: "Curated reference notes and practice problems aligned with the NSUT syllabus.",
      resourceType: ResourceType.REFERENCE,
      subjectCode: "UCS201",
      subjectName: "Data Structures & Algorithms",
      department: "Computer Science & Engineering",
      semester: 3,
      academicYear: 2024,
      examSession: "Autumn",
      fileUrl: "https://drive.google.com/file/d/1example-clrs-guide/view",
      source: "Faculty Reference",
      status: ResourceStatus.PUBLISHED,
      creatorId: creator.id,
    },
    {
      title: "Database Management Systems - End-Semester 2023",
      description: "Past year end-semester exam paper covering SQL, normalization, and concurrency control.",
      resourceType: ResourceType.PYQ,
      subjectCode: "UCS301",
      subjectName: "Database Management Systems",
      department: "Computer Science & Engineering",
      semester: 5,
      academicYear: 2023,
      examSession: "End-Semester",
      fileUrl: "https://drive.google.com/file/d/1example-dbms-pyq/view",
      source: "Academic Cell",
      status: ResourceStatus.PUBLISHED,
      creatorId: creator.id,
    },
  ];

  for (const r of defaultResources) {
    const existing = await prisma.resource.findFirst({
      where: { title: r.title, subjectCode: r.subjectCode },
    });
    if (!existing) {
      await prisma.resource.create({ data: r });
    }
  }
}

async function main(): Promise<void> {
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  const superAdminId = await seedOptionalSuperAdmin();
  await seedPrivacyDefaults();
  await seedDefaultAcademicClasses();
  await seedDefaultSubjects();
  await seedDefaultResources(superAdminId);
  console.log("MyNSUT Phase 9 baseline seed completed successfully.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
