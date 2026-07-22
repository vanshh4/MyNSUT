import "dotenv/config";

import { PrismaClient, RoleScope } from "@prisma/client";

import { PERMISSIONS } from "../src/constants/permissions.js";
import { ROLES } from "../src/constants/roles.js";

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

async function grantPermissions(roleCode: string, permissionCodes: readonly string[]): Promise<void> {
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
}

async function seedOptionalSuperAdmin(): Promise<void> {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;

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
}

async function main(): Promise<void> {
  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();
  await seedOptionalSuperAdmin();
  console.log("MyNSUT Phase 2 seed completed successfully.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
