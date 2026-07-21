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

async function seedPermissions() {
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

async function seedRoles() {
  await Promise.all(
    roleDefinitions.map((role) =>
      prisma.role.upsert({ where: { code: role.code }, update: role, create: role })
    )
  );
}

async function grantSuperAdminPermissions() {
  const [role, permissions] = await Promise.all([
    prisma.role.findUniqueOrThrow({ where: { code: ROLES.SUPER_ADMIN } }),
    prisma.permission.findMany(),
  ]);

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({ roleId: role.id, permissionId: permission.id })),
    skipDuplicates: true,
  });
}

async function seedOptionalSuperAdmin() {
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

async function main() {
  await seedPermissions();
  await seedRoles();
  await grantSuperAdminPermissions();
  await seedOptionalSuperAdmin();
  console.log("MyNSUT database seed completed successfully.");
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
